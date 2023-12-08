import { InkdocsConfig } from "./config";
import * as fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";
import "@kitajs/html/register";
import { Layout } from "./config";

export function build(config: InkdocsConfig) {
  console.log(config);
  // load everything from the content folder
  const filenames = fs.readdirSync(config.pagesFolder);
  for (const filename of filenames) {
    const file = fs.readFileSync(`${config.pagesFolder}/${filename}`, "utf-8");
    const { data, content } = matter(file);

    const html = marked(content) as JSX.Element;
    const layout: Layout = {
      name: "default",
      template: ({ routes, currentRoute }) => (
        <html>
          <head>
            <title safe>{data.title}</title>
          </head>
          <body>
            <h1 safe>{data.title}</h1>
            {currentRoute.content}
          </body>
        </html>
      ),
    };

    console.log(data);
    console.log(
      layout.template({
        routes: [],
        currentRoute: {
          content: html,
          href: "",
          layout: "",
          metadata: data,
          path: "",
          outline: [],
        },
      }),
    );
  }
}
