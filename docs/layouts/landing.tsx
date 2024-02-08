import { Layout } from "inkdocs";
import Root from "../components/Root";

const LandingLayout: Layout = () => {
  return (
    <Root>
      <>
        <div class="isolate px-6 pt-14 lg:px-8">
          <div
            class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          ></div>
          <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div class="text-center">
              <h1 class="text-4xl font-bold tracking-tight text-text sm:text-6xl">
                sdflaskjdflsdkfj
              </h1>
              <p class="mt-6 text-lg leading-8 text-text">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
                fugiat aliqua.
              </p>
              <div class="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </a>
                <a href="#" class="text-sm font-semibold leading-6 text-text">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
          <div
            class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          ></div>
        </div>

        <div id="content" class="prose prose-invert mx-auto"></div>
      </>
    </Root>
  );
};

export default LandingLayout;
