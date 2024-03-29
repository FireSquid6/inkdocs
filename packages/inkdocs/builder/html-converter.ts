import {
  InkdocsOptions,
  Route,
  Artifact,
  defaultOptions,
  Parser,
  Layout,
  PluginPrebuildResult,
  PluginDuringbuildResult,
  Page,
  LayoutTree,
} from "../";
import { Filesystem } from "../lib/filesystem";
import { Logger } from "../lib/logger";
import { chooseLayout } from "./layout";

// Uses a filesystem to read the content folder and parse the files
// returns a map of the new files and their contents
export function convertHtmlFiles(
  options: InkdocsOptions,
  filesystem: Filesystem,
  logger: Logger,
): Page[] {
  const filenames = filesystem.getAllFilenamesInDirectory(
    options.contentFolder ?? defaultOptions.contentFolder,
  );

  const prebuildResults: PluginPrebuildResult[] = [];
  for (const plugin of options.plugins ?? defaultOptions.plugins) {
    if (plugin.beforeBuild) {
      prebuildResults.push(plugin.beforeBuild(options));
    }
  }

  const parsers = getParsers(
    options.parsers ?? defaultOptions.parsers,
    prebuildResults,
  );

  const routes = getRoutes(
    filenames,
    filesystem,
    options.contentFolder ?? defaultOptions.contentFolder,
    options.buildFolder ?? defaultOptions.buildFolder,
    parsers,
    logger,
  );

  const duringbuildResults: PluginDuringbuildResult[] = [];
  for (const plugin of options.plugins ?? defaultOptions.plugins) {
    if (plugin.duringBuild) {
      duringbuildResults.push(plugin.duringBuild(options, routes));
    }
  }
  const artifacts = getArtifacts(options, routes);
  const layouts = getLayouts(
    options.layouts ?? defaultOptions.layouts,
    duringbuildResults,
  );

  const pages = buildPages(
    routes,
    layouts,
    options.baseHtml ?? defaultOptions.baseHtml,
    artifacts,
    options.layoutTree ?? defaultOptions.layoutTree,
    logger,
    options.buildFolder ?? defaultOptions.buildFolder,
  );

  for (const plugin of options.plugins ?? defaultOptions.plugins) {
    if (plugin.afterBuild) {
      plugin.afterBuild(options, pages);
    }
  }

  // todo: figure out how to get apiRoutes into the server
  // todo: use the static files from the plugins
  // this part may need to be moves into the main builder/index file
  // consider merging ServerOptions and InkdocsOptionser into one type

  return pages;
}

function getParsers(
  userPasers: Map<string, Parser>,
  pluginPrebuildResult: PluginPrebuildResult[],
): Map<string, Parser> {
  const parsers = new Map<string, Parser>();
  for (const result of pluginPrebuildResult) {
    for (const [extension, parser] of result.parsers) {
      parsers.set(extension, parser);
    }
  }

  for (const [extension, parser] of userPasers) {
    parsers.set(extension, parser);
  }

  return parsers;
}

function getLayouts(
  userLayouts: Map<string, Layout>,
  pluginPrebuildResult: PluginDuringbuildResult[],
): Map<string, Layout> {
  const layouts = new Map<string, Layout>();
  for (const result of pluginPrebuildResult) {
    for (const [name, layout] of result.layouts) {
      layouts.set(name, layout);
    }
  }

  for (const [name, layout] of userLayouts) {
    layouts.set(name, layout);
  }

  return layouts;
}

export function getNewFilepath(
  filepath: string,
  contentFolder: string,
  buildFolder: string,
): string {
  filepath = stripSlashesAndDots(filepath);
  contentFolder = stripSlashesAndDots(contentFolder);
  buildFolder = stripSlashesAndDots(buildFolder);
  // TODO: clean up this function

  const parts = filepath.split("/");
  if (parts[0] === "." || parts[0] === "") {
    parts.shift();
  }

  parts[parts.length - 1] = parts[parts.length - 1].replace(/\.[^/.]+$/, "");

  const contentFolderParts = contentFolder.split("/");
  if (contentFolderParts[0] === "." || contentFolderParts[0] === "") {
    contentFolderParts.shift();
  }
  for (const part of contentFolderParts) {
    if (parts[0] === part) {
      parts.shift();
    }
  }

  if (parts[parts.length - 1] !== "index") {
    parts.push("index");
  }

  const buildFolderParts = buildFolder.split("/");
  if (buildFolderParts[0] === "." || buildFolderParts[0] === "") {
    buildFolderParts.shift();
  }
  const newFilepath = [...buildFolderParts, ...parts].join("/");

  return newFilepath + ".html";
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
  parsers: Map<string, Parser>,
  logger: Logger,
) {
  const routes: Route[] = [];

  for (const filename of filenames) {
    const newFilename = getNewFilepath(filename, contentFolder, buildFolder);
    const fileContents = filesystem.readFile(filename);
    const fileExtension = filename.split(".").pop();
    const parser = parsers.get(fileExtension ?? "");
    const parseResult = parser?.(fileContents, newFilename);

    if (!parseResult) {
      logger.error(`No parser found for file ${filename}`);
      continue;
    }
    routes.push({
      filepath: newFilename,
      html: parseResult.html,
      metadata: parseResult.metadata,
      href: hrefFromFilepath(newFilename, buildFolder),
    });
  }

  return routes;
}

function hrefFromFilepath(filepath: string, buildFolder: string): string {
  if (filepath.startsWith(buildFolder)) {
    filepath = filepath.slice(buildFolder.length);
  }

  const parts = filepath.split("/");
  while (parts[0] === "." || parts[0] === "") {
    parts.shift();
  }

  const lastPart = parts[parts.length - 1].split(".");
  lastPart.pop();
  parts[parts.length - 1] = lastPart.join(".");

  if (parts[parts.length - 1] === "index") {
    parts.pop();
  }

  return "/" + parts.join("/");
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

export function buildPages(
  routes: Route[],
  layouts: Map<string, Layout>,
  baseHtml: string,
  artifacts: Artifact[],
  layoutTree: LayoutTree,
  logger: Logger,
  buildFolder: string,
): Page[] {
  const pages: Page[] = [];
  const artifactMap = new Map(
    artifacts.map((artifact) => [artifact.name, artifact.data]),
  );
  for (const route of routes) {
    const layoutName = chooseLayout(route, layoutTree, buildFolder);

    const layout = layouts?.get(layoutName);
    if (!layout) {
      logger.error(
        `No layout found for ${route.filepath}. Tried to use ${layoutName}.`,
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

    // Should be fine for an early release though
    if (finalHtml.includes("{slot}")) {
      // note: using JSX.Element as string is fine because JSX.Element is really just a fancy string
      finalHtml = finalHtml.replace(`{slot}`, layoutResult as string);
    }

    pages.push({
      filepath: route.filepath,
      page: finalHtml,
    });
  }

  return pages;
}
