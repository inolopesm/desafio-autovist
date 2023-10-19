import type { Address } from "../app/entities/address";
import type { FindOneAddressByCEPRepository } from "../app/repositories/find-one-address-by-cep-repository";
import { ApiCEP } from "./api-cep";

export class AddressApiCEPRepository implements FindOneAddressByCEPRepository {
  async findOneByCEP(cep: string): Promise<Address | null> {
    const result = await ApiCEP.search(cep);
    if (result instanceof Error) return null;

    return {
      cep: cep,
      state: result.state,
      city: result.city,
      neighborhood: result.district,
      street: result.address,
    };
  }
}
