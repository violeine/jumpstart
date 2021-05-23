import { useState, useEffect } from "react";
import { Button } from "@moai/core";
import Fire from "./Fire";
import Rain from "./Rain";
import Light from "./Light";
import { Window } from "./window";
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
    <div className="w-full h-full p-16">
      <Window alive={alive} name="web">
        <div className=" h-32 p-2 flex justify-between items-center">
          <pre className="bg-gray-700 w-96 p-2 text-white rounded shadow-md">
            {message}
          </pre>
          <Button highlight onClick={checkHealth}>
            Check health
          </Button>
        </div>
        <div className="flex justify-between p-2 space-x-2 w-full">
          <Light ws={ws} message={message} />
          <div>
            <Fire ws={ws} message={message} />
          </div>
          <div>
            <Rain ws={ws} message={message} />
          </div>
        </div>
      </Window>
    </div>
  );
}
