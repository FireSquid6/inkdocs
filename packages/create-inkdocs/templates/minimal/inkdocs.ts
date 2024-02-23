import { InkdocsOptions } from "inkdocs";
import swapRouter from "inkdocs/plugins/swap-router";
import "@kitajs/html/register";
import { devserverPlugin } from "inkdocs-server";

export function getOptions(): InkdocsOptions {
  const baseHtml = `<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My App</title>

  <meta name="description" content="I have made a very cool app" />
  <meta name="author" content="someone" />
  <meta name="keywords" content="documentation, generator, inkdocs, html, css, htmx, inkdocs, ink, docs, documentation, generator" />
</head>
  {slot}
</html>`;

  const options: InkdocsOptions = {
    staticFolder: "static",
    buildFolder: "build",
    contentFolder: "content",
    baseHtml,
    layouts: new Map([
      // insert your layouts here
    ]),
    craftsmen: [],
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
    plugins: [swapRouter({}), devserverPlugin()],
    server: {
      port: 3000,
    },
  };

  return options;
}

const options = getOptions();
export default options;
