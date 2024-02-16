#!/usr/bin/env bun
import fs from "node:fs";
import path from "node:path";
import {
  text,
  confirm,
  intro,
  isCancel,
  cancel,
  select,
  outro,
  spinner,
} from "@clack/prompts";

interface Instructions {
  directory: string;
  template: Template;
}

interface Template {
  name: string;
  description: string;
  directory: string;
}

const templates: Template[] = [
  {
    name: "Recommended",
    description:
      "The recommended template using the swap router and tailwind with some boilerplate",
    directory: "recommended",
  },
  // {
  //   name: "Swap Rotuer Minimal",
  //   description: "A minimal template using the swap router",
  //   directory: "minimal",
  // },
  // {
  //   name: "Tailwind + Swap Router Minimal",
  //   description: "A template using the swap router and tailwind",
  //   directory: "tailwind",
  // },
];

export async function getInstructions(): Promise<Instructions> {
  console.log(
    "⚠ create-inkdocs is still under development. You'll only be able to use the recommended template for now.",
  );
  intro("Create a new inkdocs project");
  const instructions: Instructions = {
    directory: "inkdocs-project",
    template: templates[0],
  };

  const directory = await text({
    message: "Where should the project be created?",
    placeholder: "./inkdocs-project",
  });

  if (directory !== null) {
    instructions.directory = directory as string;
  }

  // check if directory exists
  // if it does, ask if it should be overwritten
  if (fs.existsSync(instructions.directory)) {
    const overwrite = await confirm({
      message: "The directory already exists. Do you want to overwrite it?",
    });
    if (isCancel(overwrite)) {
      cancel("Operation aborted");
      process.exit(0);
    }
  }

  const template = await select({
    message: "Which template would you like to use?",
    options: templates.map((template) => {
      return {
        value: template,
        label: template.name,
        hint: template.description,
      };
    }),
  });

  if (isCancel(template)) {
    cancel("Operation aborted");
    process.exit(0);
  }
  instructions.template = template as Template;

  return instructions;
}

function createProject(instructions: Instructions) {
  copyFiles(
    path.join(__dirname, "./templates", instructions.template.directory),
    instructions.directory,
  );

  process.chdir(instructions.directory);
  const s = spinner();
  s.start("Installing dependencies");
  Bun.spawnSync(["bun", "install"]);
  s.stop("Dependencies installed");

  outro("Project created!");
}

function copyFiles(from: string, to: string): void {
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
  // { recursive: true } doesn't work with bun, so we need our own function
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

const instructions = await getInstructions();
createProject(instructions);
