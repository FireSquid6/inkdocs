import Elysia from "elysia";
import path from "path";
import { watch } from "fs";
import { html } from "@elysiajs/html";
import "@kitajs/html/register";
import fs from "fs";

const app = new Elysia();
app.use(html());

// TODO:
// - add a build folder option in the cli args to avoid watching
// - make interface to give devserver access to what commands to run for building and serving
// - maybe a devserver config file?
let version = 0;

app.get("/client-javascript", () => {
  return Bun.file(path.join(__dirname, "client-javascript.js"));
});
app.get("/version", () => {
  return {
    version: version,
  };
});
// TODO: remove this
app.get("/test", () => {
  const file = fs.readFileSync("test-html.html", "utf-8");
  return file as JSX.Element;
});

app.listen(8008, () => {
  console.log("listening on port 8008");
});

watch(
  // TODO: change this to a real thing
  "test-files",
  { recursive: true },
  () => {
    console.log("change detected. Increasing Version.");
    // TODO: this should:
    // - kill the old server process
    // - run the build
    // - start the new server
    // - FINALLY, increase version
    version += 1;
    console.log(version);
  },
);

const argNames = ["watch-ignore", "build-script", "serve-script"];

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
