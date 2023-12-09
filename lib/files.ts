import fs from "fs";

export interface Filesystem {
  files: File[];
  read(path: string): File | null;
  write(path: string, file: File): void;
  exists(path: string): boolean;
}

type File = {
  path: string;
  name: string;
  content: string;
};

export function getRealFilesystem(directory: string): Filesystem {
  const system: Filesystem = {
    files: [],
    read(path: string): File | null {
      const file = this.files.find((file) => file.path === path);
      return file || null;
    },
    write(path: string, file: File): void {
      if (this.exists(path)) {
        this.files = this.files.map((f) => (f.path === path ? file : f));
      } else {
        this.files.push(file);
      }
    },
    exists(path: string): boolean {
      return this.files.some((file) => file.path === path);
    },
  };

  const paths = recursivelyReadDir(directory);
  for (const path of paths) {
    system.files.push({
      path: path,
      name: path.split("/").pop() || "",
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
