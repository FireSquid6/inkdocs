// To use this plugin, you must:
import { Parser, Plugin } from "..";
import { ApiRoute } from "../server";

// TODO
// This plugin assumes that the user has installed htmx into the head of their base html.
// This plugin also can only deal with markdown. Any other file type must have a custom parser written.
export default function lazyRouter(): Plugin {
  let apiRoutes: ApiRoute[] = [];
  return {
    beforeBuild: () => {
      const parsers = new Map<string, Parser>();

      // parsers.set(".md", markdownParser);

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
