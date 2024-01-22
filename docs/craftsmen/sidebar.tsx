import { Artifact, InkdocsOptions, Route } from "inkdocs";

export default function Sidebar(
  options: InkdocsOptions,
  routes: Route[],
): Artifact {
  const sidebar = <div class="sidebar">{routes.map((route) => { })}</div>;
  return {
    name: "sidebar",
    data: sidebar,
  };
}
