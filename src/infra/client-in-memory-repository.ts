import type { Client } from "../app/entities/client";
import type { CreateClientRepository } from "../app/repositories/create-client-repository";
import { FindOneClientByEmailRepository } from "../app/repositories/find-one-client-by-email-repository";

export class ClientInMemoryRepository
  implements CreateClientRepository, FindOneClientByEmailRepository
{
  array: Client[] = [];

  async create(client: Client): Promise<void> {
    this.array.push(client);
  }

  async findOneByEmail(email: string): Promise<Client | null> {
    return this.array.find((client) => client.email === email) ?? null;
  }
}
