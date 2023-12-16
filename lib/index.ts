import { InkdocsConfig } from "./config";
import { getRoutes } from "./parser";
import { copyAllFiles } from "./files";
import { generateHtmlForRoutes } from "./generator";
import fs from "fs";

export function build(config: InkdocsConfig) {
  // TODO: make a "serve" function that uses elysia to serve the files
  // TODO: make sure this actually works
  copyStaticFiles(config);

  const routes = getRoutes(config);
  const files = generateHtmlForRoutes(routes, config);
  for (const file of files) {
    console.log(`Writing ${file.path}`);
    fs.mkdirSync(file.path.split("/").slice(0, -1).join("/"), {
      recursive: true,
    });
    fs.writeFileSync(file.path, file.content);
  }
}

function copyStaticFiles(config: InkdocsConfig) {
  if (config.staticFolder) {
    copyAllFiles(config.staticFolder, config.outputFolder ?? "build");
  }
}
