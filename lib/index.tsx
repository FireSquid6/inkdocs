import { InkdocsConfig } from "./config";
import * as fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";

export function build(config: InkdocsConfig) {
  console.log(config);
  // load everything from the content folder
  const filenames = fs.readdirSync(config.pagesFolder);
  for (const filename of filenames) {
    const file = fs.readFileSync(`${config.pagesFolder}/${filename}`, "utf-8");
    const { data, content } = matter(file);

    const html = marked(content);

    console.log(data);
    console.log(html);
  }
}
