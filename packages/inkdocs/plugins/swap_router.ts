// To use this plugin, you must:
import { Parser, Plugin, Route } from "..";
import { LayoutTree } from "..";
import { ApiRoute, getPossibleFilepaths } from "../server";
import { spliceMetadata } from "../parsers";
import { marked } from "marked";
import { chooseLayout } from "../builder/layout";
import { defaultOptions } from "../";

// TODO
// This plugin assumes that the user has installed htmx into the head of their base html.
// This plugin also can only deal with markdown. Any other file type must have a custom parser written.

// todo: option for turning on special component stuff
// todo: option for using custom marked renderers
// todo: extension interface? Maybe plugin plugns are a bit too meta
export interface SwapRouterOptions {
  contentSelector: string;
  layoutSelector: string;
}

export function getMarkdownParser(
  layoutTree: LayoutTree,
  opts: SwapRouterOptions,
): Parser {
  return (text: string, filepath: string) => {
    const { content, metadata } = spliceMetadata(text);
    const myLayout = chooseLayout({ filepath, html: "", metadata }, layoutTree);

    marked.use({
      renderer: {
        link: (href, title, text) => {
          const { target, getUrl } = getSwapATag(
            myLayout,
            href,
            layoutTree,
            opts,
          );

          return `<a hx-get="${getUrl}" hx-swap="innerHtml" hx-target=${target} hx-trigger="click" title="${title}">${text}</a>`;
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

export default function swapRouter(opts: SwapRouterOptions): Plugin {
  const apiRoutes: ApiRoute[] = [];

  return {
    beforeBuild: (options) => {
      const parsers = new Map<string, Parser>();
      const markdownParser = getMarkdownParser(
        options.layoutTree || defaultOptions.layoutTree,
        opts,
      );

      parsers.set(".md", markdownParser);

      return {
        parsers: parsers,
        craftsmen: [],
      };
    },
    afterBuild: (options, pages) => {
      // todo: add api routs for all of the pages
    },
    setupServer: () => {
      return {
        apiRoutes: apiRoutes,
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
  opts: SwapRouterOptions,
): SwapATag {
  if (href[0] === "/") {
    href = href.slice(1);
  }

  const otherLayout = getLayoutFromHref(href, layoutTree);
  const target =
    otherLayout === myLayout ? opts.contentSelector : opts.layoutSelector;
  const prefix = otherLayout === myLayout ? "@content/" : "@layout/";
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
      html: "",
      metadata: {},
    };
    const layout = chooseLayout(route, layoutTree);
    possibleLayouts.push(layout);
  }

  return possibleLayouts[possibleLayouts.length - 1];
}
