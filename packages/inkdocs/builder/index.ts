import { InkdocsOptions } from "..";
import { convertHtmlFiles } from "./html_converter";
import { realFilesystem } from "../lib/filesystem";
import { realLogger } from "../lib/logger";

export function build(options: InkdocsOptions): void {
  const filesystem = realFilesystem();
  const logger = realLogger();

  const htmlFiles = convertHtmlFiles(options, filesystem, logger);

  for (const [filepath, html] of htmlFiles) {
    filesystem.writeFile(filepath, html);
  }
}
