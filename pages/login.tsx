import { useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useUser } from "@/contexts/UserContext";
import { Alert, Box, Button, Checkbox, FormControlLabel, 
  Divider, FormLabel, FormControl, 
  Link as MUILink, TextField, Typography } from "@mui/material";
  
import { AuthContainer, AuthCard } from "@/components";

import { verifyToken } from "@/lib/db/auth";
import { inFifteenMinutes } from "@/utils/helpers";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.req.cookies.token;

  const user = token ? verifyToken(token) : null;

  if (user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

const Login = () => {
  const router = useRouter();
  const { refreshUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await res.json();

      const expiresMinute = inFifteenMinutes();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        await refreshUser();
        Cookies.set("login_email", email, { expires: expiresMinute });
        router.push("/greeting");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Log in | Carikopi</title>
        <meta name="description" content="Login to your Carikopi account" />
      </Head>
    
      <AuthContainer direction="column" justifyContent="space-between">
        <AuthCard variant="outlined">
          <Typography
              component="h1"
              variant="h4"
              sx={{ width: "100%", fontSize: "clamp(1.5rem, 10vw, 2rem)", }}
            >
            Carikopi
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email" sx={{ color: "#fff" }}>Email</FormLabel>

              <TextField
                id="email"
                type="name"
                name="email"
                placeholder="Email"
                autoComplete="off"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color="primary"
                value={email}
                onChange={(e) => {
                  if (error) setError("");
                  setEmail(e.target.value);
                }}
                onBlur={(e) => setEmail(e.target.value.toLowerCase())}
                sx={{
                  mt: 1,
                  "& .MuiInputBase-root": {
                    color: "#fff",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ddd",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#fff",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#fff",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ccc", // default
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff", // on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff", // on focus
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#fff",
                    "&.Mui-focused": {
                      color: "#fff",
                    },
                  },
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password" sx={{ color: "#fff" }}>Password</FormLabel>

              <TextField
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color="primary"
                value={password}
                onChange={(e) => {
                  if (error) setError("");
                  setPassword(e.target.value);
                }}
                sx={{
                  mt: 1,
                  "& .MuiInputBase-root": {
                    color: "#fff",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ddd",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#fff",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#fff",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ccc", // default
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff", // on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff", // on focus
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#fff",
                    "&.Mui-focused": {
                      color: "#fff",
                    },
                  },
                }}
              />
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox 
                  value="remember" 
                  color="primary" 
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  sx={{
                    color: "#fff",
                  }}
                />
              }
              label="Remember me"
              sx={{
                width: "fit-content",
                borderColor: "#fff"
              }}
            />

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}
          
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#ddd",
                },
                color: "#111",
              }}
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>

            <MUILink
              component="button"
              type="button"
              onClick={() => {}}
              variant="body2"
              sx={{ 
                alignSelf: "center",
                color: "#fff", 
                textDecoration: "none", 
                "&:hover": {
                  textDecoration: "underline",
                }
              }}
            >
              Forgot your password?
            </MUILink>
          </Box>

          <Divider 
            sx={{ 
              borderColor: "#fff",
              color: "#fff",
              "&::before, &::after": {
                borderColor: "#fff"
              }
            }}
          >
            or
          </Divider>

          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <MUILink
              href="/register"
              variant="body2"
              sx={{ 
                alignSelf: "center",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline"
                }
              }}
            >
              Create
            </MUILink>
          </Typography>
        </AuthCard>
      </AuthContainer>
    </>
  );
}

export default Login;