import "@kitajs/html/register";

export interface InkdocsOptions {
  staticFolder?: string | undefined;
  buildFolder?: string | undefined;
  contentFolder?: string;
  craftsmen?: Craftsman[];
  layouts?: Map<string, Layout>;
  plugins?: Plugin[];
  baseHtml?: string;
  directoryLayoutMap?: Map<string, string>;
  parsers?: Map<string, Parser>;
}

// this isn't given the type of InkdocsOptions because if it is then the typescript compiler thinks that everything is undefined (which it isn't, because this is a literal)
export const defaultOptions = {
  staticFolder: "static",
  buildFolder: "build",
  contentFolder: "content",
  craftsmen: [],
  layouts: new Map(),
  directoryLayoutMap: new Map(),
  baseHtml: "<html><body>{body}</body></html>",
  parsers: new Map(),
  plugins: [],
};

export type Parser = (text: string) => ParseResult;

export type Layout = (
  children: JSX.Element,
  metadata: any,
  artifacts: Map<string, any>,
  filepath: string,
) => JSX.Element;

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
  craftsmen: Craftsman[];
  layouts: Map<string, Layout>;
  parsers: Map<string, Parser>;
  // TODO: figure out how to give the plugin access to files
  beforeBuild?: (options: InkdocsOptions) => void;
  afterBuild?: (options: InkdocsOptions) => void;
}
