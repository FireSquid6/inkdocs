import { build } from "inkdocs/builder";
import options from "..";

const result = build(options);

if (result === "success") {
  console.log("✅ Pages successfully built!");
  process.exit(0);
}

console.error(result);
process.exit(1);
