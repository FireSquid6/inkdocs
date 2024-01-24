import { Artifact, InkdocsOptions, Route } from "inkdocs";
import SwapLink from "inkdocs/components/SwapLink";

export default function Sidebar(
  options: InkdocsOptions,
  routes: Route[],
): Artifact {
  const sidenav = (
    <div class="sidenav">
      {routes.map((route) => {
        const href = hrefFromFilepath(route.filepath);
        const depth = Math.min(href.split("/").length - 1, 6);
        return (
          <SwapLink target="content" className={`ml-${depth}`} href={href}>
            {route.metadata.title ?? route.filepath}
          </SwapLink>
        );
      })}
    </div>
  );
  return {
    name: "sidebar",
    data: sidenav,
  };
}

function hrefFromFilepath(filepath: string): string {
  const noExt = filepath.replace(/\.[^/.]+$/, "");

  const withSlash = noExt.startsWith("/") ? noExt : `/${noExt}`;

  const noIndex = withSlash.endsWith("/index")
    ? withSlash.slice(0, -6)
    : withSlash;

  const noTrailingSlash = noIndex.endsWith("/")
    ? noIndex.slice(0, -1)
    : noIndex;
  return noTrailingSlash;
}
