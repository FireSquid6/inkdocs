import { describe, it, expect } from "bun:test";
import { getLayoutFromHref, getSwapATag } from "../../plugins/swap_router";

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
        contentSelector: "#content",
        layoutSelector: "#layout",
      },
    );
    expect(result).toEqual({
      target: "#content",
      getUrl: "@content/test",
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
        contentSelector: "#content",
        layoutSelector: "#layout",
      },
    );
    expect(result).toEqual({
      target: "#layout",
      getUrl: "@layout/test",
    });
  });
});
