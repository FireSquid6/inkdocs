import "@kitajs/html/register";

export interface InkdocsOptions {
  parser?: Parser[];
  staticFolder?: string | undefined;
  buildFolder?: string | undefined;
  contentFolder?: string;
  craftsmen?: Craftsman[];
  layouts?: Map<string, Layout>;
}

export const defaultOptions: InkdocsOptions = {
  contentFolder: "content",
  buildFolder: "build",
  layouts: new Map(),
};

export interface Parser {
  filetypes: string[]; // filetypes that the
  parse(content: string): Promise<ParseResult> | ParseResult;
}

export type Layout = (
  route: string,
  children: JSX.Element,
  metadata: object,
  artifacts: Map<string, any>,
) => Map<string, JSX.Element>;

export interface ParseResult {
  html: JSX.Element;
  metadata: object;
}

export interface Artifact {
  name: string;
  data: any;
}

export type Craftsman = (
  options: InkdocsOptions,
  parseResults: ParseResult[],
) => Artifact;
