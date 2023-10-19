import type { Client } from "../entities/client";
import type { Response } from "../protocols/controller";
import type { Validation } from "../protocols/validation";
import type { FindClientsRepository } from "../repositories/find-clients-repository";

import {
  FindClientsController,
  FindClientsRequest,
} from "./find-clients-controller";

describe("FindClientsController", () => {
  let clients: Array<Pick<Client, "id" | "name">>;
  let validation: Validation;
  let findClientsRepository: FindClientsRepository;
  let findClientsController: FindClientsController;
  let request: FindClientsRequest;

  beforeAll(() => {
    clients = [
      { id: "bd981cab-d315-4486-85c7-c6af24c475f9", name: "João" },
      { id: "e486af2c-e5da-4a9b-916e-55a41d26e22d", name: "Maria" },
    ];

    validation = {
      validate(): Error | null {
        return null;
      },
    };

    findClientsRepository = {
      async find(): Promise<Array<Pick<Client, "id" | "name">>> {
        return clients;
      },
    };

    findClientsController = new FindClientsController({
      validation,
      findClientsRepository,
    });

    request = {
      params: {},
      query: {},
      body: {},
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 400 if validation fails", async () => {
    const error = new Error("validation failed");

    jest.spyOn(validation, "validate").mockReturnValueOnce(error);

    const response = await findClientsController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should find clients with given limit and offset", async () => {
    const findSpy = jest.spyOn(findClientsRepository, "find");

    const query: FindClientsRequest["query"] = { limit: "25", offset: "50" };

    await findClientsController.handle({ ...request, query });

    const [limit, offset] = [Number(query.limit), Number(query.offset)];

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findSpy).toHaveBeenCalledWith(limit, offset);
  });

  it("should return 200 with client list if successful", async () => {
    const findSpy = jest.spyOn(findClientsRepository, "find");

    const response = await findClientsController.handle(request);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findSpy).toHaveBeenCalledWith(10, 0);

    const expectedResponse: Response = {
      statusCode: 200,
      body: {
        count: clients.length,
        next: null,
        previous: null,
        results: clients,
      },
    };

    expect(response).toEqual(expectedResponse);
  });
});
