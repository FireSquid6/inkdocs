import YAML from "yaml"


export function spliceMetadata(text: string, metadataSeparator: string = "---"): { content: string, metadata: object } {
  let content = ""
  let metadata = {}

  if (text.startsWith(metadataSeparator)) {
    text = text.slice(3);
    const split = text.split(metadataSeparator);

    metadata = YAML.parse(split[0]);
    content = split.length > 1 ? split[1] : "";
  } else {
    content = text;
  }

  return {
    content, metadata
  }
}
