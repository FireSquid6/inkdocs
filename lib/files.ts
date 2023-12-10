import fs from "fs";

export interface Filesystem {
  files: File[];
  read(path: string): File | null;
  write(file: File): void;
  exists(path: string): boolean;
  outputToDirectory(directory: string): void;
  forFiles(callback: (file: File) => void): void;
}

type File = {
  path: string;
  content: string;
};

export function getRealFilesystem(directory: string): Filesystem {
  const system: Filesystem = {
    files: [],
    read(path: string): File | null {
      const file = this.files.find((file) => file.path === path);
      return file || null;
    },
    write(file: File): void {
      if (this.exists(file.path)) {
        this.files = this.files.map((f) => (f.path === file.path ? file : f));
      } else {
        this.files.push(file);
      }
    },
    exists(path: string): boolean {
      return this.files.some((file) => file.path === path);
    },
    outputToDirectory(directory: string): void {
      this.files.forEach((file) => {
        const path = `${directory}/${file.path}`;
        fs.mkdirSync(path.split("/").slice(0, -1).join("/"), {
          recursive: true,
        });
        fs.writeFileSync(path, file.content);
      });
    },
    forFiles(callback: (file: File) => void): void {
      this.files.forEach(callback);
    },
  };

  const paths = recursivelyReadDir(directory);
  for (const path of paths) {
    system.files.push({
      path: path,
      content: fs.readFileSync(path, "utf-8"),
    });
  }

  return system;
}

function recursivelyReadDir(directory: string): string[] {
  const files = fs.readdirSync(directory);
  const result: string[] = [];

  files.forEach((file) => {
    const path = `${directory}/${file}`;
    const stat = fs.statSync(path);

    if (stat.isDirectory()) {
      result.push(...recursivelyReadDir(path));
    } else {
      result.push(path);
    }
  });

  return result;
}

export function copyAllFiles(source: string, target: string): void {
  const paths = recursivelyReadDir(source);
  for (const path of paths) {
    const relativePath = path.replace(source, "");
    const targetPath = `${target}/${relativePath}`;
    fs.mkdirSync(targetPath.split("/").slice(0, -1).join("/"), {
      recursive: true,
    });
    fs.copyFileSync(path, targetPath);
  }
}
