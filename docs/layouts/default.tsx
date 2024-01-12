export default function DefaultLayout(children: JSX.Element): JSX.Element {
  return (
    <div id="layout">
      <main id="content">{children}</main>
    </div>
  );
}
