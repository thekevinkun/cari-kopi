import "leaflet/dist/leaflet.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { CssBaseline } from "@mui/material";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
     <Head>
        <title>Coffee Shop Finder</title>
        <meta name="description" content="Find the best coffee shops nearby." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  )
}

export default App;
