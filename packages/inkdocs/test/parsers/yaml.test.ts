import { describe, expect, test } from "bun:test";
import yaml from "../../parsers/yaml";

describe("yaml parser", () => {
  test("should parse yaml", () => {
    const content = `
      title: Test
      layout: default   
    `;
    const result = yaml()(content);
    expect(result.metadata).toEqual({
      title: "Test",
      layout: "default",
    });
    expect(result.html).toEqual("");
  });
});
