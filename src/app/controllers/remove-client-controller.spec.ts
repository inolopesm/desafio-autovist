import type { Client } from "../entities/client";
import type { Response } from "../protocols/controller";
import type { Validation } from "../protocols/validation";
import type { FindOneClientByIdRepository } from "../repositories/find-one-client-by-id-repository";
import type { RemoveClientByIdRepository } from "../repositories/remove-client-by-id-repository";

import {
  RemoveClientController,
  RemoveClientRequest,
} from "./remove-client-controller";

describe("RemoveClientController", () => {
  let client: Client;
  let validation: Validation;
  let findOneClientByIdRepository: FindOneClientByIdRepository;
  let removeClientByIdRepository: RemoveClientByIdRepository;
  let removeClientController: RemoveClientController;
  let request: RemoveClientRequest;

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

    removeClientByIdRepository = {
      async removeById(): Promise<void> {
        //
      },
    };

    removeClientController = new RemoveClientController({
      validation,
      findOneClientByIdRepository,
      removeClientByIdRepository,
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

    const response = await removeClientController.handle(request);

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

    const response = await removeClientController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Client not found" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should return 200 and remove the client with the specified id if successful", async () => {
    const response = await removeClientController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: { message: "Client deleted successfully" },
    };

    expect(response).toEqual(expectedResponse);
  });
});
