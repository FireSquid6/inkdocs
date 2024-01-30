import { watch } from "fs";

const watcher = watch(".", { recursive: true }, () => {
  console.log("I hate javascript");
});

watcher.on("error", (err) => {
  console.log(err);
});

console.log("starting");
