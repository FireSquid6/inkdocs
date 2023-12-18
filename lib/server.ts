import Elysia from "elysia";
import { html } from "@elysiajs/html";
import { InkdocsConfig } from "./config";

export function inkdocsServe(config: InkdocsConfig) {
  const app = new Elysia();
  const port = getPort(config);

  app.use(html());
  app.get("*", ({ params }) => {
    const route = params["*"];
    return getHtmlFromRoute(route, config);
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return app;
}

function getPort(config: InkdocsConfig) {
  return config.devOptions?.port ?? 3000;
}

function getHtmlFromRoute(route: string, config: InkdocsConfig) {}
