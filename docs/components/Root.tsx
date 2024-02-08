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
      <main id="layout" class="flex flex-row justify-between">
        {children}
      </main>
      <Footer />
    </>
  );
}
