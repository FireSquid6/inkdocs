import Footer from "./Footer";
import Header from "./Header";

export default function Root({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  return (
    <>
      <Header />
      <main id="layout">{children}</main>
      <Footer />
    </>
  );
}
