import SwapLink from "inkdocs/components/SwapLink";

export default function Header() {
  return (
    <header>
      <SwapLink href="/" target="layout">
        <h1>Inkdocs</h1>
      </SwapLink>
      <nav>
        <SwapLink href="/" target="layout">
          Documentation
        </SwapLink>
        <SwapLink href="/" target="layout">
          Blog
        </SwapLink>
        <a href="https://github.com/firesquid6/inkdocs">Github</a>
      </nav>
    </header>
  );
}
