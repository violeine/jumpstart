const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:3001/ws");

ws.on("message", function (data) {
  const [For, cmd, ...rest] = data.split(":");
  if (For === "Fire") {
    console.log(data);
    if (cmd === "Object") {
      if (rest[0] > 40) {
        ledFire();
      } else ledNoFire();
    }
  }
});

ws.on("open", () => {
  console.log("connected");
});

ws.on("error", (err) => console.log(err));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const black = {
  red: 0,
  green: 0,
  blue: 0,
  cmd: "Fire",
};
async function ledFire() {
  const color = {
    red: 255,
    green: 0,
    blue: 0,
    cmd: "Fire",
  };
  for (let i = 0; i < 3000; i += 500) {
    ws.send(`Light:Color:${JSON.stringify(black)}`);
    await sleep(300);
    ws.send(`Light:Color:${JSON.stringify(color)}`);
  }
}
function ledNoFire() {
  const color = {
    red: 59,
    green: 130,
    blue: 246,
    cmd: "Fire",
  };
  ws.send(`Light:Color:${JSON.stringify(color)}`);
}
process.on("SIGINT", function () {
  console.log("Caught interrupt signal");
  ws?.send(`Light:Color:${JSON.stringify(black)}`);
  process.exit();
});
