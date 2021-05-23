import { useState, useEffect, useMemo, CSSProperties } from "react";
import { Button, DivEm } from "@moai/core";
import { Window } from "./window";
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
    <div>
      <Window name="Fire" alive={alive}>
        <div className="flex w-full space-x-2">
          <WindowPane name="Object" value={object || 32} />
          <WindowPane name="Ambient" value={ambient || 32} />
        </div>
        <div className="flex justify-center mt-2">
          <Button highlight onClick={getTemp}>
            get temp
          </Button>
        </div>
      </Window>
    </div>
  );
}

const WindowPane = ({
  name,
  value,
}: {
  name: string;
  value: number;
}): JSX.Element => {
  const CtoF = (a: number): number => (a * 9) / 5 + 32;

  const hue = (temp: number): number => 200 + 160 * (temp / 100);
  console.log(hue(CtoF(value)));
  return (
    <div
      className="w-32 h-32 shadow flex flex-col items-center p-2 relative"
      style={{ color: `hsla(${hue(CtoF(value))}, 100%, 50%, 0.7)` }}
    >
      <span className="font-light text-lg text-black">{name}</span>
      <span className="text-3xl font-semibold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {value}&deg;C
      </span>
    </div>
  );
};
