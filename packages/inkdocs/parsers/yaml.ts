import YAML from "yaml";

function yaml() {
  return (text: string) => {
    const metadata = YAML.parse(text);

    return {
      html: "",
      metadata: metadata,
    };
  };
}

export default yaml;
