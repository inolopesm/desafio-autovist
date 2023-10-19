export interface Address {
  cep: string; // text(8)
  state: string; // text(2) uppercase
  city: string; // text(255)
  neighborhood: string; // text(255)
  street: string; // text(255)
}
