import { InkdocsOptions, Route, Artifact } from ".";
import { Filesystem, Logger } from "./filesystem";
import { defaultOptions } from ".";

// Uses a filesystem to read the content folder and parse the files
// returns a map of the new files and their contents 
// TODO: separate this into multiple functions with tests
export function buildHtmlFiles(options: InkdocsOptions, filesystem: Filesystem, logger: Logger): Map<string, string> {
  const filenames = filesystem.getAllFilenamesInDirectory(options.contentFolder ?? defaultOptions.contentFolder ?? "");

  const routes: Route[] = [];
  for (const filename of filenames) {
    const newFilename = getNewFilepath(filename, options.contentFolder ?? defaultOptions.contentFolder ?? "", options.buildFolder ?? defaultOptions.buildFolder ?? "");
    const fileContents = filesystem.readFile(filename);
    const parseResult = options.parsers?.find((parser) => parser.filetypes.includes(filename.split(".").pop()!))?.parse(fileContents);
    if (!parseResult) {
      logger.error(`No parser found for file ${filename}`);
      continue;
    }
    routes.push({
      filepath: newFilename,
      html: parseResult.html,
      metadata: parseResult.metadata,
    });
  }

  const artifacts: Artifact[] = [];
  for (const craftsman of options.craftsmen ?? defaultOptions.craftsmen ?? []) {
    const artifact = craftsman(options, routes);
    artifacts.push(artifact);
  }


  const htmlFiles = new Map<string, string>();
  const artifactMap = new Map(artifacts.map((artifact) => [artifact.name, artifact.data]));
  for (const route of routes) {
    const layout = options.layouts?.get(route.metadata.layout ?? "default");
    if (!layout) {
      logger.error(`No layout found for ${route.filepath}. Tried to use ${layout}.`);
      continue;
    }
    const layoutResult = layout(route.filepath, route.html, route.metadata, artifactMap);

    for (const [filepath, html] of layoutResult) {
      htmlFiles.set(filepath, html as string);
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
