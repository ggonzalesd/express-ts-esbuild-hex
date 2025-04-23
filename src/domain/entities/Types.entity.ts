import crypto from 'crypto';
import { CoreError } from '../errors/CoreError.error';

export class IdAttribute {
  constructor(private id: crypto.UUID) {}

  getId(): crypto.UUID {
    return this.id;
  }
}

export class StringAttribute {
  constructor(
    private value: string,
    private length: number = 255,
  ) {}

  getValue(): string {
    return this.value;
  }

  setValue(value: string): void {
    if (value.length > this.length) {
      throw CoreError.badRequest(
        `String value exceeds maximum length of ${this.length} characters`,
      );
    }
    this.value = value;
  }
}
