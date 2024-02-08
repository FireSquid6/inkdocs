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
        <div class="hidden lg:flex lg:gap-x-12">
          <DesktopLink href="/documentation">Documentation</DesktopLink>
          <DesktopLink href="/documentation/plugins">Plugins</DesktopLink>
          <DesktopLink href="/blog">Blog</DesktopLink>
        </div>
      </nav>
    </header>
  );
}
/* mobile menu
      <div class="lg:hidden" role="dialog" aria-modal="true">
        <div class="fixed inset-0 z-50"></div>
        <div class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div class="flex items-center justify-between">
            <a href="#" class="-m-1.5 p-1.5">
              <span class="sr-only">Your Company</span>
              <img
                class="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700">
              <span class="sr-only">Close menu</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10">
              <div class="space-y-2 py-6">
                <SwapLink
                  href=""
                  target="layout"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Documentation
                </SwapLink>
                <SwapLink
                  target="layout"
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Plugins
                </SwapLink>
                <a
                  href="https://github.com/firesquid6/inkdocs"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Github
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
*/

function DesktopLink({
  href,
  children,
}: {
  href: string;
  children: JSX.Element;
}) {
  return (
    <SwapLink
      target="layout"
      href={href}
      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-text hover:text-gray-400 transition-all"
    >
      {children}
    </SwapLink>
  );
}
