import { serve, ServerOptions } from "../server";
import { build } from "../builder";
import { InkdocsOptions, Layout } from "..";
import html from "../parsers/html";
import markdown from "../parsers/markdown";
import "@kitajs/html/register";

const baseHtml = `<html>
<head>
  <title>Example Inkdocs</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
{body}
</body>
</html>`;

function main() {
  const defaultLayout: Layout = (children: JSX.Element, metadata: any) => {
    const body = (
      <main>
        <h1>{metadata.title ?? "Untitled"}</h1>

        <div>{children}</div>
      </main>
    );

    return new Map([["body", body]]);
  };
  const serverOptions: ServerOptions = {
    port: 3000,
    apiRoutes: [],
  };

  const options: InkdocsOptions = {
    parsers: [html, markdown],
    staticFolder: "example/static",
    buildFolder: "example/build",
    contentFolder: "example/content",
    craftsmen: [],
    layouts: new Map([["default", defaultLayout]]),
    plugins: [],
    baseHtml: baseHtml,
  };

  console.log("Building Pages...");
  build(options);
  console.log("Starting Server...");
  serve(options, serverOptions);
}

main();
