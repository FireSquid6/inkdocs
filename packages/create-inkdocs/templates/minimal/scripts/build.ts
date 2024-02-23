import { build } from "inkdocs/builder";
import options from "../inkdocs";

const result = build(options);

if (result === "success") {
  process.exit(0);
}

process.exit(1);
