import { InkdocsOptions, Layout } from "inkdocs";
import swapRouter from "inkdocs/plugins/swap-router";
import "@kitajs/html/register";

const baseHtml = `<html>
<head>
  <title>Example Inkdocs</title>
  <link rel="stylesheet" href="/styles.css" />
  <script src="https://unpkg.com/htmx.org@1.9.10"></script>
  <script defer src="/client-javascript.js"></script>
</head>
<body>
{slot}
</body>
</html>`;

const defaultLayout: Layout = (children: JSX.Element, metadata: any) => {
  return (
    <main id="layout">
      <div>Pretend I'm some really cool sidebar</div>
      <article id="content">
        <h1>{metadata.title ?? "Untitled"}</h1>
        {children}
      </article>
    </main>
  );
};

const options: InkdocsOptions = {
  parsers: new Map(),
  staticFolder: "example/static",
  buildFolder: "example/build",
  contentFolder: "example/content",
  craftsmen: [],
  layouts: new Map([
    ["default", defaultLayout],
    ["docs", defaultLayout],
  ]),
  layoutTree: {
    layoutName: "default",
    path: "",
    children: [
      {
        layoutName: "docs",
        path: "docs",
        children: [],
      },
    ],
  },
  baseHtml: baseHtml,
  server: {
    port: 3000,
  },
  plugins: [swapRouter({})],
};

export default options;
