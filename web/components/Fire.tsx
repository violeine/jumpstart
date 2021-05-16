import { useState, useEffect } from "react";
import { Button } from "@moai/core";
import Props from "./props";

export default function Fire({ ws, message }: Props): JSX.Element {
  const [alive, setAlive] = useState(false);
  const [ambient, setAmbient] = useState<number>();
  const [object, setObject] = useState<number>();
  useEffect(() => {
    const [For, cmd, ...rest] = message.split(":");
    if (For === "Fire") {
      switch (cmd) {
        case "Ambient":
          setAmbient(Number(rest[0]));
          break;
        case "Object":
          setObject(Number(rest[0]));
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
    ws.current?.send("Fire:get");
  };
  return (
    <div className="w-96 h-96">
      <pre>{message}</pre>
      <div
        className={`w-8 h-8 rounded-full ${
          alive ? "bg-green-300" : "bg-red-500"
        }`}
      ></div>
      <div>
        Object <span>{object}</span>
      </div>
      <div>
        Ambient <span>{ambient}</span>
      </div>
      <Button highlight onClick={getTemp}>
        get temp
      </Button>
    </div>
  );
}
