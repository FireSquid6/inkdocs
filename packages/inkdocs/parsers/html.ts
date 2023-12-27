import { Parser } from "..";
import { spliceMetadata } from ".";

const html: Parser = {
  filetypes: ["html"],
  parse(text: string) {
    const { content: html, metadata } = spliceMetadata(text);

    return {
      html: html as JSX.Element,
      metadata: metadata,
    };
  },
}


export default html;
