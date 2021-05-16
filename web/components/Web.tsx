import { useState, useEffect } from "react";
import { Button } from "@moai/core";
import Props from "./props";

export default function Web({ ws, message }: Props): JSX.Element {
  const [alive, setAlive] = useState(false);
  useEffect(() => {
    const [For, cmd, ...rest] = message.split(":");
    if (For === "Web") {
      switch (cmd) {
        case "Alive":
          setAlive(true);
          break;
        case "Dead":
          setAlive(false);
          break;
      }
    }
  }, [message]);
  const checkHealth = () => {
    ws.current?.send("All:CheckHealth");
  };
  return (
    <div className="w-96 h-96">
      <pre>{message}</pre>
      <div
        className={`w-8 h-8 rounded-full ${
          alive ? "bg-green-300" : "bg-red-500"
        }`}
      ></div>
      <Button highlight onClick={checkHealth}>
        Check health
      </Button>
    </div>
  );
}
