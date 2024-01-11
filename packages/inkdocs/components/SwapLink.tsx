import { LayoutTree } from "..";
import { chooseLayout } from "../builder/layout";
import { SwapRouterOptions, getSwapATag } from "../plugins/swap_router";

export interface SwapLinkProps {
  children: JSX.Element;
  href: string;
  layoutTree: LayoutTree;
  filepath: string;
  metadata: any;
  swapRouterOptions: SwapRouterOptions;
}

export default function SwapLink({
  children,
  href,
  layoutTree,
  filepath,
  metadata = {},
  swapRouterOptions,
}: SwapLinkProps): JSX.Element {
  const myLayout = chooseLayout(
    {
      filepath,
      html: "",
      metadata,
    },
    layoutTree,
  );

  const { target, getUrl } = getSwapATag(
    myLayout,
    href,
    layoutTree,
    swapRouterOptions,
  );

  return (
    <a
      hx-get={getUrl}
      hx-swap="outerHTML"
      hx-target={target}
      hx-trigger="click"
    >
      {children}
    </a>
  );
}
