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
    expect(getPossibleFilepaths("", "build")).toEqual(["build/index.html"]);
  });
  it("deals with a one part route", () => {
    expect(getPossibleFilepaths("hello", "build")).toEqual([
      "build/hello.html",
      "build/hello/index.html",
    ]);
  });
  it("deals with a trailing slash", () => {
    expect(getPossibleFilepaths("hello/world/", "build")).toEqual([
      "build/hello/world.html",
      "build/hello/world/index.html",
    ]);
  });
  it("deals with the user specifying an index", () => {
    expect(getPossibleFilepaths("hello/world/index", "build")).toEqual([
      "build/hello/world.html",
      "build/hello/world/index.html",
    ]);
  });
  it("deals with .html being specified", () => {
    expect(getPossibleFilepaths("hello/world.html", "build")).toEqual([
      "build/hello/world.html",
    ]);
  });
});
