import marked, { type MarkedExtension } from "marked";
import "@kitajs/html/register";

export interface Component {
  name: string;
  generator: (children: JSX.Element, args: Map<string, string>) => JSX.Element;
}

enum ParserState {
  Normal,
  Component,
}

export default function parse(
  src: string,
  components: Component[],
  markedExtensions: MarkedExtension[] = [],
): string {
  for (const extension of markedExtensions) {
    marked.use(extension);
  }

  const lines = src.split("\n");

  let newSrc = "";
  let state = ParserState.Normal;
  let name = "";
  let childrenToParse = "";
  let args = new Map<string, string>();

  for (const line of lines) {
    switch (state) {
      case ParserState.Normal:
        if (line.trim().startsWith("%%%")) {
          name = line.trim().slice(3);
          state = ParserState.Component;
          args = new Map();
        } else {
          newSrc += line + "\n";
        }
        break;
      case ParserState.Component:
        if (line.trim().startsWith("%%%")) {
          // end of component. Parse everything and add to newSrc
          const innerJsx = marked.parse(childrenToParse) as JSX.Element;
          const component = components.find((c) => c.name === name);
          if (component) {
            newSrc += component.generator(innerJsx, args) + "\n";
          } else {
            // TODO: print diagnostic because no component was found
            newSrc += childrenToParse + "\n";
          }

          state = ParserState.Normal;
        } else {
          if (line.trim().startsWith("@inkparam")) {
            // param lines should look like:
            // @param key value
            const [_, key, value] = line.trim().split(" ");
            args.set(key, value);
          }

          childrenToParse += line + "\n";
        }
        break;
    }
  }

  return marked.parse(newSrc) as string;
}
