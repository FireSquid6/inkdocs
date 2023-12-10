import { InkdocsConfig } from "./config";
import { getRoutes } from "./parser";
import { copyAllFiles } from "./files";

export function build(config: InkdocsConfig) {
  copyStaticFiles(config);

  const routes = getRoutes(config);
  console.log(routes);
}

function copyStaticFiles(config: InkdocsConfig) {
  if (config.staticFolder) {
    copyAllFiles(config.staticFolder, config.outputFolder ?? "build");
  }
}
