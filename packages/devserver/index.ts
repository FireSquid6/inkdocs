import Elysia from "elysia";
import path from "path";
import { watch } from "fs";
import { html } from "@elysiajs/html";
import "@kitajs/html/register";
import fs from "fs";
import { Subprocess } from "bun";
import cors from "@elysiajs/cors";

const app = new Elysia();
const argNames = ["watch-ignore", "build-script", "serve-script"];
app.use(html());
app.use(cors());

// TODO:
// - add a build folder option in the cli args to avoid watching
// - make interface to give devserver access to what commands to run for building and serving
// - maybe a devserver config file?
let version = 0;
const args = getArgs();
const ignoreFolders: string[] = args.get("watch-ignore")?.split(",") ?? [];
const buildScript = args.get("build-script");
const serveScript = args.get("serve-script");

let serveProcess: Subprocess | undefined = undefined;

if (buildScript === undefined || serveScript === undefined) {
  console.error("DEVSERVER: build-script and serve-script are required");
  process.exit(1);
}

restartServer(buildScript, serveScript);

app.get("/client-javascript", () => {
  return Bun.file(path.join(__dirname, "client-javascript.js"));
});
app.get("/version", () => {
  return version;
});
// TODO: remove this
app.get("/test", () => {
  const file = fs.readFileSync("test-html.html", "utf-8");
  return file as JSX.Element;
});

app.listen(8008, () => {
  console.log("DEVSERVER: using port 8008 to watch for changes");
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

  console.log(`DEVSERVER: detected change in ${filepath}`);
  restartServer(buildScript, serveScript);
  version += 1;
});

async function restartServer(buildScript: string, serveScript: string) {
  const buildProcess = Bun.spawn(["bun", "run", buildScript]);
  await buildProcess.exited;

  if (serveProcess !== undefined) {
    serveProcess.kill();
  }
  serveProcess = Bun.spawn(["bun", "run", serveScript]);
}

function getArgs() {
  const args = new Map<string, string>();
  for (const arg of process.argv) {
    if (arg.startsWith("--")) {
      const argSplit = arg.slice(2).split("=");
      if (argNames.includes(argSplit[0])) {
        args.set(argSplit[0], argSplit[1]);
      }
    }
  }
  return args;
}
