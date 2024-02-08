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
      <div class="docs-layout">
        <div class="docs-sidebar">{sidebar}</div>

        <article id="content" class="prose prose-invert">
          <title>{metadata.title ?? "Untitled"}</title>
          {children}
        </article>
      </div>
    </Root>
  );
};

export default DocsLayout;
