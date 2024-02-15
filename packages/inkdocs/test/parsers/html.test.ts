import { describe, it, expect } from "bun:test";
import html from "../../parsers/html";

describe("html parser", () => {
  it("should parse html", () => {
    const content = `
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
          <h1>Test</h1>
        </body>
      </html>
    `;
    const parser = html();
    const result = parser(content, "");
    expect(result.html).toEqual(content);
  });
  it("should deal with metadata", () => {
    const content = `---
        title: Test
        layout: default   
      ---
      <html>
        <head>
          <title>Test</title>
          <meta name="author" content="John Doe">
        </head>
        <body>
          <h1>Test</h1>
        </body>
      </html>
    `;
    const result = html()(content, "");
    expect(result.metadata).toEqual({
      title: "Test",
      layout: "default",
    });
    expect(result.html).toEqual(`
      <html>
        <head>
          <title>Test</title>
          <meta name="author" content="John Doe">
        </head>
        <body>
          <h1>Test</h1>
        </body>
      </html>
    `);
  });
});
