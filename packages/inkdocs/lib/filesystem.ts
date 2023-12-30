// provides a wrapper around the filesystem to allow for easier testing
import fs from "fs";
import path from "path";

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

export function copyFiles(from: string, to: string): void {
  const files = recursivelyReadDir(from);

  for (const file of files) {
    const relativePath = file.replace(from, "");
    const newPath = path.join(to, relativePath);

    if (fs.statSync(file).isDirectory()) {
      fs.mkdirSync(newPath, { recursive: true });
    } else {
      if (!fs.existsSync(path.dirname(newPath))) {
        fs.mkdirSync(path.dirname(newPath), { recursive: true });
      }
      fs.copyFileSync(file, newPath);
    }
  }
}

function recursivelyReadDir(dir: string) {
  // recursive: true doesn't work with bun, so we need our own function
  const files: string[] = [];

  fs.readdirSync(dir).forEach((file) => {
    const filePath = `${dir}/${file}`;
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      files.push(...recursivelyReadDir(filePath));
    } else {
      files.push(filePath);
    }
  });

  return files;
}
