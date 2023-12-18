import Elysia from "elysia";
import { html } from "@elysiajs/html";
import { InkdocsConfig } from "./config";
import { Filesystem, getRealFilesystem, File } from "./files";
import path from "path";

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
  const filepath = path.join(outputFolder, route);
  if (filepath.split(".").length > 1) {
    const file = filesystem.files.find((file) => file.path === filepath);
    if (!file) {
      throw new Error(`File ${filepath} not found`);
    }
    return file;
  }

  const possibleFilepaths = getPossibleFilepaths(filepath, outputFolder);

  for (const f of filesystem.files) {
    if (possibleFilepaths.includes(f.path)) {
      return f;
    }
  }

  throw new Error(`File ${filepath} not found`);
}

export function getPossibleFilepaths(
  filepath: string,
  outputFolder: string,
): string[] {
  const split = [];
  for (const part of filepath.split("/")) {
    if (part !== "") {
      split.push(part);
    }
  }

  if (split[0] === outputFolder && split.length === 1) {
    return [`${outputFolder}/index.html`];
  }

  const possibleFilepaths: string[] = [
    `${split.join("/")}.html`,
    `${split.join("/")}/index.html`,
  ];

  return possibleFilepaths;
}
