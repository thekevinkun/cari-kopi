import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAlert } from "@/contexts/AlertContext";

import { Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";

import { findUserByResetToken } from "@/lib/db/user";
import { validatePassword } from "@/lib/db/validation";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.query.token as string;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const user = await findUserByResetToken(token);

  if (!user 
      || !user.resetToken 
      || !user.resetTokenExpires
      || new Date(user.resetTokenExpires) < new Date()) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } 

  return {
    props: { token },
  };
}

const ResetPassword = ({ token }: { token: string }) => {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
  const checkButtonAction = () => {
    if (password === "" || confirmPassword === "") 
      return false;

    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {    
    e.preventDefault();
    
    const newErrors: typeof errors = {};

    if (!token) {
        showAlert("Invalid token", "error");
        return;
    }

    // Check password and confirm password
    if (!password) newErrors.password = "Password is required";

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (password !== confirmPassword) newErrors.confirm = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password, confirmPassword }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error(data.error);
            showAlert(data.error || "Something went wrong. Failed to reset your password. Please try again later.", "error");
        } else {
            showAlert(data.message, "success");

            setTimeout(() => {
                router.replace("/login");
            }, 1000);
        }
    } catch (error) {
        console.error(error);
        showAlert("Something went wrong. Failed to reset your password. Please try again later.", "error");
    } finally {
        setLoading(false);
    }
  }

  // Live password check
  useEffect(() => {
    if (password === "") {
        if (errorMessage && confirmPassword === "") {
            setErrorMessage("");
        }

        setErrors((prev) => ({
          ...prev,
          password: "",
        }));
  
        return;
    }
  
    const delayDebounce = setTimeout(async () => {
        const passwordError = validatePassword(password);
        setErrors((prev) => ({
          ...prev,
          password: passwordError ? passwordError : "",
        }));
    }, 500);
  
    return () => clearTimeout(delayDebounce);
  }, [password]);
  
  // Live confirm password check
  useEffect(() => {
    if (confirmPassword === "") {
        if (errorMessage && password === "") {
            setErrorMessage("");
        }

        setErrors((prev) => ({
          ...prev,
          confirm: "",
        }));
        
        return;
    }
  
    const delayDebounce = setTimeout(async () => {
        setErrors((prev) => ({
          ...prev,
          confirm: confirmPassword !== password ? "Passwords do not match" : "",
        }));
      }, 500);
  
    return () => clearTimeout(delayDebounce);
  }, [confirmPassword]);

  if (!token) return null;

  return (
    <>
        <Head>
            <title>Reset Password | Carikopi</title>
            <meta name="description" content="Reset password of your Carikopi account" />
        </Head>
        
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
                px: 2,
                bgcolor: "#f5f5f5",
                height: "100%",
                minHeight: "100svh"
            }}
        >
            <Paper elevation={3} sx={{ background: "#804A26", color: "#fff", maxWidth: 420, width: "100%", p: 4 }}>
                <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
                    Create A Strong Password
                </Typography>

                <Typography
                    variant="body2"
                    textAlign="center"
                    mb={3}
                >
                    Your password must be at least 5 characters 
                    and should include a combination of numbers, 
                    letters and special characters (!$@%).
                </Typography>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <Stack direction="column" justifyContent="center" spacing={2} mb={2}>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        placeholder="New Password"
                        type="password"
                        id="password"
                        autoComplete="off"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
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
                                borderColor: errors.password ? "#db1818" : "#fff",
                            },
                            "& .MuiFormHelperText-root": {
                                color: "#fff",
                            },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#ccc", // default
                                },
                                "&:hover fieldset": {
                                    borderColor: errors.password ? "#db1818" : "#fff", // on hover
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: errors.password ? "#db1818" : "#fff", // on focus
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

                    <TextField
                        required
                        fullWidth
                        name="confirm-password"
                        placeholder="Confirm New Password"
                        type="password"
                        id="confirm-password"
                        autoComplete="off"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!errors.confirm}
                        helperText={errors.confirm}
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
                                borderColor: errors.confirm ? "#db1818" : "#fff",
                            },
                            "& .MuiFormHelperText-root": {
                                color: "#fff",
                            },
                            "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#ccc", // default
                            },
                            "&:hover fieldset": {
                                borderColor: errors.confirm ? "#db1818" : "#fff", // on hover
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: errors.confirm ? "#db1818" : "#fff", // on focus
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
                    disabled={loading}
                    sx={{
                        backgroundColor: "#fff",
                        "&:hover": {
                            backgroundColor: "#ddd",
                        },
                        color: "#111",
                        opacity: !checkButtonAction() ? 0.4 : 1,
                        pointerEvents: !checkButtonAction() ? "none" : "auto",
                    }}
                    onClick={handleResetPassword}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
                </Button>
            </Paper>
        </Box>
    </>
  )
}

export default ResetPassword;