import fs from "fs";

// allows you to include a script in the page
export default function InlineScript(props: {
  srcPath: string;
  defer?: boolean;
}) {
  const src = fs.readFileSync(props.srcPath, "utf-8");
  return <script defer={props.defer}>{src}</script>;
}
