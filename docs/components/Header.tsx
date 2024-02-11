import SwapLink from "inkdocs/components/SwapLink";

export default function Header() {
  return (
    <header>
      <nav
        class="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div class="flex lg:flex-1">
          <SwapLink href="/" target="layout" className="-m-1.5 p-1.5">
            <>
              <span class="sr-only">Inkdocs</span>
              <img
                class="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </>
          </SwapLink>
        </div>
        <div class="flex gap-x-12">
          <Link href="/documentation">Docs</Link>
          <Link href="/blog">Blog</Link>
        </div>
      </nav>
    </header>
  );
}
function Link({ href, children }: { href: string; children: JSX.Element }) {
  return (
    <SwapLink
      target="layout"
      href={href}
      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-text hover:text-gray-400 transition-all text-center align-middle z-10"
    >
      {children}
    </SwapLink>
  );
}
