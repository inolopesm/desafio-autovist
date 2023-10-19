export class RequestError extends Error {
  constructor(code: number) {
    super(`Request failed with status code ${code}`);
    this.name = "RequestError";
  }
}
