import { build } from "./builder";
import { InkdocsConfig } from "./config";
import { inkdocsServe } from "./server";
import { inkdocsWatch } from "./watcher";

export function inkdocs(config: InkdocsConfig) {
  build(config);

  if (config.devOptions?.watch) {
    inkdocsWatch(config);
  }

  inkdocsServe(config);
}
