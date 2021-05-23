// init moai
import { AppProps } from "next/app";
import "styles/globals.css";
import "@moai/core/dist/bundle.css";
import "@moai/core/dist/font/remote.css";
function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}

export default MyApp;
