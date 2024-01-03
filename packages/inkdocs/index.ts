import "@kitajs/html/register";
import { ApiRoute } from "./server";

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

export interface Page {
  filepath: string;
  layoutResult: JSX.Element;
  page: string;
}

export type Craftsman = (options: InkdocsOptions, routes: Route[]) => Artifact;

// plugin interface is not completed yet. Expect breaking changes
export interface Plugin {
  staticFiles?: Map<string, string>; // a map of filepaths to content of those files. Useful for adding custom css
  beforeBuild?: (options: InkdocsOptions) => PluginPrebuildResult;
  duringBuild?: (
    options: InkdocsOptions,
    routes: Route[],
  ) => PluginDuringbuildResult;
  // TODO: figure out how to pass in the build results to afterBuild
  // TODO: actuall call duringBuild and afterBuild
  afterBuild?: (
    options: InkdocsOptions,
    pages: Page[],
  ) => PluginPostbuildResult;
}

export type PluginPrebuildResult = {
  craftsmen: Craftsman[];
  parsers: Map<string, Parser>;
};

export type PluginDuringbuildResult = {
  layouts: Map<string, Layout>;
  apiRoutes: ApiRoute[];
};

export type PluginPostbuildResult = {
  apiRoutes: ApiRoute[];
};
