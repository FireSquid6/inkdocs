import { serve } from "inkdocs/server";
import { build } from "inkdocs/builder";
import { watch } from "fs";
import options from "..";
import Elysia from "elysia";
import { defaultOptions } from "inkdocs";

let currentApp: Elysia;

build(options);
currentApp = serve(options);

watch(".", { recursive: true }, (_, filename) => {
  filename = filename as string;
  const buildFolder = options.buildFolder ?? defaultOptions.buildFolder;

  if (filename.startsWith(buildFolder)) {
    return;
  }

  if (currentApp) {
    currentApp.stop();
  }

  // I frequently find it difficult to tell what errors are from my old code and what errors are from my new code, so I like to put a line of dashes in between the old and new output
  console.log("\n----------------------");
  console.log("📁 File Changed: " + filename);
  console.log("🔄 Restarting Server!");
  console.log("----------------------\n");

  build(options);
  currentApp = serve(options);
});
