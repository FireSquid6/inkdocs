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
      <>
        <div>{sidebar}</div>

        <article id="content" class="prose prose-invert mx-auto">
          <title>Inkdocs | {metadata.title ?? "Untitled"}</title>
          {children}
        </article>
      </>
    </Root>
  );
};

export default DocsLayout;
