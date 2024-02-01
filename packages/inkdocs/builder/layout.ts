import { Route, LayoutTree } from "..";

export function chooseLayout(
  route: Route,
  layoutTree: LayoutTree,
  buildFolder: string = "build",
): string {
  if (route.metadata.layout) {
    return route.metadata.layout;
  }

  let filepath = route.filepath;

  if (filepath.startsWith(buildFolder)) {
    filepath = filepath.slice(buildFolder.length);
  }

  const filepathSplit = filepath.split("/");

  const filename = filepathSplit.pop();
  if (filename !== "index.html") {
    const extensionSplit = filename!.split(".");
    extensionSplit.pop();
    filepathSplit.push(extensionSplit.join("."));
  }

  let directory = filepathSplit.join("/");

  if (directory.startsWith("/")) {
    directory = directory.slice(1);
  }
  // console.log(layoutTree);
  // console.log(route.filepath, " -> ", directory);

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
