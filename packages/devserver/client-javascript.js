async function main() {
  const version = await getServerVersion();
  try {
    document.getElementById("devserver-version-display").innerText = version;
  } catch (e) {
    console.log(
      "DEVSERVER: did not find version display element. This is fine unless you are developing the devserver itself.",
    );
  }

  setInterval(async () => {
    const newVersion = await getServerVersion();
    if (newVersion !== version) {
      window.location.reload();
    }
  }, 1000);
}

async function getServerVersion() {
  const response = await fetch("http://localhost:8008/version", {
    mode: "no-cors",
    crossorigin: true,
    cache: "no-store",
  });
  const body = await response.json();
  return body.version;
}
main();
