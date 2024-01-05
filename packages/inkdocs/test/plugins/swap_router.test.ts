import { describe, it, expect } from "bun:test";
import { getLayoutFromHref } from "../../plugins/swap_router";

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
