import type { Address } from "../entities/address";
import type { Client } from "../entities/client";
import type { Response } from "../protocols/controller";
import type { Validation } from "../protocols/validation";
import type { FindOneAddressByCEPRepository } from "../repositories/find-one-address-by-cep-repository";
import type { FindOneClientByEmailRepository } from "../repositories/find-one-client-by-email-repository";
import type { CreateClientRepository } from "../repositories/create-client-repository";

import {
  CreateClientController,
  CreateClientRequest,
} from "./create-client-controller";

jest.mock("node:crypto", () => ({
  randomUUID: () => "bd981cab-d315-4486-85c7-c6af24c475f9",
}));

describe("CreateClientController", () => {
  let client: Client;
  let validation: Validation;
  let findOneAddressByCEPRepository: FindOneAddressByCEPRepository;
  let findOneClientByEmailRepository: FindOneClientByEmailRepository;
  let createClientRepository: CreateClientRepository;
  let createClientController: CreateClientController;
  let request: CreateClientRequest;

  beforeAll(() => {
    client = {
      id: "bd981cab-d315-4486-85c7-c6af24c475f9",
      name: "João",
      email: "joao@autovist.com.br",
      phone: "11999887766",
      address: {
        cep: "01001000",
        street: "Praça da Sé",
        neighborhood: "Sé",
        city: "São Paulo",
        state: "SP",
      },
    };

    validation = {
      validate(): Error | null {
        return null;
      },
    };

    findOneAddressByCEPRepository = {
      async findOneByCEP(): Promise<Address | null> {
        return client.address;
      },
    };

    findOneClientByEmailRepository = {
      async findOneByEmail(): Promise<Client | null> {
        return null;
      },
    };

    createClientRepository = {
      async create(): Promise<void> {
        //
      },
    };

    createClientController = new CreateClientController({
      validation,
      findOneAddressByCEPRepository,
      findOneClientByEmailRepository,
      createClientRepository,
    });

    request = {
      query: {},
      params: {},
      body: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        cep: client.address.cep,
      },
    };
  });

  it("should return 400 if validation fail", async () => {
    const error = new Error("validation failed");

    jest.spyOn(validation, "validate").mockReturnValueOnce(error);

    const response = await createClientController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should return 400 if cep does not exist", async () => {
    jest
      .spyOn(findOneAddressByCEPRepository, "findOneByCEP")
      .mockResolvedValueOnce(null);

    const response = await createClientController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "CEP não existente" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should return 400 if client already exists with the same email", async () => {
    jest
      .spyOn(findOneClientByEmailRepository, "findOneByEmail")
      .mockResolvedValueOnce(client);

    const response = await createClientController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Já existe um cliente com este e-mail" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should create a new client and return 201", async () => {
    const createSpy = jest.spyOn(createClientRepository, "create");

    const response = await createClientController.handle(request);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(client);

    const expectedResponse: Response = {
      statusCode: 201,
      body: client,
    };

    expect(response).toEqual(expectedResponse);
  });
});
