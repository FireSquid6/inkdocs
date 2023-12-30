// provides a wrapper around the filesystem to allow for easier testing
import fs from "fs";

export interface Filesystem {
  readFile(path: string): string;
  writeFile(path: string, contents: string): void;
  exists(path: string): boolean;
  getAllFilenamesInDirectory(path: string): string[];
}

export function mockFilesystem(files: Map<string, string>): Filesystem {
  return {
    readFile(path: string): string {
      if (!files.has(path)) {
        throw new Error(`File ${path} does not exist`);
      }
      return files.get(path)!;
    },
    writeFile(path: string, contents: string): void {
      files.set(path, contents);
    },
    exists(path: string): boolean {
      return files.has(path);
    },
    getAllFilenamesInDirectory(path: string): string[] {
      const filenames = Array.from(files.keys());
      return filenames.filter((file) => file.startsWith(path));
    },
  };
}

export function realFilesystem(): Filesystem {
  return {
    readFile(path: string): string {
      if (!fs.existsSync(path)) {
        throw new Error(`File ${path} does not exist`);
      }
      return fs.readFileSync(path, "utf8");
    },
    writeFile(path: string, contents: string): void {
      fs.writeFileSync(path, contents);
    },
    exists(path: string): boolean {
      return fs.existsSync(path);
    },
    getAllFilenamesInDirectory(path: string): string[] {
      const files = fs.readdirSync(path, { recursive: true });
      return files.map((file) => `${path}/${file}`);
    },
  };
}
