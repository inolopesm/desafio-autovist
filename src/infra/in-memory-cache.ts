import { Cache } from "../app/protocols/cache";

export class InMemoryCache implements Cache {
  object: Record<string, any> = {};

  async get<T>(key: string): Promise<T | undefined> {
    return this.object[key];
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.object[key] = value;
  }
}
