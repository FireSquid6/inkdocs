import { Layout } from "inkdocs";
import Root from "../components/Root";

const DocsLayout: Layout = (
  children: JSX.Element,
  metadata: any,
  artifacts,
) => {
  const sidebar = artifacts.get("sidebar") as JSX.Element;
  return (
    <Root>
      <div class="drawer lg:drawer-open">
        <input type="checkbox" id="drawer-toggle" class="drawer-toggle" />

        <div class="drawer-content">
          <label
            for="drawer-toggle"
            class="drawer-button inline hover:cursor-pointer lg:hidden"
          >
            <span class="material-symbols-outlined">menu</span>
          </label>

          <article id="content" class="prose prose-invert mx-auto">
            <title>Inkdocs | {metadata.title ?? "Untitled"}</title>
            {children}
          </article>
        </div>

        <div class="drawer-side min-h-[100vh] lg:border-none lg:h-full">
          {sidebar}
        </div>
      </div>
    </Root>
  );
};

export default DocsLayout;
