import { Plugin } from "..";
import html from "../parsers/html";
import yaml from "../parsers/yaml";
import markdown from "../parsers/markdown";

// change parsers to a map of filetypes to parsers
export function standardRouter(): Plugin {
  return {
    craftsmen: [],
    layouts: new Map(),
    parsers: new Map([
      ["md", markdown()],
      ["html", html()],
      ["yaml", yaml()],
    ]),
  };
}
