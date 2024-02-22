import { InkdocsOptions, Route, Artifact } from "inkdocs";

export default function BlogPosts(
  _: InkdocsOptions,
  routes: Route[],
): Artifact {
  const blogRoutes: Route[] = [];
  for (const route of routes) {
    if (route.href.startsWith("/blog/") && route.href !== "/blog/") {
      blogRoutes.push(route);
    }
  }

  return {
    name: "blog-posts",
    data: blogRoutes,
  };
}
