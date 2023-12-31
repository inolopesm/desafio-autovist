import type { Client } from "../entities/client";
import type { Response } from "../protocols/controller";
import type { Validation } from "../protocols/validation";
import type { FindOneClientByIdRepository } from "../repositories/find-one-client-by-id-repository";

import {
  FindOneClientController,
  FindOneClientRequest,
} from "./find-one-client-controller";

describe("FindOneClientController", () => {
  let client: Client;
  let validation: Validation;
  let findOneClientByIdRepository: FindOneClientByIdRepository;
  let findOneClientController: FindOneClientController;
  let request: FindOneClientRequest;

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

    findOneClientByIdRepository = {
      async findOneById(): Promise<Client | null> {
        return client;
      },
    };

    findOneClientController = new FindOneClientController({
      validation,
      findOneClientByIdRepository,
    });

    request = {
      query: {},
      params: { clientId: client.id },
      body: {},
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 400 if the request is invalid", async () => {
    const error = new Error("validation failed");

    jest.spyOn(validation, "validate").mockReturnValueOnce(error);

    const response = await findOneClientController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should return 400 if the client is not found", async () => {
    jest
      .spyOn(findOneClientByIdRepository, "findOneById")
      .mockResolvedValueOnce(null);

    const response = await findOneClientController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Client not found" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should return 200 with client if successful", async () => {
    const response = await findOneClientController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: client,
    };

    expect(response).toEqual(expectedResponse);
  });
});
