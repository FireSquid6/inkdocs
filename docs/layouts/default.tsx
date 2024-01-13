import { Layout } from "inkdocs";

const defaultLayout: Layout = (children: JSX.Element, metadata: any) => {
  return (
    <main id="layout">
      <title>Inkdocs</title>
      <article id="content">
        <h1>{metadata.title ?? "Untitled"}</h1>
        {children}
      </article>
    </main>
  );
};

export default defaultLayout;
