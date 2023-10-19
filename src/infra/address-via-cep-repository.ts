import type { Address } from "../app/entities/address";
import type { FindOneAddressByCEPRepository } from "../app/repositories/find-one-address-by-cep-repository";
import { ViaCEP } from "./via-cep";

export class AddressViaCEPRepository implements FindOneAddressByCEPRepository {
  async findOneByCEP(cep: string): Promise<Address | null> {
    const result = await ViaCEP.search(cep);
    if (result instanceof Error) return null;

    return {
      cep: cep,
      state: result.uf,
      city: result.localidade,
      neighborhood: result.bairro,
      street: result.logradouro,
    };
  }
}
