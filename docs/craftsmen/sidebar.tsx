import { Artifact, InkdocsOptions, Route } from "inkdocs";
import SwapLink from "inkdocs/components/SwapLink";

export default function Sidebar(_: InkdocsOptions, routes: Route[]): Artifact {
  const routeTree = makeRouteTree(routes);

  // find the tree that is the segment "documentation"
  let documentationTree: RouteTree[] = [];
  for (let i = 0; i < routeTree.length; i++) {
    if (routeTree[i].segment === "documentation") {
      documentationTree = routeTree[i].children;
    }
  }
  sortTree(documentationTree);

  const sidebar = (
    <div class="flex flex-col fixed h-[calc(100vh-16rem)] top-2 left-2 lg:h-auto z-20 bg-background border rounded-md lg:border-none">
      <h1 class="m-2 text-2xl">Documentation</h1>
      {documentationTree.map((tree) => (
        <SidebarItem depth={0} tree={tree} />
      ))}
    </div>
  );

  return {
    name: "sidebar",
    data: sidebar,
  };
}

interface SidebarItemProps {
  tree: RouteTree;
  depth: number;
}
function SidebarItem(props: SidebarItemProps): JSX.Element {
  sortTree(props.tree.children);
  const myLink =
    props.tree.route === undefined ? (
      <span class="cursor-default">{props.tree.segment}</span>
    ) : (
      <SwapLink
        target="content"
        className="text-primary hover:text-primary-hover transition-all"
        href={props.tree.route.href}
      >
        {props.tree.route.metadata.title ?? props.tree.route.href}
      </SwapLink>
    );

  if (props.tree.children.length === 0) {
    return (
      <>
        <div class="m-2 text-lg">{myLink}</div>
      </>
    );
  } else {
    return (
      <details open={props.depth === 0}>
        <summary class="m-2 text-lg">{myLink}</summary>

        <div class="ml-4">
          {props.tree.children.map((child) => (
            <SidebarItem tree={child} depth={props.depth + 1} />
          ))}
        </div>
      </details>
    );
  }
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
    let indexRoute = undefined;
    let longestDepth = 0;
    for (let i = 0; i < segmentRoutes.length; i++) {
      const route = segmentRoutes[i];
      const split = getSplit(route.href);

      if (split.length > longestDepth) {
        longestDepth = split.length;
      }

      if (split[depth] === segment && split.length === depth + 1) {
        segmentRoutes.splice(i, 1);
        indexRoute = route;
      }
    }

    routeTree.push({
      segment,
      route: indexRoute,
      children:
        depth < longestDepth ? makeRouteTree(segmentRoutes, depth + 1) : [],
    });
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

function sortTree(routeTree: RouteTree[]) {
  routeTree.sort((a, b) => {
    if (a.route === undefined && b.route === undefined) {
      return 0;
    } else if (a.route === undefined) {
      return 1;
    } else if (b.route === undefined) {
      return -1;
    } else {
      return (a.route.metadata.weight ?? 0) - (b.route.metadata.weight ?? 0);
    }
  });
}
