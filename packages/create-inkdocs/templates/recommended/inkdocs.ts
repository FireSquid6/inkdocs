import { InkdocsOptions } from "inkdocs";
import fs from "node:fs";
import swapRouter from "inkdocs/plugins/swap-router";
import "@kitajs/html/register";
import DefaultLayout from "./layouts/default";
import Sidebar from "./craftsmen/sidebar";

export function getOptions(): InkdocsOptions {
  const baseHtml = fs.readFileSync("base.html", "utf-8");

  const options: InkdocsOptions = {
    staticFolder: "static",
    buildFolder: "build",
    contentFolder: "content",
    baseHtml,
    layouts: new Map([["default", DefaultLayout]]),
    craftsmen: [Sidebar],
    layoutTree: {
      path: "",
      layoutName: "default",
      children: [],
    },
    plugins: [swapRouter()],
    server: {
      port: 3000,
      apiRoutes: [],
    },
  };

  return options;
}

const options = getOptions();
export default options;
