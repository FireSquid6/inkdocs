import { InkdocsConfig } from "./config";
import { getRoutes } from "./parser";
import { generateHtmlForRoutes } from "./generator";
import fs from "fs";

export function build(config: InkdocsConfig) {
  // TODO: make a "serve" function that uses elysia to serve the files
  // TODO: make sure this actually works
  const routes = getRoutes(config);
  const files = generateHtmlForRoutes(routes, config);
  for (const file of files) {
    console.log(`Writing ${file.path}`);
    fs.mkdirSync(file.path.split("/").slice(0, -1).join("/"), {
      recursive: true,
    });
    fs.writeFileSync(file.path, file.content);
  }
  copyStaticFiles(config);
}

function copyStaticFiles(config: InkdocsConfig) {
  console.log("Copying static files");
  if (config.staticFolder) {
    fs.cpSync(config.staticFolder, config.outputFolder ?? "build", {
      recursive: true,
    });
  }
}
