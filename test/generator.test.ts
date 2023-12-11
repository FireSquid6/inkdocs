import { describe, test, expect } from "bun:test";
import { getBuildFilepath } from "../lib/generator";

describe("getBuildFilepath", () => {
  test("should return the correct path", () => {
    expect(getBuildFilepath("content/test.md", "content", "build")).toBe(
      "build/test.html",
    );
  });
  test("should deal with multi layered folders", () => {
    expect(getBuildFilepath("content/test/test.md", "content", "build")).toBe(
      "build/test/test.html",
    );
  });
});
