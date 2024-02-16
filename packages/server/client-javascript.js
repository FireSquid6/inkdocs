async function main() {
  const socket = new WebSocket("ws://localhost:8008");
  socket.onopen = () => {
    console.log("Connected to server");
    socket.send("status");
  };

  socket.onmessage = (event) => {
    console.log("Message from server ", event.data);
  };
}
main();
