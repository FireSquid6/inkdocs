import Elysia from "elysia";
import path from "path";
import { watch } from "fs";
import { html } from "@elysiajs/html";
import "@kitajs/html/register";
import fs from "fs";
import { Subprocess } from "bun";
import cors from "@elysiajs/cors";

// function main() {
//   const argNames = [
//     "watch-ignore",
//     "build-script",
//     "serve-script",
//     "use-test-html",
//   ];
//
//   const args = getArgs();
//   const ignoreFolders: string[] = args.get("watch-ignore")?.split(",") ?? [];
//   const buildScript = args.get("build-script") ?? "";
//   const serveScript = args.get("serve-script") ?? "";
//   const useTestHtml = args.get("use-test-html") !== undefined;
//   devserver(buildScript, serveScript, useTestHtml, ignoreFolders);
// }

// starts the devserver. Watches for changes in the cwd and rebuild and restarts the server when changes are detected. All commands are run relative to the
export default function devserver(
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

  watch(process.cwd(), { recursive: true }, async (_, filepath) => {
    if (filepath === null) {
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
}

// function getArgs() {
//   const args = new Map<string, string>();
//   for (const arg of process.argv) {
//     if (arg.startsWith("--")) {
//       const argSplit = arg.slice(2).split("=");
//       if (argNames.includes(argSplit[0])) {
//         if (argSplit.length === 1) {
//           args.set(argSplit[0], "");
//           continue;
//         }
//         args.set(argSplit[0], argSplit[1]);
//       }
//     }
//   }
//   return args;
// }

function log(text: string) {
  console.log(`💻 \x1b[34mDEVSERVER: \x1b[0m${text}`);
}

function error(text: string) {
  console.error(`❌ \x1b[31;1m DEVSERVER: \x1b31;${text}`);
}
