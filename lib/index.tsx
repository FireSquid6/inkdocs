import { InkdocsConfig } from "./config";
import matter from "gray-matter";
import { marked } from "marked";
import "@kitajs/html/register";
import { Layout } from "./config";
import { getRealFilesystem } from "./files";
import { OutputFileType } from "typescript";

export function build(config: InkdocsConfig) {
  console.log(config);
  // load everything from the content folder
  const inputFilesystem = getRealFilesystem(config.pagesFolder);
  const outputFilesystem = getRealFilesystem(config.outputFolder ?? "build");
  const layouts = new Map<string, Layout>();
  for (const layout of config.layouts) {
    layouts.set(layout.name, layout);
  }

  inputFilesystem.forFiles((file) => {
    const { data, content } = matter(file.content);
    const jsx = marked(content) as JSX.Element;
    const layout = layouts.get(data.layout ?? "default");
    if (!layout) {
      console.log(`Layout ${data.layout} not found for ${file.path}`);
      console.log(`Using default layout`);
    }

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

    file.path = file.path.replace(/\.md$/, ".html");

    outputFilesystem.write({
      path: file.path,
      content: output as string,
      name: file.name,
    });
  });

  outputFilesystem.outputToDirectory(config.outputFolder ?? "build");
}
