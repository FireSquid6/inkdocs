import { Artifact, InkdocsOptions, Route } from "inkdocs";
import SwapLink from "inkdocs/components/SwapLink";

export default function Sidebar(_: InkdocsOptions, routes: Route[]): Artifact {
  const sidenav = (
    <div class="sidenav">
      {routes.map((route) => {
        const depth = Math.min(route.href.split("/").length - 1, 6);
        return (
          <SwapLink
            style=""
            target="content"
            className={`ml-${depth}`}
            href={route.href}
          >
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
