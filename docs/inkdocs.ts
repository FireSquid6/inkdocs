import { InkdocsOptions } from "inkdocs";
import swapRouter from "inkdocs/plugins/swap-router";
import "@kitajs/html/register";
import DefaultLayout from "./layouts/default";
import Sidebar from "./craftsmen/sidebar";
import DocsLayout from "./layouts/documentation";
import tailwind from "inkdocs/plugins/tailwind";
import LandingLayout from "./layouts/landing";
import BlogLayout from "./layouts/blog";

export function getOptions(): InkdocsOptions {
  const baseHtml = `<html>

<head>
  <link rel="stylesheet" href="/styles.css" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
  <script src="/htmx-bundle"></script>
</head>
  {slot}
</html>`;

  const options: InkdocsOptions = {
    staticFolder: "static",
    buildFolder: "build",
    contentFolder: "content",
    baseHtml,
    layouts: new Map([
      ["default", DefaultLayout],
      ["docs", DocsLayout],
      ["landing", LandingLayout],
      ["blogpost", BlogLayout],
    ]),
    craftsmen: [Sidebar],
    layoutTree: {
      path: "",
      layoutName: "",
      children: [
        {
          path: "documentation",
          layoutName: "docs",
          children: [],
        },
        {
          path: "blog",
          layoutName: "blogpost",
          children: [],
        },
      ],
    },
    plugins: [
      swapRouter({}),
      tailwind({
        inputFile: "styles.css",
        outputFile: "styles.css",
      }),
    ],
    server: {
      port: 3000,
    },
  };

  return options;
}

const options = getOptions();
export default options;
