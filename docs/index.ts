import { InkdocsOptions } from "inkdocs";
import fs from "node:fs";
import swapRouter from "inkdocs/plugins/swap_router";
import "@kitajs/html/register";
import DefaultLayout from "./layouts/default";

export function getOptions(): InkdocsOptions {
  const baseHtml = fs.readFileSync("base.html", "utf-8");

  const options: InkdocsOptions = {
    staticFolder: "static",
    buildFolder: "build",
    contentFolder: "content",
    baseHtml,
    layouts: new Map([["default", DefaultLayout]]),
    layoutTree: {
      path: "",
      layoutName: "default",
      children: [],
    },
    plugins: [
      swapRouter({
        contentSelector: "content",
        layoutSelector: "layout",
      }),
    ],
    server: {
      port: 8008,
      apiRoutes: [],
    },
  };

  return options;
}

const options = getOptions();
export default options;
