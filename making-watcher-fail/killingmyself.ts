import Watcher from "watcher";

const watcher = new Watcher(".");
watcher.on("all", () => {
  console.log("I detected something");
});
