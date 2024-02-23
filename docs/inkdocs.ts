import { InkdocsOptions } from "inkdocs";
import swapRouter from "inkdocs/plugins/swap-router";
import "@kitajs/html/register";
import DefaultLayout from "./layouts/default";
import Sidebar from "./craftsmen/sidebar";
import DocsLayout from "./layouts/documentation";
import tailwind from "inkdocs/plugins/tailwind";
import LandingLayout from "./layouts/landing";
import BlogPosts from "./craftsmen/blog-posts";
import BlogLayout from "./layouts/blog";
import { devserverPlugin } from "inkdocs-server";
import BlogLandingLayout from "./layouts/blog-landing";

export function getOptions(): InkdocsOptions {
  const baseHtml = `<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Inkdocs</title>

  <meta name="description" content="Inkdocs is a documentation generator for the web" />
  <meta name="author" content="firesquid6" />
  <meta name="keywords" content="documentation, generator, inkdocs, html, css, htmx,inkdocs, ink, docs, best, documentation, generator" />
  <link rel="stylesheet" href="/styles.css" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
  <script src="/prism.js" defer></script>
  <link rel="stylesheet" href="/prism.css" />
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
      ["bloglanding", BlogLandingLayout],
    ]),
    craftsmen: [Sidebar, BlogPosts],
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
      devserverPlugin(),
    ],
    server: {
      port: 3000,
    },
  };

  return options;
}

const options = getOptions();
export default options;
