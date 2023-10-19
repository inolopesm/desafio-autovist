import type { Controller, Request, Response } from "../protocols/controller";
import type { Validation } from "../protocols/validation";
import { FindClientsRepository } from "../repositories/find-clients-repository";

interface FindClientsDTO extends Record<string, string | undefined> {
  limit?: string | undefined;
  offset?: string | undefined;
}

export type FindClientsRequest = Request<
  /* TParams */ {},
  /* TQuery */ FindClientsDTO,
  /* TBody */ unknown
>;

export class FindClientsController implements Controller {
  private readonly validation: Validation;
  private readonly findClientsRepository: FindClientsRepository;

  constructor({
    validation,
    findClientsRepository,
  }: {
    validation: Validation;
    findClientsRepository: FindClientsRepository;
  }) {
    this.validation = validation;
    this.findClientsRepository = findClientsRepository;
  }

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return {
        statusCode: 400,
        body: { message: error.message },
      };
    }

    const query = request.query as FindClientsDTO;

    const limit = Number(query.limit ?? "10");
    const offset = Number(query.offset ?? "0");

    const clients = await this.findClientsRepository.find(limit, offset);

    return {
      statusCode: 200,
      body: {
        count: clients.length,
        previous: null,
        next: null,
        results: clients,
      },
    };
  }
}
