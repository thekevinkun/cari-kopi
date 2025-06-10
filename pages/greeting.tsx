import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { useUser } from "@/contexts/UserContext";

import { verifyToken } from "@/lib/auth";
import { quotes } from "@/utils/quotes";
import { greetingVariants, textVariants } from "@/utils/motion";
import { getGreeting } from "@/utils/helpers";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookieLogin = ctx.req.cookies.login_email;

  if (!cookieLogin) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

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
}

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

const GreetingPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const [visible, setVisible] = useState(true);
  const isWelcome = router.query.welcome === "true";

  const name = user?.username?.split(" ")[0] || "friend";
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const greeting = isWelcome ? "Welcome" : getGreeting(new Date().getHours());
  const message = `${isWelcome ? "Let's find coffee?" 
              : greeting === "Good Morning"
              ? "It's time for morning coffee."
              : greeting === "Good Afternoon"
              ? "Coffee for work?"
              : greeting === "Good Evening"
              ? "Evening coffee time?" 
              : "How about a night coffee?"}`

  const handleExitComplete = () => {
    router.push("/");
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false); // trigger exit animation
    }, 8000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
        {visible && (
            <MotionBox
                variants={greetingVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                sx={{
                    height: "100vh",
                    width: "100%",
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
                        0%, 100% {
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
  )
}

export default GreetingPage;