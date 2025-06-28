import "leaflet/dist/leaflet.css";

import { useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";
import Head from "next/head";
import { CssBaseline } from "@mui/material";

import { AlertProvider, LocationProvider, UserProvider } from "@/contexts";
import { Navbar } from "@/components";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { user } = useUser();

  const hideNavbarOn = [
    "/login",
    "/register",
    "/verify",
    "/greeting",
    "/forgot",
    "/reset",
    "/logout",
  ];
  const hideNavbar =
    hideNavbarOn.includes(router.pathname) ||
    router.pathname.startsWith("/verify") ||
    router.pathname.startsWith("/reset");

  useEffect(() => {
    if (user && typeof window !== "undefined") {
      router.replace("/");
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Carikopi</title>
        <meta name="description" content="Find the best coffee shops nearby." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CssBaseline />
      <AlertProvider>
        <UserProvider>
          <LocationProvider>
            {!hideNavbar && <Navbar />}
            <Component {...pageProps} />
          </LocationProvider>
        </UserProvider>
      </AlertProvider>
    </>
  );
};

export default App;
