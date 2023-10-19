import type { Address } from "../app/entities/address";
import type { FindOneAddressByCEPRepository } from "../app/repositories/find-one-address-by-cep-repository";

export class FindOneAddressByCEPRepositoryComposite
  implements FindOneAddressByCEPRepository
{
  constructor(
    private readonly findOneAddressByCEPRepositories: FindOneAddressByCEPRepository[]
  ) {}

  async findOneByCEP(cep: string): Promise<Address | null> {
    const repositories = this.findOneAddressByCEPRepositories;

    for (const repository of repositories) {
      const address = repository.findOneByCEP(cep);
      if (address !== null) return address;
    }

    return null;
  }
}
