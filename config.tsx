import { InkdocsConfig } from "./lib/config";
import "@kitajs/html/register";

export const config: InkdocsConfig = {
  baseHtmlPath: "./base.html",
  pagesFolder: "./content",
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
  layouts: [
    {
      name: "default",
      template: ({ currentRoute }) => {
        return (
          <main>
            <h1>{currentRoute.metadata.title}</h1>
          </main>
        );
      },
    },
  ],
};
