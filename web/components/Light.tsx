import { Button, Input } from "@moai/core";
import { useEffect, useState } from "react";
import { MutableRefObject, Ref } from "react";
import { hexToRGB, Color, RGBtoHex } from "utils/colors";

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
      ws.current?.send(`Light:Color:${JSON.stringify(payload)}`);
  }

  useEffect(() => {
    const [From, cmd, ...result] = message.split(":");
    if (From == "Light" && cmd == "Res") {
      setColor(RGBtoHex(JSON.parse(result?.join(":"))));
    }
  }, [message]);

  useEffect(() => {
    ws.current?.send("Light:get");
  }, [ws.current]);

  const [color, setColor] = useState<string>("#ffffff");
  const [brightness, setBrightness] = useState<number>(100);
  useEffect(() => {
    send({ ...hexToRGB(color), brightness });
  }, [color, brightness]);
  return (
    <div className="flex w-full justify-around items-center">
      <Button onClick={() => ws.current?.send("Light:get")} highlight>
        get current color
      </Button>
      <div>
        <Input
          type="color"
          value={color}
          setValue={(e) => setColor(e)}
          style={Input.styles.flat}
          size={Input.sizes.large}
        />
      </div>
      <div>
        <input
          type="range"
          name="brightness"
          value={brightness}
          max={255}
          onChange={(e) => setBrightness(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
