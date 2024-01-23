import { Artifact, InkdocsOptions, Route } from "inkdocs";
import SwapLink from "inkdocs/components/SwapLink";

export default function Sidebar(
  options: InkdocsOptions,
  routes: Route[],
): Artifact {
  const sidenav = (
    <div class="sidenav">
      {routes.map((route) => {
        return;
        <SwapLink>{route.metadata.title ?? route.filepath}</SwapLink>;
      })}
    </div>
  );
  return {
    name: "sidebar",
    data: sidebar,
  };
}
