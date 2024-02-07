import { Plugin, defaultOptions } from "..";
import $ from "@pwrtool/bx";
import path from "node:path";
import fs from "node:fs";
import { fatalError } from "../lib/logger";

interface TailwindOptions {
  inputFile: string; // path to the input file. Relative to the content folder
  outputFile: string; // path to the output file. Relative to the build folder
}

export default function tailwind(options: TailwindOptions): Plugin {
  return {
    beforeBuild: (inkdocsOptions) => {
      const inputFile = path.join(
        inkdocsOptions.staticFolder ?? defaultOptions.staticFolder,
        options.inputFile,
      );

      if (!fs.existsSync(inputFile)) {
        fatalError(`Tailwind input file does not exist: ${inputFile}`);
      }

      const outputFile = path.join(
        inkdocsOptions.buildFolder ?? defaultOptions.buildFolder,
        options.outputFile,
      );

      // library I made a while ago that makes it easier to run shell commands
      $`bunx tailwindcss -i ${inputFile} -o ${outputFile}`;

      return {
        craftsmen: [],
        parsers: new Map(),
      };
    },
  };
}
