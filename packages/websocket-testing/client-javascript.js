console.log("Hello from client javascript");

function sendData() {
  const socket = new WebSocket("ws://localhost:3000");
  socket.addEventListener("open", () => {
    console.log("Connected to server");
    socket.send("Hello from client");
  });
}

sendData();
