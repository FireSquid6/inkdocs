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
    readFile(filepath: string): string {
      if (!fs.existsSync(filepath)) {
        throw new Error(`File ${filepath} does not exist`);
      }
      return fs.readFileSync(filepath, "utf8");
    },
    writeFile(filepath: string, contents: string): void {
      // ensure the directory exists
      if (!fs.existsSync(path.dirname(filepath))) {
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
      }

      fs.writeFileSync(filepath, contents);
    },
    exists(filepath: string): boolean {
      return fs.existsSync(filepath);
    },
    getAllFilenamesInDirectory(filepath: string): string[] {
      return recursivelyReadDir(filepath);
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

function recursivelyReadDir(dir: string): string[] {
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
