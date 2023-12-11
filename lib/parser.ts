// @file handles parsing a plain file into a Route, which can then be used to generate html
// @author Jonathan Deiss
import { Route, InkdocsConfig, LayoutTree } from "./config";
import { getRealFilesystem, File } from "./files";
import matter from "gray-matter";
import YAML from "yaml";

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
    extension: "md",
    layout: "",
    metadata: {},
    filepath: file.path,
    text: "",
  };

  const parsedMatter = matter(file.content);
  route.text = parsedMatter.content;
  route.metadata = parsedMatter.data;
  route.layout = getLayout(route.href, config.layoutTree, route.metadata);

  return route;
}

export function parseHtml(file: File, config: InkdocsConfig): Route {
  const route: Route = {
    href: filepathToHref(file.path, config.pagesFolder),
    layout: "",
    metadata: {},
    text: "",
    filepath: file.path,
    extension: "html",
  };

  const parsedMatter = matter(file.content);
  route.text = parsedMatter.content;
  route.metadata = parsedMatter.data;
  route.layout = getLayout(route.href, config.layoutTree, route.metadata);

  return route;
}

export function parseYaml(file: File, config: InkdocsConfig): Route {
  const route: Route = {
    href: filepathToHref(file.path, ""),
    layout: "",
    metadata: {},
    filepath: file.path,
    text: "",
    extension: "yaml",
  };

  route.metadata = YAML.parse(file.content);
  route.layout = getLayout(route.href, config.layoutTree, route.metadata);

  return route;
}

export function getRoutes(config: InkdocsConfig): Route[] {
  const inputFilesystem = getRealFilesystem(config.pagesFolder);
  const routes: Route[] = [];

  inputFilesystem.forFiles((file: File) => {
    const ext = file.path.split(".").pop();
    if (!ext) {
      console.log(`File ${file.path} has no extension`);
      return;
    }
    const parser = parsers.get(ext);
    if (!parser) {
      console.log(`No parser found for ${file.path}`);
      return;
    }

    const route = parser(file, config);
    routes.push(route);
  });
  return routes;
}
