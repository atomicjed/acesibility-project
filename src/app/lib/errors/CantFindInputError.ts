export class CantFindInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CantFindInputError";
  }
}