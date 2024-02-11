---
Title: Swap Link
---
The swap link is built to be used in conjunction with [the swap router](/documentation/plugins/swap-router)

Props:
```ts
export interface SwapLinkProps {
  children: JSX.Element;
  href: string;  // the url to find
  target: "content" | "layout"; // what to swap on the page
  className?: string; // in case you'd like to extend the class
}
```

The swap link will render an `<a>` tag that performs an hx-swap with the `target` and whatever you get from href. Be careful using `target: content` since you can easily create bugs and duplicate your header a bunch if you don't know what you're doing.