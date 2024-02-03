import { Plugin } from "..";
import { parseFromString } from "dom-parser";

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
const headerNames = ["h1", "h2", "h3", "h4", "h5", "h6"];

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
  const dom = parseFromString(html);
  const parent = dom.getElementById(parentId);

  if (!parent) {
    return [[], html];
  }

  const headers: Header[] = [];
  for (const child of parent.childNodes) {
    if (headerNames.includes(child.nodeName)) {
      const level = parseInt(child.nodeName[1]);
      const id = idFromText(child.textContent as string);

      child.attributes.push({
        name: "id",
        value: id,
      });

      headers.push({
        text: child.textContent as string,
        level: level,
        id: id,
      });
    }
  }

  const newHtml = dom.toString();

  return [headers, newHtml];
}
