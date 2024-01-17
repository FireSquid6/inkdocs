import { InkdocsOptions } from "..";
import path from "path";

export async function getOptions(): Promise<InkdocsOptions> {
  const cwd = process.cwd();
  const modulePath = path.join(cwd, "inkdocs.ts");
  const mod = await import(modulePath);
  const options = mod.default as InkdocsOptions;
  if (!options) {
    console.log(
      "Current directory does not have an index.ts file exporting an InkdocsOptions object",
    );
    process.exit(1);
  }
  return Promise.resolve(options);
}
