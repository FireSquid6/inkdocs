import { InkdocsOptions } from ".";
import { Filesystem } from "./filesystem";
import { defaultOptions } from ".";

// Uses a filesystem to read the content folder and parse the files
export function buildHtmlFiles(options: InkdocsOptions, filesystem: Filesystem): Map<string, string> {
  const filenames = filesystem.getAllFilenamesInDirectory(options.contentFolder ?? defaultOptions.contentFolder ?? "");
  const htmlFiles = new Map<string, string>();

  for (const filename of filenames) {
    const fileContents = filesystem.readFile(filename);
    const parseResult = options.parsers?.find((parser) => parser.filetypes.includes(filename.split(".").pop()!))?.parse(fileContents);
    if (!parseResult) {
      throw new Error(`Could not find parser for file ${filename}`);
    }
  }

  return htmlFiles;
}


export function getNewFilepath(filepath: string, contentFolder: string, buildFolder: string): string {
  filepath = stripSlashesAndDots(filepath);
  contentFolder = stripSlashesAndDots(contentFolder);
  buildFolder = stripSlashesAndDots(buildFolder);

  const parts = filepath.split("/");
  if (parts[0] === "." || parts[0] === "") {
    parts.shift();
  }

  if (parts[0] === contentFolder) {
    parts[0] = buildFolder
  }
  parts[parts.length - 1] = parts[parts.length - 1].replace(/\.[^/.]+$/, ".html");


  return parts.join("/");
}

function stripSlashesAndDots(str: string): string {
  while (str.length > 0 && (str[0] === "/" || str[0] === ".")) {
    str = str.slice(1);
  }

  return str
}
