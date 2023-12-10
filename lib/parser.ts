import { Layout } from "./config";
import { File } from "./files";
import matter from "gray-matter";
import { marked } from "marked";

type Parser = (
  file: File,
  layouts: Map<string, Layout>,
  baseHtml: string,
) => string;

export const parsers = new Map<string, Parser>();
parsers.set(".md", parseMarkdown);
parsers.set(".html", parseHtml);
parsers.set(".yaml", parseYaml);

function parseMarkdown(
  file: File,
  layouts: Map<string, Layout>,
  baseHtml: string,
): string {
  const { data, content } = matter(file.content);
  const jsx = marked(content) as JSX.Element;
  const layout = layouts.get(data.layout ?? "default");
  if (!layout) {
    console.log(`Layout ${data.layout} not found for ${file.path}`);
    console.log(`Using default layout`);
  }

  const templated = layout?.template({
    currentRoute: {
      metadata: data,
      content: jsx,
      href: "",
      outline: [],
      layout: layout?.name ?? "default",
    },
    routes: [],
  });
  if (templated === undefined) {
    console.log(`Layout ${data.layout} did not return any output`);
    throw new Error(`Layout ${data.layout} did not return any output`);
  }

  const htmlOutput = baseHtml.replace("${content}", templated as string);
  return htmlOutput;
}

function parseHtml(file: File): string {
  return "";
}

function parseYaml(file: File): string {
  return "";
}
