import type { Client } from "../app/entities/client";
import type { FindOneClientByEmailRepository } from "../app/repositories/find-one-client-by-email-repository";
import type { CreateClientRepository } from "../app/repositories/create-client-repository";

export class ClientInMemoryRepository
  implements FindOneClientByEmailRepository, CreateClientRepository
{
  array: Client[] = [];

  async findOneByEmail(email: string): Promise<Client | null> {
    return this.array.find((client) => client.email === email) ?? null;
  }

  async create(client: Client): Promise<void> {
    this.array.push(client);
  }
}
