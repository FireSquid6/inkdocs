#!/usr/bin/env bun
import { createSelection, createPrompt } from "bun-promptx";
import fs from "node:fs";
import path from "node:path";

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

export function getInstructions(): Instructions {
  console.log(
    "⚠ create-inkdocs is still under development. You'll only be able to use the recommended template for now.",
  );
  const instructions: Instructions = {
    directory: "inkdocs-project",
    template: templates[0],
  };

  const { value } = createPrompt("Project Directory: ");

  if (value !== null) {
    instructions.directory = value;
  }

  // check if directory exists
  // if it does, ask if it should be overwritten
  if (fs.existsSync(instructions.directory)) {
    const { value } = createPrompt(
      "Directory already exists. Overwrite conflicting files? (y/n): ",
    );
    if (value !== "y") {
      process.exit(0);
    }
  }

  const selections = [];
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    selections.push({
      text: template.name,
      description: template.description,
    });
  }

  const result = createSelection(selections, {
    headerText: "Select a template: ",
    perPage: 5,
  });

  if (result.error === null && result.selectedIndex !== null) {
    instructions.template = templates[result.selectedIndex];
  }

  return instructions;
}

function createProject(instructions: Instructions) {
  copyFiles(
    path.join(__dirname, "../templates", instructions.template.directory),
    instructions.directory,
  );
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

const instructions = getInstructions();
createProject(instructions);
console.log(instructions);
