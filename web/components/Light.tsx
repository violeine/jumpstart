import { Button, Input } from "@moai/core";
import { useEffect, useState } from "react";
import { MutableRefObject, Ref } from "react";
import { hexToRGB, Color, RGBtoHex } from "utils/colors";
import { ChromePicker, ColorChangeHandler, ColorResult } from "react-color";
import { Window } from "./window";
Input.sizes.large = {
  ...Input.sizes.large,
  mainColor: "w-64 h-64",
};

interface Props {
  ws: MutableRefObject<WebSocket | null>;
  message: string;
}
interface payload extends Partial<Color> {
  brightness?: number;
}

export default function Light({ ws, message }: Props): JSX.Element {
  function send(payload: payload): void {
    ws.current?.readyState === ws.current?.OPEN &&
      ws.current?.send(
        `Light:Color:${JSON.stringify({ ...payload, cmd: "Light" })}`
      );
  }

  useEffect(() => {
    const [From, cmd, ...result] = message.split(":");
    if (From === "Light") {
      switch (cmd) {
        case "Res":
          setColor(RGBtoHex(JSON.parse(result?.join(":"))));
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

  const [color, setColor] = useState<string>("#ffffff");
  const [brightness, setBrightness] = useState<number>(100);
  const [alive, setAlive] = useState(false);
  useEffect(() => {
    send({ ...hexToRGB(color), brightness });
  }, [color, brightness]);
  const handleColorChange: ColorChangeHandler = (color: ColorResult) =>
    setColor(color.hex);
  return (
    <div className="flex flex-col">
      <Window name="light" alive={alive}>
        <div className="flex justify-between h-full space-x-2">
          <div>
            <ChromePicker
              color={color}
              disableAlpha
              onChange={handleColorChange}
            />
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="mb-8 bg-white p-2 shadow">
              <label className="flex items-center">
                <span className="mr-2 rounded"> Brightness:</span>
                <input
                  type="range"
                  name="brightness"
                  value={brightness}
                  max={255}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                />
              </label>
            </div>
            <Button onClick={() => ws.current?.send("Light:get")} highlight>
              get current color
            </Button>
          </div>
        </div>
      </Window>
    </div>
  );
}
