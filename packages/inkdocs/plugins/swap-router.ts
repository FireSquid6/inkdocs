import { Page, Parser, Plugin, Route } from "..";
import { LayoutTree } from "..";
import { spliceMetadata } from "../parsers";
import { Renderer, MarkedExtension } from "marked";
import { chooseLayout } from "../builder/layout";
import { defaultOptions } from "../";
import path from "node:path";
import yaml from "../parsers/yaml";
import { parseFromString } from "dom-parser";
import { fatalError } from "../lib/logger";
import fs from "node:fs";
import YAML from "yaml";
import { addToHead } from "../lib/add-to-head";
import parse, { Component } from "inkdown";

// This plugin assumes that the user has installed htmx into the head of their base html.
// by default, it contains parsers for markdown and yaml. Anything else requires a custom parser.
interface SwapRouterOptions {
  customRenderer?: Renderer; // a custom renderer for marked
  components?: Component[]; // a list of ink components to use
}
export default function swapRouter(swapOptions: SwapRouterOptions): Plugin {
  return {
    beforeBuild: (options) => {
      fs.copyFileSync(
        "node_modules/htmx.org/dist/htmx.min.js",
        path.join(
          options.buildFolder ?? defaultOptions.buildFolder,
          "htmx.min.js",
        ),
      );

      addToHead("<script defer src='/htmx.min.js'></script>", options);

      const parsers = new Map<string, Parser>();
      const markdownParser = getMarkdownParser(
        options.layoutTree || defaultOptions.layoutTree,
        swapOptions.components,
        swapOptions.customRenderer,
      );

      parsers.set("md", markdownParser);
      parsers.set("yaml", yaml());

      return {
        parsers: parsers,
        craftsmen: [],
      };
    },
    afterBuild: (options, pages) => {
      // todo: add api routs for all of the pages
      const buildFolder = options.buildFolder || defaultOptions.buildFolder;
      const newPages: Page[] = [];

      console.log("\n📁 Building swap router pages...");

      for (const page of pages) {
        try {
          const layout = findElement(page.page, "layout");
          const layoutPath = path.join(
            buildFolder,
            "/@layout/",
            getHrefFromFilepath(page.filepath, buildFolder) + ".html",
          );

          newPages.push({
            filepath: layoutPath,
            page: layout,
          });

          const content = findElement(page.page, "content");
          const contentPath = path.join(
            buildFolder,
            "/@content/",
            getHrefFromFilepath(page.filepath, buildFolder) + ".html",
          );
          newPages.push({
            filepath: contentPath,
            page: content,
          });
          console.log("🔁 Layout: " + layoutPath, "| Content: " + contentPath);
        } catch (e) {
          fatalError(
            `Could not find layout or content element in ${page.filepath}. When using the swap router, pages must contain a #layout and #content id. See the docs for more information.`,
          );
        }
      }

      pages.push(...newPages);
    },
  };
}

interface SwapATag {
  target: string;
  getUrl: string;
}

export function getSwapATag(
  myLayout: string,
  href: string,
  layoutTree: LayoutTree,
): SwapATag {
  if (href[0] === "/") {
    href = href.slice(1);
  }

  const otherLayout = getLayoutFromHref(href, layoutTree);
  const target = otherLayout === myLayout ? "#content" : "#layout";
  const prefix = otherLayout === myLayout ? "/@content/" : "/@layout/";
  const getUrl = prefix + href;

  return {
    target: target,
    getUrl: getUrl,
  };
}

export function getLayoutFromHref(
  href: string,
  layoutTree: LayoutTree,
  buildFolder: string = "build",
): string {
  const possibleFilepaths = getPossibleFilepaths(href, buildFolder);
  const possibleLayouts: string[] = [];
  for (const filepath of possibleFilepaths) {
    const route: Route = {
      filepath: filepath,
      href: "",
      html: "",
      metadata: {},
    };
    const layout = chooseLayout(route, layoutTree);
    possibleLayouts.push(layout);
  }

  return possibleLayouts[possibleLayouts.length - 1];
}

export function getHrefFromFilepath(filepath: string, buildFolder: string) {
  const parts = filepath.split(buildFolder);
  if (parts.length === 1) {
    return "";
  }

  // remove extension
  parts[parts.length - 1] = parts[parts.length - 1].replace(/\.[^/.]+$/, "");

  return parts[parts.length - 1];
}

export function findElement(html: string, id: string): string {
  let dom;
  try {
    dom = parseFromString(html);
  } catch (e) {
    fatalError(
      `Error parsing html: \n${html}\nThis could be because your html contains a <!DOCTYPE html>, which is unecessary.`,
    );
  }

  const content = dom.getElementById(id);
  if (!content) {
    throw new Error(`Could not find element with id ${id} in: \n${html}`);
  }

  return content.outerHTML;
}

export interface InkComponent {
  name: string;
  component: (props: object) => string;
}

export function getMarkdownParser(
  layoutTree: LayoutTree,
  inkComponents: Component[] = [],
  customRenderer?: Renderer,
): Parser {
  return (text: string, filepath: string) => {
    const { content, metadata } = spliceMetadata(text);
    const myLayout = chooseLayout(
      { filepath, html: "", metadata, href: "" },
      layoutTree,
    );
    const extensions: MarkedExtension[] = [
      {
        renderer: {
          link: (href, title, text) => {
            if (href.startsWith("/")) {
              const { target, getUrl } = getSwapATag(
                myLayout,
                href,
                layoutTree,
              );

              return `<a hx-get="${getUrl}" hx-swap="outerHTML" hx-target=${target} hx-push-url=${href} hx-trigger="click" title="${title}">${text}</a>`;
            }

            return `<a href="${href}" title="${title}">${text}</a>`;
          },
        },
      },
    ];

    if (customRenderer) {
      extensions.push({ renderer: customRenderer });
    }

    const html = parse(content, inkComponents, extensions);

    return {
      html: html,
      metadata: metadata,
    };
  };
}

function getPossibleFilepaths(route: string, buildFolder: string): string[] {
  if (getExtension(route) === "html") {
    return [path.join(buildFolder, route)];
  }

  if (route.at(-1) === "/") {
    route = route.slice(0, -1);
  }

  if (route === "") {
    return [path.join(buildFolder, "index.html")];
  }

  const parts = route.split("/");

  if (parts[parts.length - 1] === "index") {
    parts.pop();
  }

  return [
    path.join(buildFolder, parts.join("/")) + ".html",
    path.join(buildFolder, parts.join("/"), "index.html"),
  ];
}

function getExtension(filepath: string): string {
  const parts = filepath.split(".");
  if (parts.length === 1) {
    return "";
  }

  return parts[parts.length - 1];
}
