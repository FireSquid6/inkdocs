async function main() {
  const socket = new WebSocket("ws://localhost:8008");
  socket.onopen = () => {
    console.log("Connected to server");
    socket.send("status");
  };

  socket.onmessage = (event) => {
    if (event.data === "success") {
      window.location.reload();
    }
  };
}
main();
