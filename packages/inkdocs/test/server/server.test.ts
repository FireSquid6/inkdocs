import { getPossibleFilepaths } from "../../server";
import { describe, it, expect } from "bun:test";

describe("getPossibleFilepaths", () => {
  it("returns with a normal input", () => {
    expect(getPossibleFilepaths("/hello/world", "build")).toEqual([
      "build/hello/world.html",
      "build/hello/world/index.html",
    ]);
  });
  it("deals with edge case of home index", () => {
    expect(getPossibleFilepaths("/", "build")).toEqual(["build/index.html"]);
  });
  it("deals with a trailing slash", () => {
    expect(getPossibleFilepaths("/hello/world/", "build")).toEqual([
      "build/hello/world.html",
      "build/hello/world/index.html",
    ]);
  });
});
