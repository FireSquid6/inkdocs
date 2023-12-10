// @file handles everything to do with taking a `Route` and generating the final html for each page
// @author Jonathan Deiss
import { Route, InkdocsConfig, Layout } from "./config";

type Generator = (
  route: Route,
  config: InkdocsConfig,
  layoutMap: Map<string, Layout>,
) => File;

export const generators = new Map<string, Generator>();

function getLayoutsMap(config: InkdocsConfig): Map<string, Layout> {
  const layouts = new Map<string, Layout>();
  for (const layout of config.layouts) {
    layouts.set(layout.name, layout);
  }
  return layouts;
}
