import { useState } from "react";
import Head from "next/head";

import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";

import { validateEmailFormat } from "@/lib/db/validation";

const checkEmailAvailable = async (email: string) => {
  const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
  const data = await res.json();
  return data.available;
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
    
  const checkButtonAction = () => {
    if (email === "") 
      return false;

    return true;
  };

  const handleSendLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check email 
    if (!email) {
        setErrorMessage("Email is required");
        return;
    };

    const formatEmail = validateEmailFormat(email);
    if (formatEmail) {
        setErrorMessage(formatEmail);
        return;
    }

    const emailAvailable = await checkEmailAvailable(email);
    if (emailAvailable) {
        setErrorMessage("Sorry, can't find your account");
        return;
    };

    setLoading(true);

    try {
        const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok) {
            setErrorMessage(data.error || "Failed to send a link to your email.");
        } else {
            setMessage(data.message);
        }
    } catch (err) {
        setErrorMessage("Something went wrong. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
        <Head>
            <title>Forgot Password | Carikopi</title>
            <meta name="description" content="Recover password your Carikopi account" />
        </Head>
        
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
            px={2}
        >
            <Paper elevation={3} sx={{ background: "#804A26", color: "#fff", maxWidth: 420, width: "100%", p: 4 }}>
                <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
                    Trouble logging in?
                </Typography>

                <Typography
                    variant="body2"
                    textAlign="center"
                    mb={3}
                >
                    Enter your email and we'll send you a link to get back into your account.
                </Typography>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                {message && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {message}
                    </Alert>
                )}

                <Stack direction="column" justifyContent="center" spacing={1} mb={2}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        placeholder="Email"
                        name="email"
                        autoComplete="off"
                        variant="outlined"
                        value={email}
                        onChange={(e) => {
                            if (e.target.value == "") setErrorMessage("");
                            setEmail(e.target.value);
                        }}
                        onBlur={(e) => setEmail(e.target.value.toLowerCase())}
                        disabled={!!message}
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
                </Stack>
                
                <Button
                    fullWidth
                    variant="contained"
                    disabled={loading || !!message}
                    sx={{
                        backgroundColor: "#fff",
                        "&:hover": {
                            backgroundColor: "#ddd",
                        },
                        color: "#111",
                        opacity: !checkButtonAction() ? 0.4 : 1,
                        pointerEvents: !checkButtonAction() ? "none" : "auto",
                    }}
                    onClick={handleSendLogin}
                >
                    {loading ? "Sending..." : "Send reset link"}
                </Button>
            </Paper>
        </Box>
    </>
  )
}

export default ForgotPassword;