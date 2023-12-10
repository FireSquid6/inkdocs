import { test, describe, expect } from "bun:test";
import { filepathToHref } from "../lib/parser";

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
