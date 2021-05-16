import { MutableRefObject } from "react";
export default interface Props {
  ws: MutableRefObject<WebSocket | null>;
  message: string;
}
