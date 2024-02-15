import { InkdocsOptions } from "inkdocs";
import { serve } from "./fileserver";
import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { cors } from "@elysiajs/cors";
import { build } from "inkdocs/builder";
import path from "node:path";

// Design:
// 1. the inkdocs server serves all of the files in the build folder
// 2. client side javascript and a websocket connect

export async function startDevserver(options: InkdocsOptions) {
  const app = new Elysia();

  app.get("/client-javascript", () => {
    return Bun.file(path.join(__dirname, "client-javascript.js"));
  });
  app.get("/version", () => {
    return currentStatus;
  });

  app.listen(8008, () => {
    log("using port 8008 for the devserver");
  });

  let currentStatus = {
    version: 0,
    buildResult: "ONGOING",
  };

  let server: Elysia | undefined = undefined;

  app.use(html());
  app.use(cors());

  currentStatus = await restartServer(options, server, currentStatus.version);
}

interface Status {
  version: number;
  buildResult: "SUCCESS" | "FAILED" | "ONGOING";
}

function startServer(options: InkdocsOptions) {
  return serve(options);
}

async function stopServer(server: Elysia) {
  await server.stop();
}

async function restartServer(
  options: InkdocsOptions,
  server: Elysia | undefined,
  version: number,
): Promise<Status> {
  if (server !== undefined) {
    await stopServer(server);
  }

  // TODO: make build in inkdocs return whether it fails or not rather than throwing fatal errors
  build(options);

  // TODO: make this return a failed if it doens't work
  startServer(options);

  return Promise.resolve({
    version: version + 1,
    buildResult: "SUCCESS",
  });
}

function log(text: string) {
  console.log(`💻 \x1b[34mDEVSERVER: \x1b[0m${text}`);
}

function error(text: string) {
  console.error(`❌ \x1b[31;1m DEVSERVER: \x1b[31;0m ${text}`);
}
