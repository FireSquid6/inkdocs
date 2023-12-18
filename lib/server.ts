import Elysia from "elysia";
import { html } from "@elysiajs/html";
import { InkdocsConfig } from "./config";
import { Filesystem, getRealFilesystem, File } from "./files";

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

export function getResponseFromRoute(
  route: string,
  outputFolder: string,
  filesystem: Filesystem,
) {
  const file = getFileFromRoute(route, outputFolder, filesystem);
  return file.content;
}

export function getFileFromRoute(
  route: string,
  outputFolder: string,
  filesystem: Filesystem,
): File {
  const filepath = outputFolder + route;
  if (filepath.split(".").length > 1) {
    const file = filesystem.files.find((file) => file.path === filepath);
    if (!file) {
      throw new Error(`File ${filepath} not found`);
    }
    return file;
  }

  const possibleFilepaths = getPossibleFilepaths(filepath, outputFolder);
  const file = filesystem.files.find((file) =>
    possibleFilepaths.includes(file.path),
  );
  if (!file) {
    throw new Error(`File ${filepath} not found`);
  }
  return file;
}

export function getPossibleFilepaths(
  filepath: string,
  buildDir: string,
): string[] {
  if (filepath === "") {
    return [`${buildDir}/index.html`];
  }
  const possibleFilepath = [`${filepath}.html`, `${filepath}/index.html`];
  if (filepath === "/") {
    possibleFilepath.push(`${filepath}index.html`);
  }
  return possibleFilepath.map((filepath) => `${buildDir}/${filepath}`);
}
