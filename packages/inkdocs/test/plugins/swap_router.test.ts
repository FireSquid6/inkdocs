import { describe, it, expect } from "bun:test";
import { getLayoutFromHref } from "../../plugins/swap_router";

describe("getLayoutFromHref", () => {
  it("correctly identifies standard routes", () => {
    const result = getLayoutFromHref("/test", {
      layouts: new Map([
        ["test", () => "test"],
        ["default", () => "default"],
      ]),
      directoryLayoutMap: new Map([["/test", "test"]]),
    });

    expect(result).toEqual("test");
  });
});
