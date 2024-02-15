import { Elysia, NotFoundError } from "elysia";
import { InkdocsOptions, defaultOptions } from "inkdocs";
import path from "path";
import { html } from "@elysiajs/html";
import fs from "fs";

export function serve(options: InkdocsOptions): Elysia {
  const serverOptions = options.server ?? defaultOptions.server;
  const app = new Elysia();
  app.onError(({ code, error, set }) => {
    if (code === "NOT_FOUND") {
      set.status = 404;

      return "Not found :(";
    }

    return error;
  });

  app.use(html());

  app.get("*", ({ params }) => {
    const route = params["*"];
    const filepath = path.join(
      options.buildFolder ?? defaultOptions.buildFolder,
      route,
    );

    switch (getExtension(filepath)) {
      case "html":
      case "":
        const possibleFilepaths = getPossibleFilepaths(
          route,
          options.buildFolder ?? defaultOptions.buildFolder,
        );

        for (const possibleFilepath of possibleFilepaths) {
          if (fs.existsSync(possibleFilepath)) {
            console.log(`📄 /${route} -> ${possibleFilepath}`);
            const html = fs.readFileSync(
              possibleFilepath,
              "utf-8",
            ) as JSX.Element;
            return html;
          }
        }
        throw new NotFoundError();
      default:
        console.log(`📦 ${filepath}`);
        if (fs.existsSync(filepath)) {
          return Bun.file(filepath);
        }
        throw new NotFoundError();
    }
  });

  app.listen(serverOptions.port ?? defaultOptions.server.port, (server) => {
    console.log(`\n🚀 Started Server on port ${server.port}`);
  });

  return app;
}

function getExtension(filepath: string): string {
  const parts = filepath.split(".");
  if (parts.length === 1) {
    return "";
  }

  return parts[parts.length - 1];
}

export function getPossibleFilepaths(
  route: string,
  buildFolder: string,
): string[] {
  if (getExtension(route) === "html") {
    return [path.join(buildFolder, route)];
  }

  if (route.at(-1) === "/") {
    route = route.slice(0, -1);
  }

  if (route === "") {
    return [path.join(buildFolder, "index.html")];
  }

  const parts = route.split("/");

  if (parts[parts.length - 1] === "index") {
    parts.pop();
  }

  return [
    path.join(buildFolder, parts.join("/")) + ".html",
    path.join(buildFolder, parts.join("/"), "index.html"),
  ];
}
