// @file handles everything to do with taking a `Route` and generating the final html for each page
// @author Jonathan Deiss
import { marked } from "marked";
import { Route, Page, InkdocsConfig, Layout } from "./config";
import { File } from "./files";
import "@kitajs/html/register";

function getLayoutsMap(config: InkdocsConfig): Map<string, Layout> {
  const layouts = new Map<string, Layout>();
  for (const layout of config.layouts) {
    layouts.set(layout.name, layout);
  }
  return layouts;
}

export function generateHtml(
  currentRoute: Route,
  routes: Route[],
  config: InkdocsConfig,
): File {
  const layouts = getLayoutsMap(config);
  const layout = layouts.get(currentRoute.layout);
  if (!layout) {
    throw new Error(`Layout ${currentRoute.layout} not found`);
  }

  const page: Page = {
    href: currentRoute.href,
    children: "",
    metadata: currentRoute.metadata,
  };

  const parser = jsxParsers.get(currentRoute.extension);
  if (!parser) {
    throw new Error(`Parser for ${currentRoute.extension} not found`);
  }
  page.children = parser(currentRoute.text);

  const output = layout.template({ page, routes });

  return {
    path: currentRoute.filepath,
    content: output as string,
  };
}

export function getBuildFilepath(
  filepath: string,
  contentFolder: string,
  buildFolder: string,
): string {
  // TODO
  return "";
}

type JSXParser = (text: string) => JSX.Element;

const jsxParsers = new Map<string, JSXParser>();
jsxParsers.set("md", (text) => {
  const jsx = marked(text) as JSX.Element;
  return jsx;
});
jsxParsers.set("html", (text) => {
  const jsx = text as JSX.Element;
  return jsx;
});
jsxParsers.set("yaml", () => {
  return "";
});
