import devserver from "../..";
import options from "..";

devserver("./example/scripts/build.ts", "./example/scripts/serve.ts", [
  options.buildFolder ?? "build",
]);
