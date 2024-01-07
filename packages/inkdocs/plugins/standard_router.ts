import { Plugin } from "..";
import html from "../parsers/html";
import yaml from "../parsers/yaml";
import markdown from "../parsers/markdown";

// change parsers to a map of filetypes to parsers
export default function standardRouter(): Plugin {
  return {
    beforeBuild: () => {
      return {
        parsers: new Map([
          ["md", markdown()],
          ["html", html()],
          ["yaml", yaml()],
        ]),
        craftsmen: [],
      };
    },
  };
}
