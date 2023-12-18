import { InkdocsConfig } from "./config";
import { build } from "./builder";
import { watch } from "fs";

export function inkdocsWatch(config: InkdocsConfig) {
  watch(config.pagesFolder, () => {
    console.log("\nFiles changed, rebuilding...");
    build(config);
  });
}
