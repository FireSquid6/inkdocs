import { Route, LayoutTree } from "..";

export function chooseLayout(
  route: Route,
  layoutTree: LayoutTree,
  buildFolder: string = "build",
): string {
  // uses the layout specified in the metadata
  // if (route.metadata.layout) {
  //   if (layouts.has(route.metadata.layout)) {
  //     return route.metadata.layout;
  //   }
  //   return "default";
  // }

  const filepathSplit = route.filepath.split("/");
  if (filepathSplit[0] === buildFolder) {
    filepathSplit.shift();
  }

  const filename = filepathSplit.pop();
  if (filename !== "index.html") {
    const extensionSplit = filename!.split(".");
    extensionSplit.pop();
    filepathSplit.push(extensionSplit.join("."));
  }

  const directory = filepathSplit.join("/");
  const layout = getLayoutFromTree(directory, layoutTree);

  return layout === "" ? "default" : layout;
}

export function getLayoutFromTree(
  href: string,
  layoutTree: LayoutTree,
): string {
  const splitHref = href.split("/");
  const currentLayout = crawlTree(splitHref, layoutTree);

  return currentLayout;
}

function crawlTree(parts: string[], tree: LayoutTree): string {
  if (parts.length === 0 || parts[0] === "") {
    return tree.layoutName;
  }

  for (const subTree of tree.children) {
    if (subTree.path === parts[0]) {
      const crawlResult = crawlTree(parts.slice(1), subTree);
      if (crawlResult !== "") {
        return crawlResult;
      }
      return subTree.layoutName;
    }
  }

  return "";
}
