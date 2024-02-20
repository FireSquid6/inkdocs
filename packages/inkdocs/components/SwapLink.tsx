import path from "path";

export interface SwapLinkProps {
  children: JSX.Element;
  href: string;
  target: "content" | "layout";
  className?: string;
  class: string;
}

export default function SwapLink(props: SwapLinkProps) {
  const getUrl = path.join(`/@${props.target}`, props.href);
  return (
    <a
      hx-get={getUrl}
      hx-swap="outerHTML"
      hx-target={`#${props.target}`}
      hx-trigger="click"
      hx-push-url={props.href}
      class={props.className + " " + props.class}
    >
      {props.children}
    </a>
  );
}
