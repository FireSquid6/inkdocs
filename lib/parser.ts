// @file handles parsing a plain file into a Route, which can then be used to generate html
// @author Jonathan Deiss
import { File } from "./files";
import { Route, InkdocsConfig, LayoutTree } from "./config";
import matter from "gray-matter";

export type ParsedFile = {};

type Parser = (file: File, config: InkdocsConfig) => Route;

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

export function getLayout(
  href: string,
  layoutTree: LayoutTree,
  metadata: any,
): string {
  if (
    metadata.layout !== undefined &&
    metadata.layout !== "" &&
    metadata.layout !== null
  ) {
    return metadata.layout;
  }

  const path = href.split("/");
  if (path[0] === "") {
    path.shift();
  }
  let layout = layoutTree.layout;
  for (const child of layoutTree.children) {
    if (child.path === path[0]) {
      path.shift();
      return getLayout(href, child, metadata);
    }
  }

  return layout;
}

// TODO: different "default layouts" that can be defined in the config
// make a function getLayout that takes a route and returns the layout

export function parseMarkdown(file: File, config: InkdocsConfig): Route {
  const route: Route = {
    href: filepathToHref(file.path, config.pagesFolder),
    layout: "",
    metadata: {},
    text: "",
  };

  const parsedMatter = matter(file.content);
  route.text = parsedMatter.content;
  route.metadata = parsedMatter.data;
  route.layout = parsedMatter.data.layout || "default";

  return route;
}

export function parseHtml(file: File): Route {
  const route: Route = {
    href: "",
    layout: "",
    metadata: {},
    text: "",
  };

  return route;
}

export function parseYaml(file: File): Route {
  const route: Route = {
    href: "",
    layout: "",
    metadata: {},
    text: "",
  };

  return route;
}
