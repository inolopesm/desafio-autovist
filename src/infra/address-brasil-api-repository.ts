import type { Address } from "../app/entities/address";
import type { FindOneAddressByCEPRepository } from "../app/repositories/find-one-address-by-cep-repository";
import { BrasilAPI } from "./brasil-api";

export class AddressBrasilAPIRepository
  implements FindOneAddressByCEPRepository
{
  async findOneByCEP(cep: string): Promise<Address | null> {
    const result = await BrasilAPI.searchCEP(cep);
    if (result instanceof Error) return null;

    return {
      cep: cep,
      state: result.state,
      city: result.city,
      neighborhood: result.neighborhood,
      street: result.street,
    };
  }
}
