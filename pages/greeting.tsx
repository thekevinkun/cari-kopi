import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { Box, Typography } from "@mui/material";

import { quotes } from "@/utils/quotes";
import { greetingVariants, textVariants } from "@/utils/motion";
import { getGreeting } from "@/utils/helpers";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const hasGreetingAccess = ctx.req.cookies.greeting_access;
  const token = ctx.req.cookies.token;

  if (!token || !hasGreetingAccess) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

const GreetingPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const [visible, setVisible] = useState(true);
  const isWelcome = router.query.welcome === "true";

  const name = user?.name?.split(" ")[0] || "friend";
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const greeting = isWelcome ? "Welcome" : getGreeting(new Date().getHours());
  const message = `${
    isWelcome
      ? "Let's find coffee?"
      : greeting === "Good Morning"
      ? "It's time for morning coffee."
      : greeting === "Good Afternoon"
      ? "Coffee for work?"
      : greeting === "Good Evening"
      ? "Coffee for stay up late?"
      : "How about a night coffee?"
  }`;

  const handleExitComplete = () => {
    router.replace("/");
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      Cookies.remove("greeting_access");
      localStorage.setItem("fromGreeting", "true");
      setVisible(false); // trigger exit animation
    }, 8000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <>
      <Head>
        <title>
          {greeting}, {name} | Carikopi
        </title>
        <meta name="description" content="Greeting user after login" />
      </Head>

      <AnimatePresence onExitComplete={handleExitComplete}>
        {visible && (
          <MotionBox
            variants={greetingVariants}
            initial="hidden"
            animate="show"
            exit="exit"
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
            }}
          >
            <MotionTypography
              variants={textVariants("up", 0.3)}
              initial="hidden"
              animate="show"
              variant="h3"
              fontWeight="bold"
              gutterBottom
            >
              {greeting}, {name}.
            </MotionTypography>

            <MotionTypography
              variants={textVariants("up", 0.8)}
              initial="hidden"
              animate="show"
              variant="h5"
              gutterBottom
            >
              {message}
            </MotionTypography>

            <MotionTypography
              variants={textVariants("", 1.3)}
              initial="hidden"
              animate="show"
              variant="body1"
              mt={4}
              fontStyle="italic"
            >
              “{quote}”
            </MotionTypography>

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
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
};

export default GreetingPage;
