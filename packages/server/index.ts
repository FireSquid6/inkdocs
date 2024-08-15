import { InkdocsOptions, Plugin, defaultOptions } from "inkdocs";
import { addToHead } from "inkdocs/lib/add-to-head";
import path from "path";
import fs from "fs";

// detects if the devmode flag is present and adds the neccessary client script to the head of so
export function devserverPlugin(): Plugin {
  return {
    beforeBuild: (options) => {
      for (const arg of process.argv) {
        if (arg === "--devmode") {
          addToHead(
            `<script defer src="/client-javascript.js"></script>`,
            options,
          );
        }
      }

      return {
        craftsmen: [],
        parsers: new Map(),
      };
    },
  };
}

export function devserver(options: InkdocsOptions, buildScript: string) {
  // initial build
  rebuild(buildScript, options.buildFolder ?? defaultOptions.buildFolder);
  serve(options);

  const cwd = process.cwd();

  // const watcher = new Watcher(cwd, {
  //   recursive: true,
  //   ignoreInitial: true,
  //   ignore: (targetPath) => {
  //     for (const ignoreFolder of ignoreFolders) {
  //       if (targetPath.startsWith(ignoreFolder)) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   },
  // });
  //
  // watcher.on("error", (error) => {
  //   devserverError(`Watcher error: ${error}`);
  // });

  const watcher = fs.watch(cwd, { recursive: true }, (event, filename) => {
  
  })

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
          devserverLog(`Received client status request`);

          // TODO: also listen to create and delete events
          watcher.once("change", async (filepath) => {
            devserverLog(`Change detected ${filepath}`);
            const status = rebuild(
              buildScript,
              options.buildFolder ?? defaultOptions.buildFolder,
            );
            ws.send(status ? "success" : "failure");
            devserverLog(`Sent status to client`);
          });
        }
      },
    },
  });

  devserverLog(`Devserver is using ${server.hostname}:${server.port}`);
}

function rebuild(buildScript: string, buildFolder: string): boolean {
  devserverLog("Rebuilding...");
  const process = Bun.spawnSync(["bun", "run", buildScript, "--devmode"], {
    stdio: ["inherit", "inherit", "inherit"],
  });

  const clientJavascriptFilepath = path.join(__dirname, "client-javascript.js");
  fs.copyFileSync(
    clientJavascriptFilepath,
    path.join(buildFolder, "client-javascript.js"),
  );

  return process.exitCode === 0;
}

export function serve(options: InkdocsOptions) {
  const serverOptions = options.server ?? defaultOptions.server;
  const buildFolder = options.buildFolder ?? defaultOptions.buildFolder;
  const port = serverOptions.port ?? defaultOptions.server.port;

  Bun.serve({
    port: port,
    async fetch(req) {
      const url = new URL(req.url);

      let filePath = path.join(buildFolder, url.pathname);

      // add a /index.html to the end of the path if it has no extension
      if (getExtension(filePath) === "") {
        filePath = path.join(filePath, "index.html");
      }

      console.log(`📦 ${url.pathname} -> ${filePath}`);

      const file = Bun.file(filePath);
      return new Response(file);
    },
    error() {
      return new Response(null, { status: 404 });
    },
  });

  console.log(`🚀 Server is running on http://localhost:${port}`);
}

function getExtension(filepath: string): string {
  const parts = filepath.split(".");
  if (parts.length === 1) {
    return "";
  }

  return parts[parts.length - 1];
}

function devserverLog(text: string) {
  console.log(`💻 \x1b[34mDEVSERVER: \x1b[0m${text}`);
}

function devserverError(text: string) {
  console.error(`❌ \x1b[31;1m DEVSERVER: \x1b[31;0m ${text}`);
}
