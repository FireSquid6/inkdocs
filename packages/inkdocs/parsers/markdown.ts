import { Parser } from "../index";
import { marked } from "marked";
import { spliceMetadata } from ".";

const markdown: Parser = {
  filetypes: ["md", "markdown"],
  parse: (text: string) => {
    const { content, metadata } = spliceMetadata(text);
    const html = marked(content);

    return {
      html: html,
      metadata: metadata,
    };
  },
}


export default markdown;
