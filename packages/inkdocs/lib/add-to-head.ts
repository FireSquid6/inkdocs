import { InkdocsOptions, defaultOptions } from "..";
import { parse } from "node-html-parser";
import { fatalError } from "./logger";

export function addToHead(html: JSX.Element, options: InkdocsOptions) {
  const dom = parse(options.baseHtml ?? defaultOptions.baseHtml);
  const head = dom.querySelector("head");
  const node = parse(html as string);

  if (!head) {
    fatalError("No <head> tag found in baseHtml");
  }

  head.appendChild(node);
  options.baseHtml = dom.toString();
}
