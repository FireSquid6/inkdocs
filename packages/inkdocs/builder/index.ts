import { InkdocsOptions, defaultOptions } from "..";
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

  const htmlFiles = convertHtmlFiles(options, filesystem, logger);

  for (const [filepath, html] of htmlFiles) {
    filesystem.writeFile(filepath, html);
  }
}
