import { Layout } from "inkdocs";
import Root from "../components/Root";

const BlogLayout: Layout = (children, metadata) => {
  return (
    <Root>
      <>
        <article id="content" class="prose prose-invert mx-auto">
          <title>{metadata.title}</title>
          <h1 class="text-center">{metadata.title}</h1>
          <hr />
          <div>{children}</div>
        </article>
      </>
    </Root>
  );
};

export default BlogLayout;
