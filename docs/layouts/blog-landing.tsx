import { Layout, Route } from "inkdocs";
import Root from "../components/Root";
import SwapLink from "inkdocs/components/SwapLink";

const BlogLandingLayout: Layout = (_, metadata, artifacts) => {
  const blogRoutes = artifacts.get("blog-posts") as Route[];
  return (
    <Root>
      <>
        <article id="content" class="prose prose-invert mx-auto">
          <title>Inkdocs Blog</title>
          <h1>Inkdocs Blog</h1>
          <hr />
          <div>
            {blogRoutes.map((route) => (
              <SwapLink target="layout" href={route.href}>
                <>
                  <h2>{route.metadata.title}</h2>
                  <p>{route.metadata.description}</p>
                </>
              </SwapLink>
            ))}
          </div>
        </article>
      </>
    </Root>
  );
};

export default BlogLandingLayout;
