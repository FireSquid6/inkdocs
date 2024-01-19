import { InkdocsOptions, Page, defaultOptions } from "..";
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
): void {
  logger.log("🏗 Building Pages...");
  resetDirectory(options.buildFolder ?? defaultOptions.buildFolder);

  if (
    !filesystem.exists(options.contentFolder ?? defaultOptions.contentFolder)
  ) {
    fatalError("❌ Content folder does not exist!");
  }

  if (options.staticFolder !== undefined) {
    copyFiles(
      options.staticFolder ?? defaultOptions.staticFolder,
      options.buildFolder ?? defaultOptions.buildFolder,
    );
  }

  const htmlFiles: Page[] = convertHtmlFiles(options, filesystem, logger);

  for (let i = 0; i < htmlFiles.length; i++) {
    const file = htmlFiles[i];
    filesystem.writeFile(file.filepath, file.page);
  }

  logger.log("✅ Pages successfully built!");
}
