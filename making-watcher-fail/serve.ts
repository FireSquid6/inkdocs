import { Elysia } from "elysia";

const app = new Elysia();
app.get("/", () => {
  return "Hello world!";
});
app.listen(8008, () => {
  console.log("listening on port 8008");
});
