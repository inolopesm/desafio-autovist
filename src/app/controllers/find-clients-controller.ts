import type { Controller, Request, Response } from "../protocols/controller";
import type { Validation } from "../protocols/validation";
import type { FindClientsLikeNameRepository } from "../repositories/find-clients-like-name-repository";
import type { FindClientsRepository } from "../repositories/find-clients-repository";

interface FindClientsDTO {
  limit?: string | undefined;
  offset?: string | undefined;
  name?: string | undefined;
}

export type FindClientsRequest = Request<
  /* TParams */ unknown,
  /* TQuery */ FindClientsDTO,
  /* TBody */ unknown
>;

export class FindClientsController implements Controller {
  private readonly validation: Validation;
  private readonly findClientsRepository: FindClientsRepository;
  private readonly findClientsLikeNameRepository: FindClientsLikeNameRepository;

  constructor({
    validation,
    findClientsRepository,
    findClientsLikeNameRepository,
  }: {
    validation: Validation;
    findClientsRepository: FindClientsRepository;
    findClientsLikeNameRepository: FindClientsLikeNameRepository;
  }) {
    this.validation = validation;
    this.findClientsRepository = findClientsRepository;
    this.findClientsLikeNameRepository = findClientsLikeNameRepository;
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
    const { name } = query;

    // prettier-ignore
    const clients = name
      ? await this.findClientsLikeNameRepository.findLikeName({ limit, offset, name })
      : await this.findClientsRepository.find(limit, offset);

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
