import Head from "next/head";
import { Input, Button, InputSize } from "@moai/core";
import Light from "components/Light";
import { useRef, useState, useEffect, EffectCallback } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { hexToRGB } from "utils/colors";

interface payload extends Partial<Color> {
  brightness?: number;
}

interface Color {
  red: number;
  green: number;
  blue: number;
}

export default function Home({ host }: { host: string }): JSX.Element {
  const ws = useRef<null | WebSocket>(null);
  const connectWs: EffectCallback = () => {
    ws.current = new WebSocket(`ws://${host}:3001/ws`);
    ws.current.onclose = () => console.log("disconnected");
    ws.current.onopen = () => {
      console.log("connected");
      ws.current?.send("Reg:Web");
    };
    ws.current.onmessage = ({ data }) => {
      console.log(data);
      setMessage(data);
    };
    return () => ws.current?.close();
  };

  useEffect(connectWs, []);

  const [color, setColor] = useState<string>("#ffffff");
  const [brightness, setBrightness] = useState<number>(100);
  const [message, setMessage] = useState<string>("");

  function send(payload: payload): void {
    ws.current?.readyState === ws.current?.OPEN &&
      ws.current?.send(`Light:Color:${JSON.stringify(payload)}`);
  }
  useEffect(() => {
    send({ ...hexToRGB(color), brightness });
  }, [color, brightness]);
  return (
    <div className="sm:container mx-auto bg-gray-300 min-h-screen flex items-center justify-center">
      <Head>
        <title>Jump start</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <pre>{message}</pre>
      <Light ws={ws} message={message} />
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async function ({
  req,
}: GetServerSidePropsContext) {
  return {
    props: {
      host: req.headers.host?.split(":")[0],
    },
  };
};
