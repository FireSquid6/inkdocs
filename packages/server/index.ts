import { Elysia, NotFoundError } from "elysia";
import { InkdocsOptions, defaultOptions } from "inkdocs";
import path from "path";
import { html } from "@elysiajs/html";
import fs from "fs";
import Watcher from "watcher";

export function devserver(options: InkdocsOptions) {
  const app = serve(options);
  let status: Status = {
    version: 0,
    buildResult: "ONGOING",
  };

  app.get("/client-javascript", () => {
    return Bun.file(path.join(__dirname, "client-javascript.js"));
  });

  const cwd = process.cwd();
  const ignoreFolders = [
    path.join(cwd, "node_modules"),
    path.join(cwd, options.buildFolder ?? defaultOptions.buildFolder),
  ];

  const watcher = new Watcher(cwd, {
    recursive: true,
    ignoreInitial: true,
    ignore: (targetPath) => {
      for (const ignoreFolder of ignoreFolders) {
        if (targetPath.startsWith(ignoreFolder)) {
          return true;
        }
      }
      return false;
    },
  });

  const server = Bun.serve<{ authToken: string }>({
    fetch(req, server) {
      const success = server.upgrade(req);
      if (success) {
        // Bun automatically returns a 101 Switching Protocols
        // if the upgrade succeeds
        return undefined;
      }

      return new Response("devserver");
    },
    websocket: {
      async message(ws, message) {
        console.log(`Received ${message}`);

        watcher.once("", (filepath) => {
          console.log("Change detected", filepath);
          ws.send(JSON.stringify(status));
        });
      },
    },
  });

  console.log(`Listening on ${server.hostname}:${server.port}`);
}

interface Status {
  version: number;
  buildResult: "SUCCESS" | "FAILED" | "ONGOING";
}

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
