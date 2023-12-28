import { describe, it, expect } from "bun:test";
import { getNewFilepath } from "../builder";


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
