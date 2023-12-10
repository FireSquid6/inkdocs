import { InkdocsConfig } from "./config";

import { Layout } from "./config";
import { File, getRealFilesystem, copyAllFiles, readFile } from "./files";
import { parsers } from "./parser";

export function build(config: InkdocsConfig) {
  console.log(config);
  // load everything from the content folder
  const inputFilesystem = getRealFilesystem(config.pagesFolder);
  const outputFilesystem = getRealFilesystem(config.outputFolder ?? "build");
  const layouts = getLayoutsMap(config);

  if (config.staticFolder) {
    copyAllFiles(config.staticFolder, config.outputFolder ?? "build");
  }

  const baseHtml = readFile(config.baseHtmlPath);

  inputFilesystem.forFiles((file: File) => {
    const ext = file.path.split(".").pop();
    if (!ext) {
      console.log(`File ${file.path} has no extension`);
      return;
    }
    const parser = parsers.get(ext);
    if (!parser) {
      console.log(`No parser found for ${file.path}`);
      return;
    }
    const output = parser(file, layouts, baseHtml);

    file.path = file.path
      .replace(/\.md$/, ".html")
      .replace(config.pagesFolder, "");

    outputFilesystem.write({
      path: file.path,
      content: output,
    });
  });

  outputFilesystem.outputToDirectory(config.outputFolder ?? "build");
}

function getLayoutsMap(config: InkdocsConfig): Map<string, Layout> {
  const layouts = new Map<string, Layout>();
  for (const layout of config.layouts) {
    layouts.set(layout.name, layout);
  }
  return layouts;
}
