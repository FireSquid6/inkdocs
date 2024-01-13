import SwapLink from "inkdocs/components/SwapLink";
import options from "../";
import { defaultOptions } from "inkdocs";

interface LinkProps {
  children: JSX.Element;
  href: string;
  filepath: string;
  metadata: any;
}

// export interface SwapLinkProps {
//   children: JSX.Element;
//   href: string;
//   layoutTree: layoutTree;
//   filepath: string;
//   metadata: any;
//   swapRouterOptions: SwapRouterOptions;
// }
//
const swapRouterOptions = {
  contentSelector: "content",
  layoutSelector: "layout",
};

export default function Link(props: LinkProps) {
  return (
    <SwapLink
      href={props.href}
      filepath={props.filepath}
      metadata={props.metadata}
      swapRouterOptions={swapRouterOptions}
      layoutTree={options.layoutTree ?? defaultOptions.layoutTree}
    >
      {props.children}
    </SwapLink>
  );
}
