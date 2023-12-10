// @file handles parsing a plain file into a Route, which can then be used to generate html
// @author Jonathan Deiss
import { File } from "./files";
import { Route } from "./config";

export type ParsedFile = {};

type Parser = (file: File) => Route;

export const parsers = new Map<string, Parser>();
parsers.set(".md", parseMarkdown);
parsers.set(".html", parseHtml);
parsers.set(".yaml", parseYaml);

export function filepathToHref(
  filepath: string,
  contentFolder: string,
): string {
  filepath = filepath.slice(0, filepath.lastIndexOf("."));
  filepath = filepath.replace(contentFolder, "");
  filepath = filepath.replace("index", "");
  if (filepath[0] !== "/") {
    filepath = "/" + filepath;
  }

  return filepath;
}

function parseMarkdown(file: File): Route {
  const route: Route = {
    href: "",
    layout: "",
    outline: [],
    metadata: {},
    text: "",
  };

  return route;
}

function parseHtml(file: File): Route {
  const route: Route = {
    href: "",
    layout: "",
    outline: [],
    metadata: {},
    text: "",
  };

  return route;
}

function parseYaml(file: File): Route {
  const route: Route = {
    href: "",
    layout: "",
    outline: [],
    metadata: {},
    text: "",
  };

  return route;
}
