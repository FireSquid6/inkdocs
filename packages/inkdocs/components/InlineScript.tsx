import fs from "fs";

export default function InlineScript(props: {
  srcPath: string;
  defer?: boolean;
}) {
  const src = fs.readFileSync(props.srcPath, "utf-8");
  return <script defer={props.defer}>{src}</script>;
}
