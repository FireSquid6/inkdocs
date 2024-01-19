export interface Logger {
  log(message: string): void;
  error(message: string): void;
}

export function realLogger(): Logger {
  return {
    log(message: string): void {
      console.log(message);
    },
    error(message: string): void {
      console.error(message);
    },
  };
}

export function mockLogger(logs: string[], errors: string[]): Logger {
  return {
    log(message: string): void {
      logs.push(message);
    },
    error(message: string): void {
      errors.push(message);
    },
  };
}

export function fatalError(message: string): never {
  console.error("\x1b[31;1mFATAL: ", message);
  process.exit(1);
}
