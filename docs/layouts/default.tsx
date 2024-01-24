import { Layout } from "inkdocs";
import Root from "../components/Root";

const defaultLayout: Layout = (children: JSX.Element, metadata: any) => {
  return (
    <Root>
      <>
        <p>I made a change</p>
        <title>Inkdocs</title>
        <article id="content">
          <h1>{metadata.title ?? "Untitled"}</h1>
          {children}
        </article>
      </>
    </Root>
  );
};

export default defaultLayout;
