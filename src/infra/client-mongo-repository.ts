import type { Client } from "../app/entities/client";
import type { CreateClientRepository } from "../app/repositories/create-client-repository";
import type { FindClientsRepository } from "../app/repositories/find-clients-repository";
import type { FindOneClientByEmailRepository } from "../app/repositories/find-one-client-by-email-repository";
import { MongoHelper } from "./mongo-helper";

export class ClientMongoRepository
  implements
    FindClientsRepository,
    FindOneClientByEmailRepository,
    CreateClientRepository
{
  async find(
    limit: number,
    offset: number
  ): Promise<Array<Pick<Client, "id" | "name">>> {
    const result = await MongoHelper.getInstance()
      .getCollection<Client>("clients")
      .find()
      .limit(limit)
      .skip(offset)
      .toArray();

    return result.map(({ id, name }) => ({ id, name }));
  }

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
      .insertOne(structuredClone(client));
  }
}
