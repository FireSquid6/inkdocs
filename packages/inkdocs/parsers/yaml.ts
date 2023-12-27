import YAML from "yaml";

const yaml = {
  filetypes: ["yaml", "yml"],
  parse(text: string) {
    const metadata = YAML.parse(text);

    return {
      html: "",
      metadata: metadata,
    };
  },
};

export default yaml;
