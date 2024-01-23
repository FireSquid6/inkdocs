import SwapLink from "inkdocs/components/SwapLink";

export default function Header() {
  return (
    <header>
      <SwapLink href="/" target="layout">
        <span class="header-title">Inkdocs</span>
      </SwapLink>
      <span class="expander" />
      <nav>
        <SwapLink href="/documentation" target="layout">
          Docs
        </SwapLink>
        <SwapLink href="/blog" target="layout">
          Blog
        </SwapLink>
        <a href="https://github.com/firesquid6/inkdocs">Github</a>
      </nav>
    </header>
  );
}
