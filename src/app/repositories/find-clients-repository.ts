import type { Client } from "../entities/client";

export interface FindClientsRepository {
  find(
    limit: number,
    offset: number
  ): Promise<Array<Pick<Client, "id" | "name">>>;
}
