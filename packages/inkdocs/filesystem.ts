// provides a wrapper around the filesystem to allow for easier testing

export interface Filesystem {
  readFile(path: string): string;
  writeFile(path: string, contents: string): void;
  exists(path: string): boolean;
}
