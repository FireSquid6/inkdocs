import { test, describe, expect } from "bun:test";
import { filepathToHref, parseMarkdown } from "../lib/parser";

describe("filepathToHref", () => {
  test("should return route", () => {
    expect(filepathToHref("test.md", "content")).toBe("/test");
  });
  test("should remove the contentFolder from the href", () => {
    expect(filepathToHref("content/test.md", "content")).toBe("/test");
  });
  test("should respect index files", () => {
    expect(filepathToHref("content/index.md", "content")).toBe("/");
  });
  test("should respect index files of any extension", () => {
    expect(filepathToHref("content/index.html", "content")).toBe("/");
  });
  test("should deal with long paths", () => {
    expect(filepathToHref("content/long/path/test.md", "content")).toBe(
      "/long/path/test",
    );
  });
});

describe("parseMarkdown", () => {
  const testFile = `---
layout: mySickLayout
title: My Sick Title
---
this is the content in the file
`;

  test("parses a markdown file", () => {
    const route = parseMarkdown(
      {
        path: "content/test/hello.md",
        content: testFile,
      },
      {
        pagesFolder: "content",
        baseHtmlPath: "base.html",
        layouts: [],
      },
    );
    expect(route).toEqual({
      href: "/test/hello",
      layout: "mySickLayout",
      metadata: {
        layout: "mySickLayout",
        title: "My Sick Title",
      },
      text: "this is the content in the file\n",
    });
  });
});
