import "@kitajs/html/register";

export interface InkdocsConfig {
  baseHtmlPath: string; // path to the base html file. You should use this html file to build your <head> tag. The ${content} variable will be replaced with your generated html
  layouts: Layout[]; // List of layouts to be used
  // components: Component[];
  staticFolder?: string; // path to a folder containing static assets. These will be copied to the output folder
  pagesFolder: string; // path to a folder containing markdown files. These will be converted to html and placed in the output folder
  outputFolder?: string; // path to the output folder. Defaults to "build"
}

export type Layout = {
  name: string;
  template: (props: TemplateProps) => JSX.Element;
};
type TemplateProps = {
  currentRoute: Route;
  routes: Route[];
};

export type Route = {
  href: string;
  path: string;
  layout: string;
  content: JSX.Element;
  outline: OutlineNode[];
  metadata: object;
};

export type OutlineNode = {
  text: string;
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
};

const layout: Layout = {
  name: "default",
  template: () => {
    return <p>Hello world!</p>;
  },
};
