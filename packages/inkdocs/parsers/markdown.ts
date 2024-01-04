import { Parser } from "../index";
import { marked } from "marked";
import { spliceMetadata } from ".";

function markdown(): Parser {
  return (text: string) => {
    const { content, metadata } = spliceMetadata(text);
    const html = marked(content);

    return {
      html: html,
      metadata: metadata,
    };
  };
}

export default markdown;
