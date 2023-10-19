import type { Address } from "./address";

export interface Client {
  id: string; // uuid auto-generated
  name: string; // text(255)
  email: string; // text(255) valid unique
  phone: string; // text(20) valid
  address: Address;
}
