export interface BrasilAPIResult {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

export class BrasilAPI {
  static async searchCEP(cep: string): Promise<BrasilAPIResult | Error> {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);

    if (!response.ok) {
      return new Error(
        `Requisição falhou com o código de status ${response.status}`
      );
    }

    return await response.json();
  }
}
