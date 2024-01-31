import { describe, expect, it } from "bun:test";
import { makeRouteTree } from "../craftsmen/sidebar";

describe("makeRouteTree", () => {
  it("deals with flat routes", () => {
    expect(
      makeRouteTree([
        {
          href: "whatever",
          filepath: "",
          html: "",
          metadata: {},
        },
        {
          href: "whatever2",
          filepath: "",
          html: "",
          metadata: {},
        },
        {
          href: "whatever3",
          filepath: "",
          html: "",
          metadata: {},
        },
      ]),
    ).toBe([
      {
        segment: "whatever",
        children: [],
        route: {
          href: "whatever",
          filepath: "",
          html: "",
          metadata: {},
        },
      },
      {
        segment: "whatever2",
        children: [],
        route: {
          href: "whatever2",
          filepath: "",
          html: "",
          metadata: {},
        },
      },
      {
        segment: "whatever3",
        children: [],
        route: {
          href: "whatever3",
          filepath: "",
          html: "",
          metadata: {},
        },
      },
    ]);
  });
});
