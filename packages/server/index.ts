import { Elysia, NotFoundError } from "elysia";
import { InkdocsOptions, defaultOptions } from "inkdocs";
import path from "path";
import { html } from "@elysiajs/html";
import fs from "fs";
import Watcher from "watcher";
import cors from "@elysiajs/cors";

export function devserver(options: InkdocsOptions, buildScript: string) {
  // initial build and serve
  rebuild(buildScript);
  serve(options);

  const app = new Elysia();
  app.use(cors());
  app.get("/client-javascript", () => {
    return Bun.file(path.join(__dirname, "client-javascript.js"));
  });
  app.listen(8009, () => {
    log("Serving devserver client javascript on port 8009");
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
    port: 8008,
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
        if (message === "status") {
          log(`Received client status request`);

          // TODO: also listen to create and delete events
          watcher.once("change", async (filepath) => {
            log(`Change detected ${filepath}`);
            const status = rebuild(buildScript);
            ws.send(status ? "success" : "failure");
            log(`Sent status to client`);
          });
        }
      },
    },
  });

  log(`Listening on ${server.hostname}:${server.port}`);
}

function rebuild(buildScript: string): boolean {
  log("Rebuilding...");
  const process = Bun.spawnSync(["bun", "run", buildScript], {
    stdio: ["inherit", "inherit", "inherit"],
  });

  return process.exitCode === 0;
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

function log(text: string) {
  console.log(`💻 \x1b[34mDEVSERVER: \x1b[0m${text}`);
}

function error(text: string) {
  console.error(`❌ \x1b[31;1m DEVSERVER: \x1b[31;0m ${text}`);
}
