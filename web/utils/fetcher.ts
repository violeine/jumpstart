type route = "array" | "stop" | "weather";

export function post(host: string, pl: string, route: route) {
  fetch(`http://${host}:3001/${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: pl,
  });
}
