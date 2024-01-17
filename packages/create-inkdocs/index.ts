import { createSelection, createPrompt } from "bun-promptx";
import fs from "node:fs";

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
  {
    name: "Swap Rotuer Minimal",
    description: "A minimal template using the swap router",
    directory: "minimal",
  },
  {
    name: "Tailwind + Swap Router Minimal",
    description: "A template using the swap router and tailwind",
    directory: "tailwind",
  },
];

export function getInstructions(): Instructions {
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

const instructions = getInstructions();
console.log(instructions);
