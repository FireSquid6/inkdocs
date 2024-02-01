import { Artifact, InkdocsOptions, Route } from "inkdocs";
import SwapLink from "inkdocs/components/SwapLink";
import util from "util";

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
  const routeTree: RouteTree[] = [];
  const groupedRoutes = groupRoutesBySegment(routes, depth);

  for (const [segment, segmentRoutes] of groupedRoutes) {
    // find the route where split[depth] === segment
    for (let i = 0; i < segmentRoutes.length; i++) {
      const route = segmentRoutes[i];
      const split = getSplit(route.href);
      if (split[depth] === segment && split.length === depth + 1) {
        // remove this route from segmentRoutes
        segmentRoutes.splice(i, 1);
        routeTree.push({
          segment,
          route,
          children: makeRouteTree(segmentRoutes, depth + 1),
        });
      }
    }
  }

  return routeTree;
}

function groupRoutesBySegment(
  routes: Route[],
  depth: number = 0,
): Map<string, Route[]> {
  const groupedRoutes = new Map<string, Route[]>();

  for (const route of routes) {
    const split = getSplit(route.href);

    const segment = split[depth];
    if (!groupedRoutes.has(segment)) {
      groupedRoutes.set(segment, []);
    }
    groupedRoutes.get(segment)!.push(route);
  }

  return groupedRoutes;
}

function getSplit(href: string): string[] {
  const split = href.split("/");
  while (split[0] === "") {
    split.shift();
  }
  return split;
}
