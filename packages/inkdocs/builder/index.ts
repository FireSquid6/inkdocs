import { InkdocsOptions, Page, defaultOptions } from "..";
import { convertHtmlFiles } from "./html_converter";
import {
  Filesystem,
  copyFiles,
  realFilesystem,
  resetDirectory,
} from "../lib/filesystem";
import { Logger, realLogger } from "../lib/logger";

export function build(
  options: InkdocsOptions,
  filesystem: Filesystem = realFilesystem(),
  logger: Logger = realLogger(),
): void {
  resetDirectory(options.buildFolder ?? defaultOptions.buildFolder);

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
}
