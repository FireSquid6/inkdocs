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
    ).toEqual([
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
  it("deals with nested routes", () => {
    expect(
      makeRouteTree(
        [
          {
            href: "whatever",
            filepath: "",
            html: "",
            metadata: {},
          },
          {
            href: "whatever/whatever2",
            filepath: "",
            html: "",
            metadata: {},
          },
          {
            href: "whatever/whatever2/whatever3",
            filepath: "",
            html: "",
            metadata: {},
          },
        ],
        0,
      ),
    ).toEqual([
      {
        segment: "whatever",
        children: [
          {
            segment: "whatever2",
            children: [
              {
                segment: "whatever3",
                children: [],
                route: {
                  href: "whatever/whatever2/whatever3",
                  filepath: "",
                  html: "",
                  metadata: {},
                },
              },
            ],
            route: {
              href: "whatever/whatever2",
              filepath: "",
              html: "",
              metadata: {},
            },
          },
        ],
        route: {
          href: "whatever",
          filepath: "",
          html: "",
          metadata: {},
        },
      },
    ]);
  });
  it("deals with a missing index route", () => {
    expect(
      makeRouteTree([
        {
          href: "whatever",
          filepath: "",
          html: "",
          metadata: {},
        },
        {
          href: "whatever/whatever2/whatever3",
          filepath: "",
          html: "",
          metadata: {},
        },
      ]),
    ).toEqual([
      {
        segment: "whatever",
        route: {
          href: "whatever",
          filepath: "",
          html: "",
          metadata: {},
        },
        children: [
          {
            segment: "whatever2",
            route: undefined,
            children: [
              {
                segment: "whatever3",
                route: {
                  href: "whatever/whatever2/whatever3",
                  filepath: "",
                  html: "",
                  metadata: {},
                },
                children: [],
              },
            ],
          },
        ],
      },
    ]);
  });
});
