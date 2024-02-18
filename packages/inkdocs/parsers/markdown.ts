import { Parser } from "../index";
import { spliceMetadata } from ".";
import parse, { Component } from "inkdown";

function markdown(components: Component[]): Parser {
  return (text: string) => {
    const { content, metadata } = spliceMetadata(text);
    const html = parse(content, components);

    return {
      html: html,
      metadata: metadata,
    };
  };
}

export default markdown;
