import type { Address } from "../entities/address";
import type { Client } from "../entities/client";
import type { Cache } from "../protocols/cache";
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
  let cache: Cache;
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

    cache = {
      async get<T>(): Promise<T | undefined> {
        return client.address as T;
      },

      async set(): Promise<void> {
        //
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
      cache,
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

  afterEach(() => {
    jest.restoreAllMocks();
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
    jest.spyOn(cache, "get").mockResolvedValueOnce(undefined);

    jest
      .spyOn(findOneAddressByCEPRepository, "findOneByCEP")
      .mockResolvedValueOnce(null);

    const response = await createClientController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "CEP not found" },
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
      body: { message: "E-mail in use" },
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

  it("should check the cache for the address before querying the repository", async () => {
    const getSpy = jest.spyOn(cache, "get");

    const findOneByCEPSpy = jest.spyOn(
      findOneAddressByCEPRepository,
      "findOneByCEP"
    );

    await createClientController.handle(request);

    const cacheKey = `address-where-cep-${client.address.cep}`;
    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith(cacheKey);

    expect(findOneByCEPSpy).not.toHaveBeenCalled();
  });

  it("should set the cache with the address after querying the repository", async () => {
    const findOneByCEPSpy = jest.spyOn(
      findOneAddressByCEPRepository,
      "findOneByCEP"
    );

    const setSpy = jest.spyOn(cache, "set");

    jest.spyOn(cache, "get").mockResolvedValueOnce(undefined);

    await createClientController.handle(request);

    expect(findOneByCEPSpy).toHaveBeenCalledTimes(1);
    expect(findOneByCEPSpy).toHaveBeenCalledWith(client.address.cep);

    const cacheKey = `address-where-cep-${client.address.cep}`;
    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith(cacheKey, client.address);
  });
});
