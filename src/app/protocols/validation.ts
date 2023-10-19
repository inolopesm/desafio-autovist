import type { Request } from "./controller";

export interface Validation {
  validate(request: Request): Error | null;
}
