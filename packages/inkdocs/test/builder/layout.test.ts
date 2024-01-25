import { describe, it, expect } from "bun:test";
import { chooseLayout, getLayoutFromTree } from "../../builder/layout";
import { Layout, LayoutTree } from "../..";

describe("getLayoutFromTree", () => {
  it("should return the correct layout", () => {
    const layoutTree = {
      layoutName: "default",
      path: "",
      children: [
        {
          layoutName: "default",
          path: "docs",
          children: [
            {
              layoutName: "docs",
              path: "api",
              children: [],
            },
          ],
        },
        {
          layoutName: "default",
          path: "api",
          children: [],
        },
        {
          layoutName: "blog",
          path: "blog",
          children: [],
        },
      ],
    };

    expect(getLayoutFromTree("docs/api", layoutTree)).toEqual("docs");
    expect(getLayoutFromTree("blog", layoutTree)).toEqual("blog");
    expect(getLayoutFromTree("docs", layoutTree)).toEqual("default");
    expect(getLayoutFromTree("", layoutTree)).toEqual("default");
  });
});

describe("chooseLayout", () => {
  it("should return the correct layout", () => {
    const layoutTree: LayoutTree = {
      layoutName: "default",
      path: "",
      children: [
        {
          layoutName: "default",
          path: "docs",
          children: [
            {
              layoutName: "docs",
              path: "api",
              children: [],
            },
          ],
        },
        {
          layoutName: "default",
          path: "api",
          children: [],
        },
        {
          layoutName: "blog",
          path: "blog",
          children: [],
        },
      ],
    };

    const testTree = {
      path: "",
      layoutName: "default",
      children: [
        {
          path: "documentation",
          layoutName: "docs",
          children: [],
        },
      ],
    };

    expect(
      chooseLayout(
        { filepath: "build/docs/api.html", href: "", html: "", metadata: {} },
        layoutTree,
      ),
    ).toEqual("docs");
    expect(
      chooseLayout(
        { filepath: "blog.html", href: "", html: "", metadata: {} },
        layoutTree,
      ),
    ).toEqual("blog");
    expect(
      chooseLayout(
        { filepath: "docs.html", href: "", html: "", metadata: {} },
        layoutTree,
      ),
    ).toEqual("default");
    expect(
      chooseLayout(
        { filepath: "build/index.html", href: "", html: "", metadata: {} },
        layoutTree,
      ),
    ).toEqual("default");
    expect(
      chooseLayout(
        {
          filepath: "build/documentation/index.html",
          html: "",
          metadata: {},
          href: "",
        },
        testTree,
      ),
    ).toEqual("docs");
  });
  it("works when doing what the example fails", () => {
    const layoutTree = {
      layoutName: "default",
      path: "",
      children: [
        {
          layoutName: "docs",
          path: "docs",
          children: [],
        },
      ],
    };

    expect(
      chooseLayout(
        {
          filepath: "example/build/docs/index.html",
          href: "",
          html: "",
          metadata: {},
        },
        layoutTree,
        "example/build",
      ),
    ).toBe("docs");
  });
});
