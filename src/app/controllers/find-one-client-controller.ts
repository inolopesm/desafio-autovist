import { Controller, Request, Response } from "../protocols/controller";
import { Validation } from "../protocols/validation";
import { FindOneClientByIdRepository } from "../repositories/find-one-client-by-id-repository";

interface FindOneClientDTO {
  clientId: string;
}

export type FindOneClientRequest = Request<
  /* TParams */ FindOneClientDTO,
  /* TQuery */ unknown,
  /* TBody */ unknown
>;

export class FindOneClientController implements Controller {
  private readonly validation: Validation;
  private readonly findOneClientByIdRepository: FindOneClientByIdRepository;

  constructor({
    validation,
    findOneClientByIdRepository,
  }: {
    validation: Validation;
    findOneClientByIdRepository: FindOneClientByIdRepository;
  }) {
    this.validation = validation;
    this.findOneClientByIdRepository = findOneClientByIdRepository;
  }

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return {
        statusCode: 400,
        body: { message: error.message },
      };
    }

    const { clientId } = request.params as FindOneClientDTO;

    const client = await this.findOneClientByIdRepository.findOneById(clientId);

    if (client === null) {
      return {
        statusCode: 400,
        body: { message: "Client not found" },
      };
    }

    return {
      statusCode: 200,
      body: client,
    };
  }
}
