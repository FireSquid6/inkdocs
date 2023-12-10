import { test, describe, expect } from "bun:test";
import { filepathToHref, parseMarkdown, getLayout } from "../lib/parser";

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
        layoutTree: {
          path: "/",
          layout: "default",
          children: [],
        },
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

describe("getLayout", () => {
  test("should return the layout from the metadata if it exists", () => {
    expect(
      getLayout(
        "/test",
        {
          path: "/",
          layout: "default",
          children: [],
        },
        {
          layout: "mySickLayout",
        },
      ),
    ).toBe("mySickLayout");
  });
  test("should return the default layout if no layout is specified", () => {
    expect(
      getLayout(
        "/test",
        {
          path: "/",
          layout: "default",
          children: [],
        },
        {},
      ),
    ).toBe("default");
  });
  test("should search down the tree", () => {
    expect(
      getLayout(
        "/test",
        {
          path: "/",
          layout: "default",
          children: [
            {
              path: "test",
              layout: "testLayout",
              children: [],
            },
          ],
        },
        {},
      ),
    ).toBe("testLayout");
  });
});
