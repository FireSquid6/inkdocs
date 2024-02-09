import { Layout } from "inkdocs";

const BlogLayout: Layout = (children, metadata) => {
  return (
    <article id="content" class="prose prose-invert">
      <title>{metadata.title}</title>
      <h1>{metadata.title}</h1>
      <div>{children}</div>
    </article>
  );
};

export default BlogLayout;
