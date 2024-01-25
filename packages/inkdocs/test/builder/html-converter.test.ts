import { describe, it, expect } from "bun:test";
import {
  getNewFilepath,
  getArtifacts,
  getRoutes,
  buildPages,
} from "../../builder/html-converter";
import { InkdocsOptions, Route } from "../../";
import { mockFilesystem } from "../../lib/filesystem";
import markdown from "../../parsers/markdown";

describe("buildPages", () => {
  it("returns the correct pages", () => {
    const routes: Route[] = [
      {
        filepath: "build/index.html",
        metadata: {},
        href: "/",
        html: "<p>hello world</p>",
      },
    ];
    const layouts = new Map([
      [
        "default",
        () => {
          return "default";
        },
      ],
    ]);
    const baseHtml = "<html></html>";
    const logger = console;

    const result = buildPages(
      routes,
      layouts,
      baseHtml,
      [],
      { path: "", layoutName: "default", children: [] },
      logger,
    );

    expect(result).toEqual([
      {
        filepath: "build/index.html",
        page: "<html></html>",
      },
    ]);
  });
});

describe("getNewFilepath", () => {
  it("returns the correct path", () => {
    const filepath = "./content/index.md";
    const contentFolder = "content";
    const buildFolder = "build";
    const result = getNewFilepath(filepath, contentFolder, buildFolder);
    expect(result).toEqual("build/index.html");
  });
  it("returns the correct path with subfolders", () => {
    const filepath = "./content/subfolder/index.md";
    const contentFolder = "content";
    const buildFolder = "build";
    const result = getNewFilepath(filepath, contentFolder, buildFolder);
    expect(result).toEqual("build/subfolder/index.html");
  });
  it("returns the correct path with relative path", () => {
    const filepath = "content/index.md";
    const contentFolder = "./content";
    const buildFolder = "./build";
    const result = getNewFilepath(filepath, contentFolder, buildFolder);
    expect(result).toEqual("build/index.html");
  });
});

describe("getArtifacts", () => {
  it("returns the correct artifacts", () => {
    const options: InkdocsOptions = {
      contentFolder: "content",
      buildFolder: "build",
      layouts: new Map(),
      parsers: new Map(),
      craftsmen: [
        () => {
          return {
            name: "test",
            data: {
              test: "test",
            },
          };
        },
      ],
    };
    const routes: Route[] = [
      {
        filepath: "./content/index.md",
        metadata: {},
        href: "/content",
        html: "<p>hello world</p>",
      },
    ];

    const result = getArtifacts(options, routes);
    expect(result).toEqual([
      {
        name: "test",
        data: {
          test: "test",
        },
      },
    ]);
  });
});

describe("getRoutes", () => {
  it("returns the correct routes", () => {
    const filesystem = mockFilesystem(
      new Map<string, string>([
        ["./content/index.md", "hello world"],
        ["./content/subfolder/index.md", "hello world"],
        ["./content/subfolder/page.md", "hello world"],
      ]),
    );

    const result = getRoutes(
      filesystem.getAllFilenamesInDirectory("./content"),
      filesystem,
      "content",
      "build",
      new Map([["md", markdown()]]),
      console,
    );

    expect(result).toEqual([
      {
        filepath: "build/index.html",
        metadata: {},
        href: "/",
        html: "<p>hello world</p>\n",
      },
      {
        filepath: "build/subfolder/index.html",
        href: "/subfolder",
        metadata: {},
        html: "<p>hello world</p>\n",
      },
      {
        filepath: "build/subfolder/page.html",
        href: "/subfolder/page",
        metadata: {},
        html: "<p>hello world</p>\n",
      },
    ]);
  });
});
