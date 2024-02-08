import { Layout } from "inkdocs";
import Root from "../components/Root";

const defaultLayout: Layout = (children: JSX.Element, metadata: any) => {
  return (
    <Root>
      <>
        <title>Inkdocs</title>
        <article id="content" class="prose prose-invert">
          {children}
        </article>
      </>
    </Root>
  );
};

export default defaultLayout;
