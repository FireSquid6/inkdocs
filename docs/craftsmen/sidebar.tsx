import { Artifact, InkdocsOptions, Route } from "inkdocs";
import SwapLink from "inkdocs/components/SwapLink";

export default function Sidebar(_: InkdocsOptions, routes: Route[]): Artifact {
  const routeTree = makeRouteTree(routes);
  const sidebar = (
    <div>
      <p>Documentation</p>
      <div class="sidenav">
        {routeTree.map((tree) => (
          <SidebarItem tree={tree} />
        ))}
      </div>
    </div>
  );

  return {
    name: "sidebar",
    data: sidebar,
  };
}

interface SidebarItemProps {
  tree: RouteTree;
}
function SidebarItem(props: SidebarItemProps): JSX.Element {
  return (
    <>
      {props.tree.route === undefined ? (
        <p>{props.tree.segment}</p>
      ) : (
        <SwapLink target="content" className="" href={props.tree.route.href}>
          {props.tree.route.metadata.title ?? props.tree.route.href}
        </SwapLink>
      )}

      <div class="ml-2">
        {props.tree.children.map((child) => (
          <SidebarItem tree={child} />
        ))}
      </div>
    </>
  );
}

export interface RouteTree {
  segment: string;
  route: Route | undefined;
  children: RouteTree[];
}

export function makeRouteTree(routes: Route[], depth = 0): RouteTree[] {
  const routeTree: RouteTree[] = [];
  const groupedRoutes = groupRoutesBySegment(routes, depth);

  for (const [segment, segmentRoutes] of groupedRoutes) {
    // find the route where split[depth] === segment
    let indexRoute = undefined;
    for (let i = 0; i < segmentRoutes.length; i++) {
      const route = segmentRoutes[i];
      const split = getSplit(route.href);
      if (split[depth] === segment && split.length === depth + 1) {
        // remove this route from segmentRoutes
        segmentRoutes.splice(i, 1);
        indexRoute = route;
        routeTree.push({
          segment,
          route: indexRoute,
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
