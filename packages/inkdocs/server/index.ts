import { Elysia, Handler, NotFoundError } from "elysia";
import { InkdocsOptions, defaultOptions } from "..";
import path from "path";
import { html } from "@elysiajs/html";
import fs from "fs";

export interface ServerOptions {
  port?: number;
  apiRoutes?: ApiRoute[];
}

export interface ApiRoute {
  route: string;
  verb: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "ALL";
  handler: Handler;
}

export const defaultServerOptions = {
  port: 3000,
  apiRoutes: [],
};

export function serve(options: InkdocsOptions, serverOptions: ServerOptions) {
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
      // TODO: handle index files
      case "html":
        return fs.readFileSync(filepath, "utf8") as JSX.Element;
      default:
        if (fs.existsSync(filepath)) {
          return Bun.file(filepath);
        }
        throw new NotFoundError();
    }
  });

  addApiRoutes(app, serverOptions.apiRoutes ?? defaultServerOptions.apiRoutes);

  app.listen(serverOptions.port ?? defaultServerOptions.port);
}

export function addApiRoutes(app: Elysia, apiRoutes: ApiRoute[]) {
  for (const apiRoute of apiRoutes) {
    const route = "/api" + apiRoute.route;
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
    return "html";
  }

  return parts[parts.length - 1];
}
