// To use this plugin, you must:
import { InkdocsOptions, Parser, Plugin, Route, defaultOptions } from "..";
import { ApiRoute, getPossibleFilepaths } from "../server";
import { spliceMetadata } from "../parsers";
import { marked } from "marked";
import { chooseLayout } from "../builder/layout";

// TODO
// This plugin assumes that the user has installed htmx into the head of their base html.
// This plugin also can only deal with markdown. Any other file type must have a custom parser written.

// todo: option for turning on special component stuff
// todo: option for using custom marked renderers
// todo: extension interface? Maybe plugin plugns are a bit too meta
export interface LazyRouterOptions {
  contentSelector: string;
  layoutSelector: string;
}

export default function lazyRouter(opts: LazyRouterOptions): Plugin {
  const apiRoutes: ApiRoute[] = [];

  const markdownParser: Parser = (text: string) => {
    const { content, metadata } = spliceMetadata(text);
    marked.use({
      renderer: {
        link: (href, title, text) => {
          const getUrl = href;
          const target = opts.contentSelector;

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

  return {
    beforeBuild: () => {
      const parsers = new Map<string, Parser>();

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

export function getLayoutFromHref(
  href: string,
  options: InkdocsOptions,
): string {
  const possibleFilepaths = getPossibleFilepaths(href, "build");
  const possibleLayouts: string[] = [];
  for (const filepath of possibleFilepaths) {
  }

  return possibleLayouts[possibleLayouts.length - 1];
}
