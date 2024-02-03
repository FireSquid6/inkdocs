import { addIds } from "../../plugins/header-ids";
import { describe, it, expect } from "bun:test";

describe("addIds", () => {
  it("adds ids to headers", () => {
    const html = `<div id="content">
        <h1>Something cool</h1>
        <h2>Something else that's cool</h2>
        <h3>another header</h3>
      </div>
    `;

    const [headers, newHtml] = addIds(html, "content");
    expect(headers).toEqual([
      { text: "Something cool", level: 1, id: "something-cool" },
      {
        text: "Something else that's cool",
        level: 2,
        id: "something-else-that-s-cool",
      },
      { text: "another header", level: 3, id: "another-header" },
    ]);
    expect(newHtml).toEqual(`<div id="content">
        <h1 id="something-cool">Something cool</h1>
        <h2 id="something-else-that-s-cool">Something else that's cool</h2>
        <h3 id="another-header">another header</h3>
      </div>
    `);
  });
});
