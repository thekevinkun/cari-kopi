import "leaflet/dist/leaflet.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { CssBaseline } from "@mui/material";

import { Navbar } from "@/components";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
     <Head>
        <title>Carikopi</title>
        <meta name="description" content="Find the best coffee shops nearby." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CssBaseline />
      <Navbar />
      <Component {...pageProps} />
    </>
  )
}

export default App;
