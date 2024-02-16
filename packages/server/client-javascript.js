async function main() {
  const socket = new WebSocket("ws://localhost:3000");
  socket.addEventListener("open", () => {
    console.log("Connected to server");

    socket.send("give me stuff");
    socket.on("message", (data) => {
      console.log(data);
    });
  });
}
main();
