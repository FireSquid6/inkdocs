import { serve } from "../../server";
import { build } from "../../builder";
import { watch } from "fs";
import options from "..";
import Elysia from "elysia";

let currentApp: Elysia;

build(options);
currentApp = serve(options);

watch(".", { recursive: true }, () => {
  if (currentApp) {
    currentApp.stop();
  }

  console.log("\n----------------------");
  console.log("🔄 Restarting Server!");

  build(options);
  currentApp = serve(options);
});
