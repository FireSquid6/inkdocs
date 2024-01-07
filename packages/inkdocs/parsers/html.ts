import { Parser } from "..";
import { spliceMetadata } from ".";

function html(): Parser {
  return (text: string) => {
    const { content: html, metadata } = spliceMetadata(text);

    return {
      html: html as JSX.Element,
      metadata: metadata,
    };
  };
}

export default html;
