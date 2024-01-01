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
    options.contentFolder ?? defaultOptions.contentFolder,
  );

  const routes = getRoutes(
    filenames,
    filesystem,
    options.contentFolder ?? defaultOptions.contentFolder,
    options.buildFolder ?? defaultOptions.buildFolder,
    options.parsers ?? defaultOptions.parsers,
    logger,
  );

  const artifacts = getArtifacts(options, routes);

  return getHtmlFiles(
    routes,
    options.layouts ?? defaultOptions.layouts,
    options.baseHtml ?? defaultOptions.baseHtml,
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
  // TODO: this doesn't work if the content or build folders are not in the root directory
  // TODO: clean up this function

  const parts = filepath.split("/");
  if (parts[0] === "." || parts[0] === "") {
    parts.shift();
  }

  parts[parts.length - 1] = parts[parts.length - 1].replace(
    /\.[^/.]+$/,
    ".html",
  );

  const contentFolderParts = contentFolder.split("/");
  if (contentFolderParts[0] === "." || contentFolderParts[0] === "") {
    contentFolderParts.shift();
  }
  for (const part of contentFolderParts) {
    if (parts[0] === part) {
      parts.shift();
    }
  }
  const buildFolderParts = buildFolder.split("/");
  if (buildFolderParts[0] === "." || buildFolderParts[0] === "") {
    buildFolderParts.shift();
  }
  const newFilepath = [...buildFolderParts, ...parts].join("/");

  return newFilepath;
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
    // TODO: Properly get the layout
    const layoutName = route.metadata.layout ?? "default";

    const layout = layouts?.get(layoutName);
    if (!layout) {
      logger.error(
        `No layout found for ${route.filepath}. Tried to use ${layout}.`,
      );
      continue;
    }
    const layoutResult = layout(
      route.html,
      route.metadata,
      artifactMap,
      route.filepath,
    );

    logger.log(`🔨 ${route.filepath} with layout ${layoutName}`);

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

export function chooseLayout(
  route: Route,
  layouts: Map<string, Layout>,
  directoryMap: Map<string, string>,
): string {
  if (route.metadata.layout) {
    if (layouts.has(route.metadata.layout)) {
      return route.metadata.layout;
    }
    return "default";
  }

  const filepathSplit = route.filepath.split("/");
  filepathSplit.pop();
  const directory = filepathSplit.join("/");

  if (directoryMap.has(directory)) {
    const layout = directoryMap.get(directory);
    if (layout === undefined || !layouts.has(layout!)) {
      return "default";
    }
    return layout;
  }

  return "default";
}
