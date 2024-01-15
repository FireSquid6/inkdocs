import path from "path";

export interface SwapLinkProps {
  children: JSX.Element;
  href: string;
  target: "content" | "layout";
}

export default function SwapLink({
  children,
  href,
  target,
}: SwapLinkProps): JSX.Element {
  const getUrl = path.join(`/@${target}`, href);
  return (
    <a
      hx-get={getUrl}
      hx-swap="outerHTML"
      hx-target={`#${target}`}
      hx-trigger="click"
      hx-push-url={href}
    >
      {children}
    </a>
  );
}
