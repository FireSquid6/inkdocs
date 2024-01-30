import Elysia from "elysia";
import path from "path";
import { html } from "@elysiajs/html";
import "@kitajs/html/register";
import fs from "fs";
import { Subprocess } from "bun";
import cors from "@elysiajs/cors";

function devserver(
  buildScript: string | undefined, // script to run to build the project. Run as `bun run ${buildScript}`
  serveScript: string | undefined, // script to run to serve the project Run as `bun run ${serveScript}`
  ignoreFolders: string[], // list of folders to ignore when watching for changes
  useTestHtml: boolean = false, // whether to use the test html page
) {
  const app = new Elysia();

  app.use(html());
  app.use(cors());

  let version = 0;

  let serveProcess: Subprocess | undefined = undefined;

  if (buildScript === undefined || serveScript === undefined) {
    error("build-script and serve-script are required");
    process.exit(1);
  }

  restartServer(buildScript, serveScript);

  app.get("/client-javascript", () => {
    return Bun.file(path.join(__dirname, "client-javascript.js"));
  });
  if (useTestHtml) {
    app.get("/test", () => {
      const file = fs.readFileSync("test-html.html", "utf-8");
      return file as JSX.Element;
    });
  }
  app.get("/version", () => {
    return { version };
  });

  app.listen(8008, () => {
    log("using port 8008 to watch for changes");
  });

  const watcher = fs.watch(".", { recursive: true }, async (_, filepath) => {
    console.log("I have detected a change in", filepath);
    if (filepath === null) {
      error("filepath is null. Something bad happened with the file watcher.");
      // idk how this could happen. Compiler is kinda pissy about it though so we just return
      return;
    }

    for (const ignoreFolder of ignoreFolders) {
      if (filepath.startsWith(ignoreFolder)) {
        return;
      }
    }

    console.log("------------------------------------");
    log(`detected change in ${filepath}. Restarting...`);
    console.log("------------------------------------\n");
    restartServer(buildScript, serveScript);
    version += 1;
  });

  async function restartServer(buildScript: string, serveScript: string) {
    const buildProcess = Bun.spawn(["bun", "run", buildScript], {
      stdio: ["inherit", "inherit", "inherit"],
    });
    await buildProcess.exited;

    if (serveProcess !== undefined) {
      serveProcess.kill();
    }
    serveProcess = Bun.spawn(["bun", "run", serveScript], {
      stdio: ["inherit", "inherit", "inherit"],
    });
  }

  // commits suicide becuase something is screwed
  function panicAndDie() {
    log("Killing myself. Something broke. Read above for more info.");
    if (serveProcess !== undefined) {
      serveProcess.kill();
    }
    process.exit(0);
  }

  watcher.on("error", (err) => {
    error("File watcher is throwing a fit:");
    console.error(err);
    panicAndDie();
  });
  watcher.on("close", () => {
    log("file watcher closed");
  });

  return watcher;
}

function log(text: string) {
  console.log(`💻 \x1b[34mDEVSERVER: \x1b[0m${text}`);
}

function error(text: string) {
  console.error(`❌ \x1b[31;1m DEVSERVER: \x1b[31;0m ${text}`);
}

devserver("./build.ts", "./serve.ts", []);
