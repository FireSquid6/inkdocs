// @file handles everything to do with taking a `Route` and generating the final html for each page
// @author Jonathan Deiss
import { marked } from "marked";
import { Route, Page, InkdocsConfig, Layout } from "./config";
import { File } from "./files";
import "@kitajs/html/register";
import fs from "fs";

function getLayoutsMap(config: InkdocsConfig): Map<string, Layout> {
  const layouts = new Map<string, Layout>();
  for (const layout of config.layouts) {
    layouts.set(layout.name, layout);
  }
  return layouts;
}

export function generateHtmlForRoutes(
  routes: Route[],
  config: InkdocsConfig,
): File[] {
  const files: File[] = [];
  for (const route of routes) {
    try {
      const file = generateHtml(route, routes, config);
      files.push(file);
    } catch (e) {
      console.error(`Error generating html for ${route.filepath}`);
      console.error(e);
    }
  }

  return files;
}

export function generateHtml(
  currentRoute: Route,
  routes: Route[],
  config: InkdocsConfig,
): File {
  const baseHtml = fs.readFileSync(config.baseHtmlPath, "utf-8");
  if (baseHtml === undefined) {
    throw new Error("Base html file not found");
  }

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

  const generator = jsxGenerators.get(currentRoute.extension);
  if (!generator) {
    throw new Error(`Generator for ${currentRoute.extension} not found`);
  }
  page.children = generator(currentRoute.text);

  const templateOutput = layout.template({ page, routes });
  const finalHtml = insertIntoBaseHtml(templateOutput, baseHtml);

  return {
    path: getBuildFilepath(
      currentRoute.filepath,
      config.pagesFolder,
      config.outputFolder ?? "build",
    ),
    content: finalHtml,
  };
}

function insertIntoBaseHtml(
  templateOutput: JSX.Element,
  baseHtml: string,
): string {
  const inputTag = "<$children$>";
  const split = baseHtml.split(inputTag);
  if (split.length !== 2) {
    throw new Error("Base html must contain exactly one <$children$> tag");
  }
  split.splice(1, 0, templateOutput.toString());
  return split.join("");
}

export function getBuildFilepath(
  filepath: string,
  contentFolder: string,
  buildFolder: string,
): string {
  const split = filepath.split("/");
  if (split[0] === "" || split[0] === ".") {
    split.shift();
  }
  if (split[0] === contentFolder) {
    split[0] = buildFolder;
  }

  return split.join("/").replace(/\.[^/.]+$/, ".html");
}

type jsxGenerator = (text: string) => JSX.Element;

const jsxGenerators = new Map<string, jsxGenerator>();
jsxGenerators.set("md", (text) => {
  const jsx = marked(text) as JSX.Element;
  return jsx;
});
jsxGenerators.set("html", (text) => {
  const jsx = text as JSX.Element;
  return jsx;
});
jsxGenerators.set("yaml", () => {
  return "";
});
