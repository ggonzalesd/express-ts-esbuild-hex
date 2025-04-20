export interface SchemaValidator {
  validate<T>(schema): T;
}
