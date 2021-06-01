const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:3001/ws");

ws.on("message", function (data) {
  const [For, cmd, ...rest] = data.split(":");
  if (For === "Rain") {
    console.log(data);
    if (cmd === "isRain?") {
      if (rest[0] === "yes") {
        ledRain();
      } else ledNoRain();
    }
  }
});

ws.on("open", () => {
  console.log("connectted");
});

ws.on("error", (err) => console.log(err));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const black = {
  red: 0,
  green: 0,
  blue: 0,
  cmd: "Rain",
};
async function ledRain() {
  const color = {
    red: 59,
    green: 130,
    blue: 246,
    cmd: "Rain",
  };
  for (let i = 0; i < 3000; i += 1000) {
    ws.send(`Light:Color:${JSON.stringify(color)}`);
    ws.send(`Light:Color:${JSON.stringify(black)}`);
    await sleep(300);
  }
}
function ledNoRain() {
  const color = {
    red: 251,
    green: 191,
    blue: 36,
    cmd: "Rain",
  };
  ws.send(`Light:Color:${JSON.stringify(color)}`);
}
// ledRain();
process.on("SIGINT", function () {
  console.log("Caught interrupt signal");
  ws?.send(`Light:Color:${JSON.stringify(black)}`);
  process.exit();
});
