import type { Client } from "../entities/client";

export interface FindClientsLikeNameRepository {
  findLikeName({
    limit,
    offset,
    name,
  }: {
    limit: number;
    offset: number;
    name: string;
  }): Promise<Array<Pick<Client, "id" | "name">>>;
}
