import { InkdocsConfig } from "./lib/config";
import "@kitajs/html/register";

export const config: InkdocsConfig = {
  baseHtmlPath: "./base.html",
  pagesFolder: "./content",
  layouts: [
    {
      name: "default",
      template: ({ currentRoute }) => {
        return (
          <html>
            <head>
              <title>{currentRoute.metadata.title ?? ""}</title>
            </head>

            <body>
              <h1>{currentRoute.metadata.title}</h1>
              {currentRoute.content}
            </body>
          </html>
        );
      },
    },
  ],
};
