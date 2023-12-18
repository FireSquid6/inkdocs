import Elysia from "elysia";
import { html } from "@elysiajs/html";
import { InkdocsConfig } from "./config";
import { Filesystem, getRealFilesystem } from "./files";

export function inkdocsServe(config: InkdocsConfig) {
  const app = new Elysia();
  const port = getPort(config);
  const outputFolder = config.outputFolder ?? "build";
  const filesystem = getRealFilesystem(outputFolder);

  app.use(html());
  app.get("*", ({ params }) => {
    const route = params["*"];
    return getResponseFromRoute(route, outputFolder, filesystem);
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return app;
}

function getPort(config: InkdocsConfig) {
  return config.devOptions?.port ?? 3000;
}

function getResponseFromRoute(
  route: string,
  outputFolder: string,
  filesystem: Filesystem,
) {}

export function getFilepathFromRoute(
  route: string,
  outputFolder: string,
  filesystem: Filesystem,
) {
  route = outputFolder + route;
  if (route.split(".").length > 1 && !route.endsWith(".html")) {
    return route;
  }
}

export function getPossibleFilepaths(
  filepath: string,
  buildDir: string,
  filesystem: Filesystem,
) {
  const possibleFilepath = [filepath, `${filepath}/index.html`];
  if (filepath === "/") {
    possibleFilepath.push(`${filepath}index.html`);
  }
  return possibleFilepath.map((filepath) => `${buildDir}${filepath}`);
}
