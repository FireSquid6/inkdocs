import { Artifact, InkdocsOptions, Route } from "inkdocs";
import SwapLink from "inkdocs/components/SwapLink";

export default function Sidebar(_: InkdocsOptions, routes: Route[]): Artifact {
  const sidenav = (
    <div class="sidenav">
      {routes.map((route) => {
        const split = route.href.split("/");
        while (split[0] === "") {
          split.shift();
        }
        if (split[0] !== "documentation") {
          return null;
        }

        const depth = Math.min(split.length - 1, 6);
        return (
          <SwapLink
            target="content"
            className={`ml-${depth}`}
            href={route.href}
          >
            {route.metadata.title ?? route.href}
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
