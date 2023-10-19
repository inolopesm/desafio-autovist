import { CEPFormatter } from "./cep-formatter";

export interface ApiCEPResult {
  code: string;
  state: string;
  city: string;
  district: string;
  address: string;
  status: number;
  ok: true;
  statusText: string;
}

export class ApiCEP {
  static async search(cep: string): Promise<ApiCEPResult | Error> {
    const response = await fetch(
      `https://cdn.apicep.com/file/apicep/${CEPFormatter.format(cep)}.json`
    );

    if (!response.ok) {
      return new Error(
        `Requisição falhou com o código de status ${response.status}`
      );
    }

    return await response.json();
  }
}
