export interface FileInterface {
  read(path: string): File;
  write(path: string, file: File): void;
}

type File = {
  name: string;
  content: string;
};
