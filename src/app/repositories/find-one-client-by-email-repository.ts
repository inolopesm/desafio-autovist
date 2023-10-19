import type { Client } from "../entities/client";

export interface FindOneClientByEmailRepository {
  findOneByEmail(email: string): Promise<Client | null>;
}
