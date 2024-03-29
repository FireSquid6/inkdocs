import { Layout } from "inkdocs";
import Root from "../components/Root";
import SwapLink from "inkdocs/components/SwapLink";

const LandingLayout: Layout = () => {
  return (
    <Root>
      <>
        <div class="flex flex-col mx-auto">
          <Hero />
          <Features />
        </div>

        <div id="content" class="prose prose-invert w-0"></div>
      </>
    </Root>
  );
};

function Hero() {
  return (
    <div class="relative isolate px-6 pt-14 mx-auto lg:px-8">
      <div
        class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          class="relative left-[calc(50%-11rem)] top-48 aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        ></div>
      </div>

      <HeroContent />

      <div
        class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        ></div>
      </div>
    </div>
  );
}

function HeroContent() {
  return (
    <div class="mx-auto max-w-2xl py-24">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight text-text sm:text-6xl">
          Make your docs beautiful
        </h1>
        <p class="mt-6 text-lg leading-8 text-text-darker">
          Reject react based SPAs and embrace hypertext
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <SwapLink
            href="/documentation/getting-started"
            target="layout"
            className="transition-all rounded-md bg-secondary 600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get started
          </SwapLink>
          <SwapLink
            href="/documentation"
            target="layout"
            className="text-sm font-semibold leading-6 text-text"
          >
            <>
              Learn more <span aria-hidden="true">→</span>
            </>
          </SwapLink>
        </div>
      </div>
    </div>
  );
}

function Features() {
  const features: FeatureProps[] = [
    {
      title: "Minimal JavaScript",
      description:
        "Inkdocs embraces the web's native hypertext capabilities and ships only htmx (10 kB).",
      icon: "HTML",
    },
    {
      title: "Fast",
      description:
        "Inkdocs stands on the shoulders of giants. It is powered by tools such as bun, htmx, and marked.",
      icon: "bolt",
    },
    {
      title: "Flexible",
      description:
        "Need a bespoke design? Every aspect of Inkdocs is completely customizable and extensible.",
      icon: "brush",
    },
    {
      title: "Simple",
      description:
        "Just need markdown files on the internet? Inkdocs can get you up and running in no time.",
      icon: "article",
    },
  ];
  return (
    <div class="mx-auto mt-4 max-w-2xl sm:mt-20 lg:mt-8 lg:max-w-4xl">
      <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
        {features.map((feature) => (
          <Feature {...feature} />
        ))}
      </dl>
    </div>
  );
}

interface FeatureProps {
  title: string;
  description: string;
  icon: string;
}
function Feature(props: FeatureProps) {
  return (
    <div class="relative pl-16">
      <dt class="text-base font-semibold leading-7 text-text">
        <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
          <span class="material-symbols-outlined">{props.icon}</span>
        </div>
        {props.title}
      </dt>
      <dd class="mt-2 text-base leading-7 text-text-darker">
        {props.description}
      </dd>
    </div>
  );
}
export default LandingLayout;
