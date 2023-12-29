import "@kitajs/html/register";

export interface InkdocsOptions {
  parsers?: Parser[];
  staticFolder?: string | undefined;
  buildFolder?: string | undefined;
  contentFolder?: string;
  craftsmen?: Craftsman[];
  layouts?: Map<string, Layout>;
  plugins?: Plugin[];
  baseHtml?: string;
}

export const defaultOptions: InkdocsOptions = {
  parsers: [],
  staticFolder: "static",
  buildFolder: "build",
  contentFolder: "content",
  craftsmen: [],
  layouts: new Map(),
  plugins: [],
  baseHtml: "<html><body>${body}$</body></html>",
};

export interface Parser {
  filetypes: string[]; // filetypes that the
  parse(text: string): ParseResult;
}

export type Layout = (
  filepath: string,
  children: JSX.Element,
  metadata: any,
  artifacts: Map<string, any>,
) => Map<string, JSX.Element>;

export interface ParseResult {
  html: JSX.Element;
  metadata: any;
}

export interface Route {
  filepath: string;
  html: JSX.Element;
  metadata: any;
}

export interface Artifact {
  name: string;
  data: any;
}

export type Craftsman = (options: InkdocsOptions, routes: Route[]) => Artifact;

// plugin interface is not completed yet. Expect breaking changes
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
