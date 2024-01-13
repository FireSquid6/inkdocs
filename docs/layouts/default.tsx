import { Layout } from "inkdocs";

const defaultLayout: Layout = (children: JSX.Element, metadata: any) => {
  return (
    <main id="layout">
      <div>Pretend I'm some really cool sidebar</div>

      <article id="content">
        <h1>{metadata.title ?? "Untitled"}</h1>
        {children}
      </article>
    </main>
  );
};

export default defaultLayout;
