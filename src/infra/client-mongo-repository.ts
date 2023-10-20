import type { Client } from "../app/entities/client";
import type { CreateClientRepository } from "../app/repositories/create-client-repository";
import type { FindClientsLikeNameRepository } from "../app/repositories/find-clients-like-name-repository";
import type { FindClientsRepository } from "../app/repositories/find-clients-repository";
import type { FindOneClientByEmailRepository } from "../app/repositories/find-one-client-by-email-repository";
import type { FindOneClientByIdRepository } from "../app/repositories/find-one-client-by-id-repository";
import { MongoHelper } from "./mongo-helper";

export class ClientMongoRepository
  implements
    FindClientsRepository,
    FindClientsLikeNameRepository,
    FindOneClientByEmailRepository,
    FindOneClientByIdRepository,
    CreateClientRepository
{
  async find(
    limit: number,
    offset: number
  ): Promise<Array<Pick<Client, "id" | "name">>> {
    return await MongoHelper.getInstance()
      .getCollection<Client>("clients")
      .find()
      .project<Pick<Client, "id" | "name">>({ _id: 0, id: 1, name: 1 })
      .limit(limit)
      .skip(offset)
      .toArray();
  }

  async findLikeName({
    limit,
    offset,
    name,
  }: {
    limit: number;
    offset: number;
    name: string;
  }): Promise<Array<Pick<Client, "id" | "name">>> {
    const result = await MongoHelper.getInstance()
      .getCollection<Client>("clients")
      .find({ name: { $regex: new RegExp(name, "i") } })
      .project<Pick<Client, "id" | "name">>({ _id: 0, id: 1, name: 1 })
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

  async findOneById(id: string): Promise<Client | null> {
    const result = await MongoHelper.getInstance()
      .getCollection<Client>("clients")
      .findOne({ id });

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
