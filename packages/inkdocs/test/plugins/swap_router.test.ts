import { describe, it, expect } from "bun:test";
import { getLayoutFromHref, getSwapATag } from "../../plugins/swap_router";
import { findContent } from "../../plugins/swap_router";

describe("getLayoutFromHref", () => {
  it("correctly identifies standard routes", () => {
    const result = getLayoutFromHref("/test", {
      path: "",
      layoutName: "default",
      children: [
        {
          path: "test",
          layoutName: "test",
          children: [],
        },
      ],
    });

    expect(result).toEqual("test");
  });
  it("deals with edge case of /", () => {
    const result = getLayoutFromHref("/", {
      path: "",
      layoutName: "other",
      children: [
        {
          path: "",
          layoutName: "test",
          children: [],
        },
      ],
    });

    expect(result).toEqual("other");
  });
});

describe("getSwapATag", () => {
  it("returns the correct a tag", () => {
    const result = getSwapATag(
      "layout",
      "/test",
      {
        path: "",
        layoutName: "default",
        children: [
          {
            path: "test",
            layoutName: "layout",
            children: [],
          },
        ],
      },
      {
        contentSelector: "content",
        layoutSelector: "layout",
      },
    );
    expect(result).toEqual({
      target: "#content",
      getUrl: "/@content/test",
    });
  });
  it("returns the correct tag with a different layout", () => {
    const result = getSwapATag(
      "layout",
      "/test",
      {
        path: "",
        layoutName: "default",
        children: [
          {
            path: "test",
            layoutName: "other",
            children: [],
          },
        ],
      },
      {
        contentSelector: "content",
        layoutSelector: "layout",
      },
    );
    expect(result).toEqual({
      target: "#layout",
      getUrl: "/@layout/test",
    });
  });
});

describe("findContent", () => {
  it("works with some simple html", () => {
    const result = findContent(
      `<html><body><div id="content">hello</div></body></html>`,
      "content",
    );
    expect(result).toEqual('<div id="content">hello</div>');
  });
  it("throws an error if the content selector isn't found", () => {
    expect(() =>
      findContent(
        `<html><body><div id="content">hello</div></body></html>`,
        "notfound",
      ),
    ).toThrow();
  });
  it("works with some more complex html", () => {
    const result = findContent(
      `<html><body><div id="content"><div id="content">hello</div></div></body></html>`,
      "content",
    );
    expect(result).toEqual('<div id="content">hello</div>');
  });
  it("works with complex html that has nested stuff", () => {
    const result = findContent(
      `<html><body><div id="content"><div id="content"><div id="content">hello</div></div></div></body></html>`,
      "content",
    );
    expect(result).toEqual('<div id="content">hello</div>');
  });
});
