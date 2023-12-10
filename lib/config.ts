import "@kitajs/html/register";

export interface InkdocsConfig {
  baseHtmlPath: string; // path to the base html file. You should use this html file to build your <head> tag. The ${content} variable will be replaced with your generated html
  layouts: Layout[]; // List of layouts to be used. The layout with the name "default" will be used if a content route does not specify a layout
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

export type Component = {
  name: string;
  template: (props: ComponentProps) => JSX.Element;
};
type ComponentProps = {
  data: object;
};

export type Route = {
  href: string;
  layout: string;
  content: JSX.Element;
  outline: OutlineNode[];
  metadata: any;
};

export type OutlineNode = {
  text: string;
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
};