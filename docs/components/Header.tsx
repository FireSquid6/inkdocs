import SwapLink from "inkdocs/components/SwapLink";

export default function Header() {
  return (
    <header class="sticky top-0 z-50 bg-background bg-opacity-90">
      <nav
        class="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div class="flex lg:flex-1">
          <SwapLink
            href="/"
            target="layout"
            className="-m-1.5 p-1.5 text-red hover:text-red1 text-lg"
          >
            <>{"<<>>"} Inkdocs</>
          </SwapLink>
        </div>
        <div class="flex gap-x-12 ">
          <Link icon="article" href="/documentation">
            Documentation
          </Link>
          <Link icon="extension" href="/documentation/plugins">
            Plugins
          </Link>
          <Link icon="description" href="/blog">
            Blog
          </Link>
        </div>
      </nav>
    </header>
  );
}
function Link({
  href,
  children,
  icon,
}: {
  href: string;
  icon: string;
  children: JSX.Element;
}) {
  const className =
    "-mx-3 rounded-lg px-1 md:px-2 py-2 text-base font-semibold leading-7 transition-all text-center align-middle z-10 text-green1 hover:text-green2 flex flex-row";

  const inner = (
    <>
      <span class="mr-1 md:mr-2 material-symbols-outlined">{icon}</span>
      <span class="hidden md:block">{children}</span>
    </>
  );

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        class={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }
  return (
    <SwapLink target="layout" href={href} className={className}>
      {inner}
    </SwapLink>
  );
}
