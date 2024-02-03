import { Plugin } from "..";
import { parseFromString } from "dom-parser";
import { parse, HTMLElement } from "node-html-parser";

function idFromText(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

export interface Header {
  text: string;
  level: number;
  id: string;
}

export interface HeaderIdsOptions {
  parentId: string;
}
const headerNames = ["H1", "H2", "H3", "H4", "H5", "H6"];

export default function headerIds(options: HeaderIdsOptions): Plugin {
  return {
    duringBuild: (_, routes) => {
      for (const route of routes) {
        const [headers, newHtml] = addIds(
          route.html.toString(),
          options.parentId,
        );
        route.html = newHtml;
        route.metadata.headers = headers;
      }
      return {
        layouts: new Map(),
      };
    },
  };
}

export function addIds(html: string, parentId: string): [Header[], string] {
  const dom = parse(html);
  const parent = dom.getElementById(parentId);

  if (!parent) {
    return [[], html];
  }

  const headers: Header[] = [];
  for (const node of parent.childNodes) {
    const child = node as HTMLElement;
    if (headerNames.includes(child.tagName)) {
      const level = parseInt(child.tagName[1]);
      const id = idFromText(child.textContent as string);
      child.setAttribute("id", id);

      headers.push({
        text: child.textContent as string,
        level: level,
        id: id,
      });
    }
  }

  return [headers, dom.toString()];
}
