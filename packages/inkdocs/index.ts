export interface InkdocsOptions {
  builders?: Builder[];
}

export const defaultOptions: InkdocsOptions = {};

export interface Builder {
  filetypes: string[]; // filetypes that the
  build(content: string): Promise<string>;
}
