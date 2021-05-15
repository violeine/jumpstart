// init moai
import { AppProps } from "next/app";
import "@moai/core/dist/bundle.css";
import "@moai/core/dist/font/remote.css";
import "styles/globals.css";
function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}

export default MyApp;
