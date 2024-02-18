import parse from ".";
import { describe, it, expect } from "bun:test";
import { type Component } from ".";
import "@kitajs/html/register";

const example2 = `# Hello world!
%%% MyComponent
this is some standard text that includes **bold** stuff
%%%

this text came after the component`;

const result2 = `<h1>Hello world!</h1>
<article><p>this is some standard text that includes <strong>bold</strong> stuff</p>
</article>

<p>this text came after the component</p>
`;

describe("parse", () => {
  it("should parse markdown with no components", () => {
    const markdown = `# Hello world!
this is some standard text. it is multiline
`;
    const result = parse(markdown, []);
    expect(result).toEqual(`<h1>Hello world!</h1>
<p>this is some standard text. it is multiline</p>
`);
  });
  it("should insert a component", () => {
    const component: Component = {
      name: "MyComponent",
      generator: (children) => {
        console.log("generator was called");
        return <article>{children}</article>;
      },
    };

    expect(parse(example2, [component])).toEqual(result2);
  });
});
