import type { Client } from "../entities/client";

export interface CreateClientRepository {
  create(client: Client): Promise<void>;
}
