let version = 0;

setInterval(async () => {
  const response = await fetch("http://localhost:8008/version", {
    mode: "no-cors",
    crossorigin: true,
    cache: "no-store",
  });
  console.log(response);
}, 1000);
