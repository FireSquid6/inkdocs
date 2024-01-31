async function main() {
  const [version] = await getStatus();

  const displayElement = document.getElementById("devserver-version-display");
  if (displayElement) {
    displayElement.innerText = version;
  } else {
    console.log(
      "DEVSERVER: did not find version display element. This is fine unless you are developing the devserver itself.",
    );
  }

  setInterval(async () => {
    const [newVersion, failed] = await getStatus();

    if (failed) {
      console.log("build failure");
      document.body.innerHTML = `<div style="font-family: sans-serif; font-size: 24px; color: red; background-color: white; padding: 32px; text-align: center;">Build failed. Check your console for more information.</div>`;
      return;
    }

    if (newVersion !== version) {
      window.location.reload();
    }
  }, 1000);
}

async function getStatus() {
  const response = await fetch("http://localhost:8008/version", {
    cache: "no-store",
    mode: "cors",
    credentials: "include",
    header: {
      "Content-Type": "application/json",
    },
  });
  const body = await response.json();
  return [body.version, body.failed];
}
main();
