import { InkdocsConfig } from "./config";
import matter from "gray-matter";
import { marked } from "marked";
import fs from "fs";
import { Layout } from "./config";
import { getRealFilesystem } from "./files";
import { copyAllFiles } from "./files";

export function build(config: InkdocsConfig) {
  console.log(config);
  // load everything from the content folder
  const inputFilesystem = getRealFilesystem(config.pagesFolder);
  const outputFilesystem = getRealFilesystem(config.outputFolder ?? "build");
  const layouts = new Map<string, Layout>();
  for (const layout of config.layouts) {
    layouts.set(layout.name, layout);
  }

  if (config.staticFolder) {
    copyAllFiles(config.staticFolder, config.outputFolder ?? "build");
  }

  const baseHtml = fs.readFileSync(config.baseHtmlPath, "utf-8");

  inputFilesystem.forFiles((file) => {
    const { data, content } = matter(file.content);
    const jsx = marked(content) as JSX.Element;
    const layout = layouts.get(data.layout ?? "default");
    if (!layout) {
      console.log(`Layout ${data.layout} not found for ${file.path}`);
      console.log(`Using default layout`);
    }

    // TODO: make this change depending on the filetype:
    // md - parse as normal
    // html - read the file as a string and use that as the content
    // yaml - treat as plain metadata

    const output = layout?.template({
      currentRoute: {
        metadata: data,
        content: jsx,
        href: "",
        outline: [],
        layout: layout?.name ?? "default",
      },
      routes: [],
    });
    if (output === undefined) {
      console.log(`Layout ${data.layout} did not return any output`);
      return;
    }

    const htmlOutput = baseHtml.replace("${content}", output as string);

    file.path = file.path
      .replace(/\.md$/, ".html")
      .replace(config.pagesFolder, "");

    outputFilesystem.write({
      path: file.path,
      content: htmlOutput,
    });
  });

  outputFilesystem.outputToDirectory(config.outputFolder ?? "build");
}
