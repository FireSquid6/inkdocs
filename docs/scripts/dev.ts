import devserver from "inkdocs-devserver";
import options from "../inkdocs";

devserver("./scripts/build.ts", "./scripts/serve.ts", [
  options.buildFolder ?? "build",
  "node_modules",
]);
