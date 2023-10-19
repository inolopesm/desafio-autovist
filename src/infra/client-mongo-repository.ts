import type { Client } from "../app/entities/client";
import type { FindOneClientByEmailRepository } from "../app/repositories/find-one-client-by-email-repository";
import type { CreateClientRepository } from "../app/repositories/create-client-repository";
import { MongoHelper } from "./mongo-helper";

export class ClientMongoRepository
  implements FindOneClientByEmailRepository, CreateClientRepository
{
  array: Client[] = [];

  async findOneByEmail(email: string): Promise<Client | null> {
    const result = await MongoHelper.getInstance()
      .getCollection<Client>("clients")
      .findOne({ email });

    if (result === null) return null;
    const { _id, ...client } = result;
    return client;
  }

  async create(client: Client): Promise<void> {
    await MongoHelper.getInstance()
      .getCollection<Client>("clients")
      .insertOne(client);
  }
}
