import Elysia from "elysia";
import path from "path";

const app = new Elysia();

let version = 0;
app.get("/client-javascript", () => {
  return Bun.file(path.join(__dirname, "client-javascript.js"));
});
app.get("/version", () => {
  return {
    version: version,
  };
});

app.listen(8008);
