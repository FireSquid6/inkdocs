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
      <div class="flex flex-row justify-between">
        <div>{sidebar}</div>

        <article id="content" class="prose prose-invert mx-auto">
          <title>{metadata.title ?? "Untitled"}</title>
          {children}
        </article>
      </div>
    </Root>
  );
};

export default DocsLayout;
