import { useEffect, useState } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";

import { Box, Typography } from "@mui/material";

import { verifyToken } from "@/lib/db/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.req.cookies.token;

  const user = token ? verifyToken(token) : null;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

const Logout = () => {
  const router = useRouter();
  const { user, refreshUser } = useUser();

  const [displayName, setDisplayName] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (user?.name) {
      const name = user.name.split(" ")[0];
      setDisplayName(name);
      setVisible(true);
    }
  }, [user]);

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
        });

        setTimeout(() => {
          setVisible(false); // triggers fade-out
          setTimeout(async () => {
            await refreshUser();
            router.push("/login");
          }, 500); // fade duration
        }, 5000);
      } catch (err) {
        console.error("Logout failed", err);
      }
    };

    if (user) logout();
  }, [user, router]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>Log out | Carikopi</title>
        <meta name="description" content="Log out user" />
      </Head>

      <Box
        sx={{
          width: "100vw",
          height: "100%",
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at center, #6e3c1b, #2e1a10)",
          backgroundSize: "200% 200%",
          animation: "pulseGlow 3s ease-in-out infinite",
          color: "white",
          textAlign: "center",
          px: 3,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        {displayName && (
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            See you later, {displayName}...
          </Typography>
        )}

        <style jsx global>{`
          @keyframes pulseGlow {
            0%,
            100% {
              background-position: 50% 50%;
              filter: brightness(1);
            }
            50% {
              background-position: 55% 55%;
              filter: brightness(1.15);
            }
          }
        `}</style>
      </Box>
    </>
  );
};

export default Logout;
