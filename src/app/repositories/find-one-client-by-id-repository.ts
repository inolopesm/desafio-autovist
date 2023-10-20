import type { Client } from "../entities/client";

export interface FindOneClientByIdRepository {
  findOneById(id: string): Promise<Client | null>;
}
