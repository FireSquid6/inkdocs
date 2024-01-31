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

export interface RouteTree {
  segment: string;
  route: Route;
  children: RouteTree[];
}

export function makeRouteTree(routes: Route[], depth = 0): RouteTree[] {
  const tree: RouteTree[] = [];

  const groups = new Map<string, Route[]>();

  for (const route of routes) {
    const split = route.href.split("/");
    while (split[0] === "") {
      split.shift();
    }
    const segment = split[depth];

    if (segment === undefined) {
      console.error(
        "Route has no segment at depth. This shouldn't be possible",
        depth,
        route,
      );
      continue;
    }

    if (!groups.has(segment)) {
      groups.set(segment, [route]);
    } else {
      groups.get(segment)!.push(route);
    }
  }

  for (const group of groups) {
    // find the member of the group that's split ends with the segment
    const [segment, routes] = group;
    for (const route of routes) {
      const split = route.href.split("/");
      while (split[0] === "") {
        split.shift();
      }
      if (split[depth] === segment) {
        if (depth === 0) {
          tree.push({
            segment,
            route,
            children: makeRouteTree(routes, depth + 1),
          });
        } else {
          console.log("depth", depth, "segment", segment, "route", route);
        }
      }
    }
  }
  console.log(groups);

  return tree;
}
