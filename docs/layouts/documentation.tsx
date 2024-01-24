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
        {sidebar}
        <h1>Documentation</h1>
        <article id="content">
          <title>{metadata.title ?? "Untitled"}</title>
          <h1>{metadata.title ?? "Untitled"}</h1>
          {children}
        </article>
      </>
    </Root>
  );
};

export default DocsLayout;
