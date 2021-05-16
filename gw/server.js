var http = require("http");
var WebSocket = require("ws");
var express = require("express");
var app = express();
var { exec, execSync } = require("child_process");
var cors = require("cors");
var chroma = require("chroma-js");
// function gửi yêu cầu(response) từ phía server hoặc nhận yêu cầu (request) của client gửi lên
// create http server
var server = http.createServer(app);
var ws = new WebSocket.Server({
  server,
  path: "/ws",
});

var pid;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send(`<h1> hello world </h1>`);
});

app.post("/array", (req, res) => {
  const gradient = chroma.scale(req.body).colors(400);
  pid = exec(`node client.js -A ${JSON.stringify(gradient)}`).pid;
  res.send("ok");
});

app.post("/stop", (req, res) => {
  console.log(req.body, pid);
  res.send("ok");
  if (pid) {
    execSync(`kill -9 ${pid + 1}`);
    pid = undefined;
  }
  exec(
    `node client.js -S "${req.body.color}" -B ${req.body.brightness}`,
    (err, out, stderr) => {
      console.log(err);
    }
  );
});
const clients = {};
app.get("/clients", (_, res) => res.send(JSON.stringify(clients)));
app.post("/weather", (req, res) => {
  res.send("ok");
  if (pid) {
    execSync(`kill -9 ${pid + 1}`);
    pid = undefined;
  }
  console.log(req.body.location);
  exec(`bash weather.sh ${req.body.location}`);
});

function broadcast(ws, message) {
  ws.clients.forEach((c) => c.send(message));
}

function heartbeat() {
  this.isAlive = true;
  clients["Web"]?.send(`${this.job}:Alive`);
}

function ping() {
  [...Object.entries(clients)].forEach(([job, s]) => {
    if (s.isAlive === false) {
      clients["Web"]?.send(`${job}:Dead`);
    }
    s.isAlive = false;
    s.ping(() => {});
  });
}

ws.on("connection", function (socket, req) {
  socket.ip = req.socket.remoteAddress;
  socket.isAlive = true;

  socket.on("pong", heartbeat);

  socket.on("message", function (message) {
    if (message.startsWith("Reg:")) {
      const job = message.split(":")[1];
      clients[job] = socket;
      socket.job = job;
      if (job === "Web") {
        ping();
        clients["Light"]?.send("get");
      }
      clients["Web"]?.send(
        `Job ${job} was register to ${req.socket.remoteAddress}`
      );
      console.log(`Job ${job} was register to ${req.socket.remoteAddress}`);
    }
    const [For, cmd, ...rest] = message.split(":");

    if (For === "All") {
      if (cmd === "CheckHealth") {
        ping();
      }
    }

    if (For === "Light") {
      if (cmd == "get") {
        clients[For]?.send("get");
      }

      if (cmd == "Color") {
        clients[For]?.send(rest.join(":"));
      }

      if (cmd == "Res") {
        clients["Web"]?.send(message);
      }
    }

    if (For === "Fire") {
      switch (cmd) {
        case "Object":
          clients["Web"]?.send(message);
          break;
        case "Ambient":
          clients["Web"]?.send(message);
          break;
        case "get":
          clients[For]?.send("get-temp");
          break;
      }
    }

    if (For === "Rain") {
      switch (cmd) {
        case "isRain?":
          clients["Web"]?.send(message);
          break;
        case "get":
          clients[For]?.send("get-rain");
          break;
      }
    }
    // broadcast(ws, message);
  });
});

const interval = setInterval(ping, 30 * 1000);
ws.on("close", function () {
  clearInterval(interval);
});
server.listen(3001);
console.log("Server listening on port 3001");
