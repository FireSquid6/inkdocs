import markdown from "../../parsers/markdown";
import { describe, it, expect } from "bun:test";

describe("markdown parser", () => {
  it("parses markdown", () => {
    const text = `# Hello world
`;
    const result = markdown()(text, "");
    expect(result.html).toEqual("<h1>Hello world</h1>\n");
    expect(result.metadata).toEqual({});
  });
  it("deals with metadata", () => {
    const text = `---
title: Hello world
layout: default
---
# Hello world
some paragraph text`;
    const result = markdown()(text, "");
    expect(result.html).toEqual(
      "<h1>Hello world</h1>\n<p>some paragraph text</p>\n",
    );
    expect(result.metadata).toEqual({
      title: "Hello world",
      layout: "default",
    });
  });
});
