import { useState, useEffect } from "react";
import { Button } from "@moai/core";
import Props from "./props";

export default function Rain({ ws, message }: Props): JSX.Element {
  const [alive, setAlive] = useState(false);
  const [rain, setRain] = useState(false);
  useEffect(() => {
    const [For, cmd, ...rest] = message.split(":");
    if (For === "Rain") {
      switch (cmd) {
        case "isRain?":
          setRain(rest[0] === "yes");
          break;
        case "Alive":
          setAlive(true);
          break;
        case "Dead":
          setAlive(false);
          break;
      }
    }
  }, [message]);
  const getTemp = () => {
    ws.current?.send("Rain:get");
  };
  return (
    <div className="w-96 h-96">
      <div
        className={`w-8 h-8 rounded-full ${
          alive ? "bg-green-300" : "bg-red-500"
        }`}
      ></div>
      <div
        className={`w-16 h-16 ${rain ? "bg-blue-500" : "bg-pink-400"}`}
      ></div>
      <Button highlight onClick={getTemp}>
        get Rain
      </Button>
    </div>
  );
}
