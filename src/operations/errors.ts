export class OperationsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OperationsError';
  }
}
