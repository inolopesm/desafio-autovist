import * as y from "yup";
import type { ObjectSchema } from "yup";
import type { Request } from "../app/protocols/controller";
import type { Validation } from "../app/protocols/validation";

export class YupValidationAdapter<T extends Request> implements Validation {
  private readonly schema: ObjectSchema<T>;

  constructor(fn: (yup: typeof y) => ObjectSchema<T>) {
    this.schema = fn(y);
  }

  validate(request: Request): Error | null {
    try {
      this.schema.validateSync(request, { abortEarly: true, strict: true });
      return null;
    } catch (error) {
      if (error instanceof y.ValidationError) {
        return new Error(new Intl.ListFormat().format(error.errors));
      }

      throw error;
    }
  }
}
