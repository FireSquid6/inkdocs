import {
  InkdocsOptions,
  Route,
  Artifact,
  defaultOptions,
  Parser,
  Layout,
} from "../";
import { Filesystem } from "../lib/filesystem";
import { Logger } from "../lib/logger";

// Uses a filesystem to read the content folder and parse the files
// returns a map of the new files and their contents
export function convertHtmlFiles(
  options: InkdocsOptions,
  filesystem: Filesystem,
  logger: Logger,
): Map<string, string> {
  const filenames = filesystem.getAllFilenamesInDirectory(
    options.contentFolder ?? defaultOptions.contentFolder ?? "",
  );

  const routes = getRoutes(
    filenames,
    filesystem,
    options.contentFolder ?? defaultOptions.contentFolder ?? "",
    options.buildFolder ?? defaultOptions.buildFolder ?? "",
    options.parsers ?? defaultOptions.parsers ?? [],
    logger,
  );

  const artifacts = getArtifacts(options, routes);

  return getHtmlFiles(
    routes,
    options.layouts ?? defaultOptions.layouts ?? new Map(),
    options.baseHtml ?? defaultOptions.baseHtml ?? "",
    artifacts,
    logger,
  );
}

export function getNewFilepath(
  filepath: string,
  contentFolder: string,
  buildFolder: string,
): string {
  filepath = stripSlashesAndDots(filepath);
  contentFolder = stripSlashesAndDots(contentFolder);
  buildFolder = stripSlashesAndDots(buildFolder);

  const parts = filepath.split("/");
  if (parts[0] === "." || parts[0] === "") {
    parts.shift();
  }

  if (parts[0] === contentFolder) {
    parts[0] = buildFolder;
  }
  parts[parts.length - 1] = parts[parts.length - 1].replace(
    /\.[^/.]+$/,
    ".html",
  );

  return parts.join("/");
}

function stripSlashesAndDots(str: string): string {
  while (str.length > 0 && (str[0] === "/" || str[0] === ".")) {
    str = str.slice(1);
  }

  return str;
}

export function getRoutes(
  filenames: string[],
  filesystem: Filesystem,
  contentFolder: string,
  buildFolder: string,
  parsers: Parser[],
  logger: Logger,
) {
  const routes: Route[] = [];

  for (const filename of filenames) {
    const newFilename = getNewFilepath(filename, contentFolder, buildFolder);
    const fileContents = filesystem.readFile(filename);
    const parseResult = parsers
      ?.find((parser) => parser.filetypes.includes(filename.split(".").pop()!))
      ?.parse(fileContents);
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

  return routes;
}

export function getArtifacts(
  options: InkdocsOptions,
  routes: Route[],
): Artifact[] {
  const artifacts: Artifact[] = [];
  for (const craftsman of options.craftsmen ?? defaultOptions.craftsmen ?? []) {
    const artifact = craftsman(options, routes);
    artifacts.push(artifact);
  }

  return artifacts;
}

export function getHtmlFiles(
  routes: Route[],
  layouts: Map<string, Layout>,
  baseHtml: string,
  artifacts: Artifact[],
  logger: Logger,
): Map<string, string> {
  const htmlFiles = new Map<string, string>();
  const artifactMap = new Map(
    artifacts.map((artifact) => [artifact.name, artifact.data]),
  );
  for (const route of routes) {
    const layout = layouts?.get(route.metadata.layout ?? "default");
    if (!layout) {
      logger.error(
        `No layout found for ${route.filepath}. Tried to use ${layout}.`,
      );
      continue;
    }
    const layoutResult = layout(
      route.filepath,
      route.html,
      route.metadata,
      artifactMap,
    );

    let finalHtml = baseHtml;

    // TODO: optimize this by precalculating where and what the slots are instead of searching for them each time
    // Should be fine for an early release though
    for (const [slot, html] of layoutResult) {
      if (finalHtml.includes(`{${slot}}`)) {
        // note: using JSX.Element as string is fine because JSX.Element is really just a fancy string
        finalHtml = finalHtml.replace(`{${slot}}`, html as string);
      }
    }

    htmlFiles.set(route.filepath, finalHtml);
  }

  return htmlFiles;
}
