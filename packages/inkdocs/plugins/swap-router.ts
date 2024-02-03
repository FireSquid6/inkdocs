import { Page, Parser, Plugin, Route } from "..";
import { LayoutTree } from "..";
import { getPossibleFilepaths } from "../server";
import { spliceMetadata } from "../parsers";
import { marked } from "marked";
import { chooseLayout } from "../builder/layout";
import { defaultOptions } from "../";
import path from "node:path";
import yaml from "../parsers/yaml";
import { parseFromString } from "dom-parser";
import { fatalError } from "../lib/logger";

// This plugin assumes that the user has installed htmx into the head of their base html.
// This plugin also can only deal with markdown. Any other file type must have a custom parser written.
export default function swapRouter(): Plugin {
  return {
    beforeBuild: (options) => {
      const parsers = new Map<string, Parser>();
      const markdownParser = getMarkdownParser(
        options.layoutTree || defaultOptions.layoutTree,
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
    setupServer: () => {
      return {
        apiRoutes: [
          {
            route: "/htmx-bundle",
            verb: "GET",
            handler: () => {
              return Bun.file("node_modules/htmx.org/dist/htmx.min.js");
            },
          },
        ],
      };
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

export function getMarkdownParser(layoutTree: LayoutTree): Parser {
  return (text: string, filepath: string) => {
    const { content, metadata } = spliceMetadata(text);
    const myLayout = chooseLayout(
      { filepath, html: "", metadata, href: "" },
      layoutTree,
    );

    marked.use({
      renderer: {
        link: (href, title, text) => {
          const { target, getUrl } = getSwapATag(myLayout, href, layoutTree);

          return `<a hx-get="${getUrl}" hx-swap="outerHTML" hx-target=${target} hx-push-url=${href} hx-trigger="click" title="${title}">${text}</a>`;
        },
      },
    });
    const html = marked(content);

    return {
      html: html,
      metadata: metadata,
    };
  };
}
