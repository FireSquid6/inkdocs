import { build } from "../builder";
import { InkdocsOptions, Layout } from "..";
import "@kitajs/html/register";
import swapRouter from "../plugins/swap_router";
import { serve } from "../server";

const baseHtml = `<html>
<head>
  <title>Example Inkdocs</title>
  <link rel="stylesheet" href="/styles.css" />
  <script src="https://unpkg.com/htmx.org@1.9.10"></script>
</head>
<body>
{slot}
</body>
</html>`;

function main() {
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
    layouts: new Map([["default", defaultLayout]]),
    baseHtml: baseHtml,
    server: {
      port: 3000,
    },
    plugins: [
      swapRouter({
        contentSelector: "content",
        layoutSelector: "layout",
      }),
    ],
  };

  console.log("Building Pages...");
  build(options);
  console.log("✅ Pages successfully built!");
  console.log(`\n🚀 Started Server on port 3000`);
  serve(options);
}

main();
