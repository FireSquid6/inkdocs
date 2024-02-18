import { describe, it, expect } from "bun:test";
import { addToHead } from "../../lib/add-to-head";

describe("addToHead", () => {
  it("should append to head", () => {
    const html = "<title>Test</title>";
    const options = { baseHtml: "<html><head></head></html>" };
    addToHead(html, options);
    expect(options.baseHtml).toBe(
      "<html><head><title>Test</title></head></html>",
    );
  });
  it("deals with stuff already in the head", () => {
    const html = "<title>Test</title>";
    const options = {
      baseHtml: "<html><head><meta><p>Some random stuff</p></head></html>",
    };
    addToHead(html, options);
    expect(options.baseHtml).toBe(
      "<html><head><meta><p>Some random stuff</p><title>Test</title></head></html>",
    );
  });
});
