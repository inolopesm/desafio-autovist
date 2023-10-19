export interface ViaCEPResult {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export class ViaCEP {
  static async search(cep: string): Promise<ViaCEPResult | Error> {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

    if (!response.ok) {
      return new Error(
        `Requisição falhou com o código de status ${response.status}`
      );
    }

    const data = await response.json();

    if (data.erro === true) {
      return new Error("CEP inexistente");
    }

    return data;
  }
}
