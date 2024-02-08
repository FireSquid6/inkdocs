import { InkdocsOptions } from "inkdocs";
import swapRouter from "inkdocs/plugins/swap-router";
import "@kitajs/html/register";
import DefaultLayout from "./layouts/default";
import Sidebar from "./craftsmen/sidebar";
import DocsLayout from "./layouts/documentation";
import tailwind from "inkdocs/plugins/tailwind";
import LandingLayout from "./layouts/landing";

export function getOptions(): InkdocsOptions {
  const baseHtml = `<html>

<head>
  <link rel="stylesheet" href="/styles.css" />
  <script src="/htmx-bundle"></script>
</head>

<body>
  {slot}
</body>

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
      ],
    },
    plugins: [
      swapRouter(),
      tailwind({
        inputFile: "styles.css",
        outputFile: "styles.css",
      }),
    ],
    server: {
      port: 3000,
      apiRoutes: [],
    },
  };

  return options;
}

const options = getOptions();
export default options;
