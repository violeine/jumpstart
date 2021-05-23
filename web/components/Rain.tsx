import { useState, useEffect } from "react";
import { Button } from "@moai/core";
import { Window } from "./window";
import { WiDayCloudy, WiDayRain } from "./icons";
import Props from "./props";

export default function Rain({ ws, message }: Props): JSX.Element {
  const [alive, setAlive] = useState(false);
  const [rain, setRain] = useState(false);
  useEffect(() => {
    const [For, cmd, ...rest] = message.split(":");
    if (For === "Rain" || For === "Fire") {
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
    <div>
      <Window name="Rain" alive={alive}>
        <div
          className={`w-96 h-48 m-4 flex justify-center items-center ${
            rain ? "text-blue-500" : "text-yellow-400 "
          }`}
        >
          {rain ? (
            <WiDayRain width="128" height="96" />
          ) : (
            <WiDayCloudy width="128" height="96" />
          )}
        </div>
        <div className="flex justify-center">
          <Button style={Button.styles.flat} highlight onClick={getTemp}>
            get Rain
          </Button>
        </div>
      </Window>
    </div>
  );
}
