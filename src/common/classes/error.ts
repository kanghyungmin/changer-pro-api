export class CustomError extends Error {
  public code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
  public throwError() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}
