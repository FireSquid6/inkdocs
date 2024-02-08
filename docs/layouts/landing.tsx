import { Layout } from "inkdocs";
import Root from "../components/Root";

const LandingLayout: Layout = () => {
  return (
    <Root>
      <>
        <p>This is the landing page</p>

        <div id="content" class="prose prose-invert mx-auto"></div>
      </>
    </Root>
  );
};

export default LandingLayout;
