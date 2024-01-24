import { InkdocsOptions } from "inkdocs";
import swapRouter from "inkdocs/plugins/swap-router";
import "@kitajs/html/register";
import DefaultLayout from "./layouts/default";
import Sidebar from "./craftsmen/sidebar";
import DocsLayout from "./layouts/documentation";

export function getOptions(): InkdocsOptions {
  const baseHtml = `<html>

<head>
  <link rel="stylesheet" href="/styles.css" />
  <script src="https://unpkg.com/htmx.org@1.9.10"></script>
  <script src="http://localhost:8008/client-javascript"></script>
</head>

<body>
  {slot}
</body>

</html>
`;

  const options: InkdocsOptions = {
    staticFolder: "static",
    buildFolder: "build",
    contentFolder: "content",
    baseHtml,
    layouts: new Map([
      ["default", DefaultLayout],
      ["docs", DocsLayout],
    ]),
    craftsmen: [Sidebar],
    layoutTree: {
      path: "build",
      layoutName: "docs",
      children: [
        {
          path: "documentation",
          layoutName: "docs",
          children: [],
        },
      ],
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
