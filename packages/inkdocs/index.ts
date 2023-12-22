import "@kitajs/html/register";

export interface InkdocsOptions {
  builders?: Builder[];
  staticFolder?: string | undefined;
  buildFolder?: string | undefined;
  contentFolder: string;
}

export const defaultOptions: InkdocsOptions = {
  contentFolder: "content",
  buildFolder: "build",
};

export interface Builder {
  filetypes: string[]; // filetypes that the
  build(content: string): Promise<BuildResult> | BuildResult;
}

export interface BuildResult {
  html: JSX.Element;
}
