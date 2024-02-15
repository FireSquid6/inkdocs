import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { cors } from "@elysiajs/cors";
import path from "node:path";
import "@kitajs/html/register";

const app = new Elysia();

app.use(html());
app.use(cors());

app.get("/client-javascript", () => {
  return Bun.file(path.join(__dirname, "client-javascript.js"));
});

app.get("/", () => {
  return (
    <html>
      <head>
        <script src="/client-javascript"></script>
      </head>
      <body>
        <p>Hello world!</p>
      </body>
    </html>
  );
});

app.listen(8008, () => {
  console.log("using port 8008 for the devserver");
});
