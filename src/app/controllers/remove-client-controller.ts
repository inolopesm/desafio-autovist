import type { Controller, Request, Response } from "../protocols/controller";
import type { Validation } from "../protocols/validation";
import type { FindOneClientByIdRepository } from "../repositories/find-one-client-by-id-repository";
import type { RemoveClientByIdRepository } from "../repositories/remove-client-by-id-repository";

interface RemoveClientDTO {
  clientId: string;
}

export type RemoveClientRequest = Request<
  /* TParams */ RemoveClientDTO,
  /* TQuery */ unknown,
  /* TBody */ unknown
>;

export class RemoveClientController implements Controller {
  private readonly validation: Validation;
  private readonly findOneClientByIdRepository: FindOneClientByIdRepository;
  private readonly removeClientByIdRepository: RemoveClientByIdRepository;

  constructor({
    validation,
    findOneClientByIdRepository,
    removeClientByIdRepository,
  }: {
    validation: Validation;
    findOneClientByIdRepository: FindOneClientByIdRepository;
    removeClientByIdRepository: RemoveClientByIdRepository;
  }) {
    this.validation = validation;
    this.findOneClientByIdRepository = findOneClientByIdRepository;
    this.removeClientByIdRepository = removeClientByIdRepository;
  }

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return {
        statusCode: 400,
        body: { message: error.message },
      };
    }

    const { clientId } = request.params as RemoveClientDTO;

    const client = await this.findOneClientByIdRepository.findOneById(clientId);

    if (client === null) {
      return {
        statusCode: 400,
        body: { message: "Client not found" },
      };
    }

    await this.removeClientByIdRepository.removeById(clientId);

    return {
      statusCode: 200,
      body: { message: "Client deleted successfully" },
    };
  }
}
