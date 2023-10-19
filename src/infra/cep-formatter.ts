export class CEPFormatter {
  static format(cep: string): string {
    return cep.substring(0, 5) + cep.substring(5);
  }
}
