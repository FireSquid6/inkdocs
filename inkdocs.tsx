import { InkdocsConfig } from "./lib/config";
import "@kitajs/html/register";
import { inkdocs } from "./lib";

export const config: InkdocsConfig = {
  baseHtmlPath: "./base.html",
  pagesFolder: "content",
  layoutTree: {
    path: "",
    layout: "default",
    children: [
      {
        layout: "blog",
        path: "blog",
        children: [],
      },
      {
        path: "docs",
        layout: "doc",
        children: [],
      },
    ],
  },
  devOptions: {
    port: 3000,
    watch: true,
  },
  staticFolder: "public",
  outputFolder: "build",
  layouts: [
    {
      name: "default",
      template: ({ page }) => {
        return (
          <main>
            <script>{`console.log("Hello from the default layout")`}</script>
            <h1>{page.metadata.title}</h1>
            {page.children}
          </main>
        );
      },
    },
  ],
};

function main() {
  inkdocs(config);
}

main();
