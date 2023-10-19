import * as crypto from "node:crypto";
import type { Client } from "../entities/client";
import type { Controller, Request, Response } from "../protocols/controller";
import type { Validation } from "../protocols/validation";
import type { FindOneAddressByCEPRepository } from "../repositories/find-one-address-by-cep-repository";
import type { FindOneClientByEmailRepository } from "../repositories/find-one-client-by-email-repository";
import type { CreateClientRepository } from "../repositories/create-client-repository";

interface CreateClientDTO {
  name: string;
  email: string;
  phone: string;
  cep: string;
}

export interface CreateClientRequest extends Request {
  body: CreateClientDTO;
}

export class CreateClientController implements Controller {
  private readonly validation: Validation;
  private readonly findOneAddressByCEPRepository: FindOneAddressByCEPRepository;
  private readonly findOneClientByEmailRepository: FindOneClientByEmailRepository;
  private readonly createClientRepository: CreateClientRepository;

  constructor({
    validation,
    findOneAddressByCEPRepository,
    findOneClientByEmailRepository,
    createClientRepository,
  }: {
    validation: Validation;
    findOneAddressByCEPRepository: FindOneAddressByCEPRepository;
    findOneClientByEmailRepository: FindOneClientByEmailRepository;
    createClientRepository: CreateClientRepository;
  }) {
    this.validation = validation;
    this.findOneAddressByCEPRepository = findOneAddressByCEPRepository;
    this.findOneClientByEmailRepository = findOneClientByEmailRepository;
    this.createClientRepository = createClientRepository;
  }

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return {
        statusCode: 400,
        body: { message: error.message },
      };
    }

    const { name, email, phone, cep } = request.body as CreateClientDTO;

    const address = await this.findOneAddressByCEPRepository.findOneByCEP(cep);

    if (address === null) {
      return {
        statusCode: 400,
        body: { message: "CEP não existente" },
      };
    }

    let client: Client | null = null;

    client = await this.findOneClientByEmailRepository.findOneByEmail(email);

    if (client !== null) {
      return {
        statusCode: 400,
        body: { message: "Já existe um cliente com este e-mail" },
      };
    }

    client = {
      id: crypto.randomUUID(),
      name: name,
      email: email,
      phone: phone,
      address: address,
    };

    await this.createClientRepository.create(client);

    return {
      statusCode: 201,
      body: client,
    };
  }
}
