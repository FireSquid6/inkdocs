import { InkdocsConfig } from "./lib/config";
import "@kitajs/html/register";

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
  outputFolder: "build",
  layouts: [
    {
      name: "default",
      template: ({ page }) => {
        return (
          <main>
            <h1>{page.metadata.title}</h1>
            {page.children}
          </main>
        );
      },
    },
  ],
};
