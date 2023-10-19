import type { Address } from "../entities/address";

export interface FindOneAddressByCEPRepository {
  findOneByCEP(cep: string): Promise<Address | null>;
}
