import { InkdocsOptions, defaultOptions } from "..";
import { convertHtmlFiles } from "./html_converter";
import { Filesystem, copyFiles, realFilesystem } from "../lib/filesystem";
import { Logger, realLogger } from "../lib/logger";

export function build(
  options: InkdocsOptions,
  filesystem: Filesystem = realFilesystem(),
  logger: Logger = realLogger(),
): void {
  copyFiles(
    options.staticFolder ?? defaultOptions.staticFolder,
    options.buildFolder ?? defaultOptions.buildFolder,
  );
  const htmlFiles = convertHtmlFiles(options, filesystem, logger);

  for (const [filepath, html] of htmlFiles) {
    filesystem.writeFile(filepath, html);
  }
}
