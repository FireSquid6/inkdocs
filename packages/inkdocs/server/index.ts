import { Elysia, Handler } from "elysia";

export interface ServerOptions {
  port?: number;
  apiRoutes?: ApiRoute[];
}

export interface ApiRoute {
  route: string;
  verb: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  handler: Handler;
}

export const defaultServerOptions = {
  port: 3000,
  apiRoutes: [],
};

export function serve(serverOptions: ServerOptions) {
  const app = new Elysia();

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
    }
  }
}
