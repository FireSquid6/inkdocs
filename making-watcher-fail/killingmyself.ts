import Watcher from "watcher";

const watcher = new Watcher(".", { recursive: true });
watcher.on("change", (filepath) => {
  console.log("I saw an update: ");
  console.log(filepath);
});
watcher.on("error", (error) => {
  console.log(error);
});
