import { describe, it, expect } from "bun:test";
import {
  getNewFilepath,
  getArtifacts,
  getRoutes,
  getHtmlFiles,
  chooseLayout,
} from "../../builder/html_converter";
import { InkdocsOptions, Route } from "../../";
import { mockFilesystem } from "../../lib/filesystem";
import markdown from "../../parsers/markdown";

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
        html: "<p>hello world</p>\n",
      },
      {
        filepath: "build/subfolder/index.html",
        metadata: {},
        html: "<p>hello world</p>\n",
      },
    ]);
  });
});

describe("getHtmlFiles", () => {
  it("returns the correct html files", () => {
    const routes: Route[] = [
      {
        filepath: "build/index.html",
        metadata: {},
        html: "<p>hello world</p>\n",
      },
      {
        filepath: "build/subfolder/index.html",
        metadata: {},
        html: "<p>hello world</p>\n",
      },
    ];

    const result = getHtmlFiles(
      routes,
      new Map([
        [
          "default",
          (children: JSX.Element) => {
            return children;
          },
        ],
      ]),
      "<html><body>{slot}</body></html>",
      [],
      new Map(),
      console,
    );

    expect(result).toEqual(
      new Map([
        ["build/index.html", "<html><body><p>hello world</p>\n</body></html>"],
        [
          "build/subfolder/index.html",
          "<html><body><p>hello world</p>\n</body></html>",
        ],
      ]),
    );
  });
});

describe("chooseLayout", () => {
  it("returns the correct layout if it is specified in the metadata", () => {
    const result = chooseLayout(
      {
        filepath: "build/index.html",
        metadata: {
          layout: "test",
        },
        html: "<p>hello world</p>\n",
      },
      new Map([
        [
          "test",
          () => {
            return "test";
          },
        ],
      ]),
      new Map(),
    );

    expect(result).toEqual("test");
  });

  it("returns the default layout if no layout is specified in the metadata", () => {
    const result = chooseLayout(
      {
        filepath: "build/index.html",
        metadata: {},
        html: "<p>hello world</p>\n",
      },
      new Map([
        [
          "test",
          () => {
            return "test";
          },
        ],
      ]),
      new Map(),
    );

    expect(result).toEqual("default");
  });
  it("returns the default layout if the specified layout does not exist", () => {
    const result = chooseLayout(
      {
        filepath: "build/index.html",
        metadata: {
          layout: "nonexistent",
        },
        html: "<p>hello world</p>\n",
      },
      new Map([
        [
          "test",
          () => {
            return "test";
          },
        ],
      ]),
      new Map(),
    );

    expect(result).toEqual("default");
  });
  it("returns a layout if the directories map specifies it", () => {
    const result = chooseLayout(
      {
        filepath: "build/index.html",
        metadata: {},
        html: "<p>hello world</p>\n",
      },
      new Map([
        [
          "test",
          () => {
            return "test";
          },
        ],
      ]),
      new Map([
        ["build", "test"],
        ["build/subfolder", "test"],
      ]),
    );

    expect(result).toEqual("test");
  });

  it("returns the default layout if the directories map specified a nonexistent layout", () => {
    const result = chooseLayout(
      {
        filepath: "build/index.html",
        metadata: {},
        html: "<p>hello world</p>\n",
      },
      new Map([
        [
          "test",
          () => {
            return "test";
          },
        ],
      ]),
      new Map([
        ["build", "nonexistent"],
        ["build/subfolder", "nonexistent"],
      ]),
    );

    expect(result).toEqual("default");
  });
});
