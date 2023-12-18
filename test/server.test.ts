import { expect, test, describe } from "bun:test";
import { getPossibleFilepaths, getFileFromRoute } from "../lib/server";
import { Filesystem, makeFakeFilesystem } from "../lib/files";

const outputFolder = "build";
const system = makeFakeFilesystem([
  {
    path: "build/index.html",
    content: "index",
  },
  {
    path: "build/404.html",
    content: "404",
  },
  {
    path: "build/docs/index.html",
    content: "docs/index",
  },
  {
    path: "build/docs/404.html",
    content: "docs/404",
  },
  {
    path: "build/docs/getting-started.html",
    content: "docs/getting-started",
  },
  {
    path: "build/docs/installation.html",
    content: "docs/installation",
  },
  {
    path: "build/styles.css",
    content: "styles",
  },
]);

describe("getPossibleFilepaths", () => {
  test("returns possible filepaths for a route", () => {
    expect(getPossibleFilepaths("", outputFolder)).toEqual([
      "build/index.html",
    ]);
    expect(getPossibleFilepaths("docs", outputFolder)).toEqual([
      "build/docs.html",
      "build/docs/index.html",
    ]);
    expect(getPossibleFilepaths("docs/getting-started", outputFolder)).toEqual([
      "build/docs/getting-started.html",
      "build/docs/getting-started/index.html",
    ]);
  });
});

describe("getFileFromRoute", () => {
  test("returns a file from a route", () => {
    expect(getFileFromRoute("", outputFolder, system).content).toEqual("index");
    expect(getFileFromRoute("docs", outputFolder, system).content).toEqual(
      "docs/index",
    );
    expect(
      getFileFromRoute("docs/getting-started", outputFolder, system).content,
    ).toEqual("docs/getting-started");
  });
});
