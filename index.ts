import { build } from "./lib";
import { config } from "./config";
import { watch } from "fs";
import { html } from "@elysiajs/html";
import Elysia from "elysia";
import { readFileSync } from "fs";

let devOpts = config.devOptions;
if (devOpts === undefined) {
  devOpts = {
    watch: false,
    port: 3000,
  };
}

if (devOpts.watch === false) {
  watch(config.pagesFolder, () => {
    console.log("\nFiles changed, rebuilding...");
    build(config);
  });
}

build(config);

const outputFolder = config.outputFolder ?? "build";

const app = new Elysia()
  .use(html())
  .get("/", () => {
    // find the index.html file
    const filepath = outputFolder + "/hello.html";
    console.log(filepath);
    const content = readFileSync(filepath, "utf-8");
    return content;
  })
  .listen(devOpts.port, () => {
    console.log(`Server started on port ${devOpts?.port ?? 3000}`);
  });
