import { Elysia, Handler, NotFoundError } from "elysia";
import { InkdocsOptions, defaultOptions } from "..";
import path from "path";
import { html } from "@elysiajs/html";
import fs from "fs";

export interface ApiRoute {
  route: string;
  verb: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "ALL";
  handler: Handler;
}

export function serve(options: InkdocsOptions) {
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

  for (const plugin of options.plugins ?? defaultOptions.plugins) {
    if (plugin.setupServer) {
      const pluginServerResult = plugin.setupServer(options);
      addApiRoutes(app, pluginServerResult.apiRoutes);
    }
  }

  addApiRoutes(app, serverOptions.apiRoutes ?? defaultOptions.server.apiRoutes);

  app.listen(serverOptions.port ?? defaultOptions.server.port);
}

export function addApiRoutes(app: Elysia, apiRoutes: ApiRoute[]) {
  for (const apiRoute of apiRoutes) {
    const route = apiRoute.route;
    switch (apiRoute.verb) {
      case "GET":
        app.get(route, apiRoute.handler);
        break;
      case "POST":
        app.post(route, apiRoute.handler);
        break;
      case "PATCH":
        app.patch(route, apiRoute.handler);
        break;
      case "PUT":
        app.put(route, apiRoute.handler);
        break;
      case "DELETE":
        app.delete(route, apiRoute.handler);
        break;
      case "ALL":
        app.all(route, apiRoute.handler);
        break;
    }
  }
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
