import type { Address } from "../app/entities/address";
import type { FindOneAddressByCEPRepository } from "../app/repositories/find-one-address-by-cep-repository";

export class AddressInMemoryRepository
  implements FindOneAddressByCEPRepository
{
  array: Address[] = [];

  async findOneByCEP(cep: string): Promise<Address | null> {
    return this.array.find((address) => address.cep === cep) ?? null;
  }
}
