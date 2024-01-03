// To use this plugin, you must:
import { Parser, Plugin } from "..";

// TODO
// This plugin assumes that the user has installed htmx into the head of their base html.
// This plugin also can only deal with markdown. Any other file type must have a custom parser written.
export default function lazyRouter(): Plugin {
  return {
    beforeBuild: () => {
      const parsers = new Map<string, Parser>();

      // parsers.set(".md", markdownParser);

      return {
        parsers: parsers,
        craftsmen: [],
      };
    },
  };
}
