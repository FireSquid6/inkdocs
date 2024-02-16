import { InkdocsOptions, Layout, Page, defaultOptions } from "..";
import { convertHtmlFiles } from "./html-converter";
import {
  Filesystem,
  copyFiles,
  realFilesystem,
  resetDirectory,
} from "../lib/filesystem";
import { Logger, fatalError, realLogger } from "../lib/logger";

export function build(
  options: InkdocsOptions,
  filesystem: Filesystem = realFilesystem(),
  logger: Logger = realLogger(),
): string {
  logger.log("🏗 Building Pages...");
  resetDirectory(options.buildFolder ?? defaultOptions.buildFolder);

  if (
    !filesystem.exists(options.contentFolder ?? defaultOptions.contentFolder)
  ) {
    return "❌ Content folder does not exist!";
  }

  if (options.staticFolder !== undefined) {
    copyFiles(
      options.staticFolder ?? defaultOptions.staticFolder,
      options.buildFolder ?? defaultOptions.buildFolder,
    );
  }

  addPluginThemes(options);

  const htmlFiles: Page[] = convertHtmlFiles(options, filesystem, logger);

  for (let i = 0; i < htmlFiles.length; i++) {
    const file = htmlFiles[i];
    filesystem.writeFile(file.filepath, file.page);
  }

  logger.log("✅ Pages successfully built!");

  return "success";
}

function addPluginThemes(options: InkdocsOptions) {
  for (const plugin of options.plugins ?? defaultOptions.plugins) {
    for (const theme of plugin.themes ?? []) {
      if (options.craftsmen) {
        options.craftsmen.push(...theme.craftsmen);
      } else {
        options.craftsmen = theme.craftsmen;
      }

      if (options.layouts) {
        for (const layoutName of theme.layouts.keys()) {
          if (!options.layouts.has(layoutName)) {
            const layout = theme.layouts.get(layoutName) as Layout;
            options.layouts.set(layoutName, layout);
          }
        }
      } else {
        options.layouts = theme.layouts;
      }
    }
  }
}
