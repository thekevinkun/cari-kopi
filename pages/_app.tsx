import "@/styles/utilities.css";
import "leaflet/dist/leaflet.css";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext"; 
import Head from "next/head";
import { CssBaseline } from "@mui/material";

import { UserProvider } from "@/contexts";
import { Navbar } from "@/components";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  
  const hideNavbarOn = ["/login", "/register", "/verify"];
  const hideNavbar = hideNavbarOn.includes(router.pathname) || router.pathname.startsWith("/verify");

  return (
    <>
     <Head>
        <title>Carikopi</title>
        <meta name="description" content="Find the best coffee shops nearby." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CssBaseline />
      <UserProvider>
        {!hideNavbar && <Navbar />}
        <Component {...pageProps} />
      </UserProvider> 
    </>
  )
}

export default App;
