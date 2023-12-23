import "@kitajs/html/register";

export interface InkdocsOptions {
  parsers?: Parser[];
  staticFolder?: string | undefined;
  buildFolder?: string | undefined;
  contentFolder?: string;
  craftsmen?: Craftsman[];
  layouts?: Map<string, Layout>;
  plugins?: Plugin[];
}

export const defaultOptions: InkdocsOptions = {
  parsers: [],
  staticFolder: "static",
  buildFolder: "build",
  contentFolder: "content",
  craftsmen: [],
  layouts: new Map(),
  plugins: [],
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

export interface Plugin {
  beforeParse?: () => void;
  afterParse?: () => void;
  beforeCraftsmen?: () => void;
  afterCraftsmen?: () => void;
  beforeLayouts?: () => void;
  afterLayouts?: () => void;
  beforeSlots?: () => void;
  afterSlots?: () => void;
}

export interface Theme {
  layouts?: Map<string, Layout>;
  craftsmen?: Craftsman[];
}
