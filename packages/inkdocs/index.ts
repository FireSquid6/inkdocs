import "@kitajs/html/register";

export interface InkdocsOptions {
  parser?: Parser[];
  staticFolder?: string | undefined;
  buildFolder?: string | undefined;
  contentFolder?: string;
  layouts?: Map<string, Layout>;
}

export const defaultOptions: InkdocsOptions = {
  contentFolder: "content",
  buildFolder: "build",
  layouts: new Map(),
};

export interface Parser {
  filetypes: string[]; // filetypes that the
  build(content: string): Promise<ParseResult> | ParseResult;
}

export type Layout = (children: JSX.Element, metadata: object) => JSX.Element;

export interface ParseResult {
  html: JSX.Element;
  metadata: object;
}
