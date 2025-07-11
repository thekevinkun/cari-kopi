import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useUser } from "@/contexts/UserContext";
import { useAlert } from "@/contexts/AlertContext";

import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { findUserByEmail } from "@/lib/db/user";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = ctx.query.email;
  const cookieEmail = ctx.req.cookies.verify_email;

  // No email? or doesn't match cookie → redirect
  if (!email || email !== cookieEmail) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const user = await findUserByEmail(email);

  if (
    !user ||
    user.verified ||
    !user.verificationCode ||
    !user.verificationExpires ||
    new Date(user.verificationExpires) < new Date()
  ) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { email },
  };
};

const VerifyPage = ({ email }: { email: string }) => {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const { showAlert } = useAlert();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [resendTimer, setResendTimer] = useState(60);
  const [resending, setResending] = useState(false);

  const inputs: HTMLInputElement[] = [];

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleInput = (value: string, idx: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);

    if (value && idx < 5) {
      inputs[idx + 1].focus();
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        showAlert(
          data.error ||
            "Something went wrong. Failed to resent verification code.",
          "error"
        );
      } else {
        showAlert("Verification code resent to your email.", "success");
        setCode(["", "", "", "", "", ""]);
        setResendTimer(60); // Restart timer
      }
    } catch (error) {
      console.error(error);
      showAlert(
        "Something went wrong. Failed to resent verification code.",
        "error"
      );
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    if (!email) {
      setError("Missing email");
      return;
    }

    const codeStr = code.join("");
    if (codeStr.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: codeStr }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data.error);
        showAlert(
          data.error ||
            "Something went wrong. Failed to verified your account.",
          "error"
        );
      } else {
        showAlert(data.message, "success");

        await refreshUser();

        Cookies.remove("verify_email");
        Cookies.set("greeting_access", "true", { expires: 1 / 92 });

        setTimeout(() => {
          router.push("/greeting?welcome=true");
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      showAlert(
        "Something went wrong. Failed to verified your account.",
        "error"
      );
    }
  };

  const checkButtonAction = () => {
    if (code[0] === "") return false;

    return true;
  };

  if (user) return null;

  return (
    <>
      <Head>
        <title>Verify Email | Carikopi</title>
        <meta name="description" content="Verify your Carikopi account" />
      </Head>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          px: 2,
          bgcolor: "#f5f5f5",
          height: "100%",
          minHeight: "100svh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            background: "#804A26",
            color: "#fff",
            maxWidth: 420,
            width: "100%",
            p: 4,
          }}
        >
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Verify Your Email
          </Typography>

          <Typography variant="body2" textAlign="center" mb={3}>
            We sent a 6-digit code to your email
            <br />
            <span style={{ fontWeight: "bold" }}>{email}</span>
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Stack direction="row" justifyContent="center" spacing={1} mb={2}>
            {code.map((digit, idx) => (
              <TextField
                key={idx}
                autoComplete="off"
                value={digit}
                inputRef={(el) => {
                  if (el) inputs[idx] = el;
                }}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "1.5rem",
                    width: "45px",
                    height: "50px",
                  },
                }}
                onChange={(e) => {
                  if (error) setError("");
                  if (message) setMessage("");
                  handleInput(e.target.value, idx);
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
            ))}
          </Stack>

          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: "#ddd",
              },
              color: "#111",
              opacity: !checkButtonAction() ? 0.4 : 1,
              pointerEvents: !checkButtonAction() ? "none" : "auto",
            }}
            onClick={handleVerify}
          >
            Verify Code
          </Button>

          <Box mt={2} textAlign="center">
            {resendTimer > 0 ? (
              <Typography variant="body2" sx={{ color: "#ddd" }}>
                Resend code in {resendTimer}s
              </Typography>
            ) : (
              <Button
                size="small"
                variant="text"
                onClick={handleResend}
                disabled={resending}
                sx={{
                  color: "#fff",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {resending ? "Resending..." : "Resend Code?"}
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default VerifyPage;
