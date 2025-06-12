import { useState, useEffect } from "react";
import { GetServerSideProps} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useUser } from "@/contexts/UserContext";

import { Box, Button, CircularProgress, 
  Divider, FormLabel, FormControl, 
  Link as MUILink, TextField, Typography } from "@mui/material";

import { AuthContainer, AuthCard } from "@/components";

import { verifyToken } from "@/lib/db/auth";
import { toTitleCase } from "@/utils/helpers";
import { validateName, validateEmailFormat, validatePassword } from "@/lib/db/validation";

const checkEmailAvailable = async (email: string) => {
  const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
  const data = await res.json();
  return data.available;
};

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

const Register = () => {
  const router = useRouter();
  const { user } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Live name check
  useEffect(() => {
    if (name === "") {
      setErrors((prev) => ({
        ...prev,
        name: "",
      }));

      return;
    }

    const delayDebounce = setTimeout(async () => {
      const invalidName = validateName(name);
      setErrors((prev) => ({
        ...prev,
        name: invalidName ? invalidName : "",
      }));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [name]);

  // Live email check
  useEffect(() => {
    if (email === "") {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));

      return;
    }

    const delayDebounce = setTimeout(async () => {
      const available = await checkEmailAvailable(email);
      setErrors((prev) => ({
        ...prev,
        email: available ? "" : "Email already registered",
      }));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [email]);

  // Live password check
  useEffect(() => {
    if (password === "") {
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

  const checkButtonAction = () => {
    if (!name || !email || !password || !confirmPassword) 
      return false;
    
    if (errors.name || errors.email || errors.password || errors.confirm) 
      return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    // Check name
    if (!name) newErrors.name = "Name is required";

    const invalidName = validateName(name);
    if (invalidName) newErrors.name = invalidName;

    // Check email 
    if (!email) newErrors.email = "Email is required";

    const formatEmail = validateEmailFormat(email);
    if (formatEmail) newErrors.email = formatEmail;

    const emailAvailable = await checkEmailAvailable(email);
    if (!emailAvailable) newErrors.email = "Email already registered";

    // Check password and confirm password
    if (!password) newErrors.password = "Password is required";

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (password !== confirmPassword) newErrors.confirm = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    // API call to register
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();
      
      if (res.ok) {
        Cookies.set("verify_email", email, { expires: 1 / 92 });
        router.push(`/verify?email=${email}`);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (user) return null;

  return (
    <>
      <Head>
        <title>Create Account | Carikopi</title>
        <meta name="description" content="Create your Carikopi account" />
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
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name" sx={{ color: "#fff" }}>Full name</FormLabel>

              <TextField
                autoComplete="off"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={(e) => setName(toTitleCase(e.target.value))}
                error={!!errors.name}
                helperText={errors.name}
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
                    borderColor: errors.name ? "#db1818" : "#fff",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#fff",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ccc", // default
                    },
                    "&:hover fieldset": {
                      borderColor: errors.name ? "#db1818" : "#fff", // on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: errors.name ? "#db1818" : "#fff", // on focus
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
              <FormLabel htmlFor="email" sx={{ color: "#fff" }}>Email</FormLabel>

              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="off"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => setEmail(e.target.value.toLowerCase())}
                error={!!errors.email}
                helperText={errors.email}
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
                    borderColor: errors.email ? "#db1818" : "#fff",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#fff",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ccc", // default
                    },
                    "&:hover fieldset": {
                      borderColor: errors.email ? "#db1818" : "#fff", // on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: errors.email ? "#db1818" : "#fff", // on focus
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
                required
                fullWidth
                name="password"
                placeholder="••••••"
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
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password" sx={{ color: "#fff" }}>Confirm Password</FormLabel>

              <TextField
                required
                fullWidth
                name="confirm-password"
                placeholder="••••••"
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
            </FormControl>

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
                opacity: !checkButtonAction() ? 0.4 : 1,
                pointerEvents: !checkButtonAction() ? "none" : "auto",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
            </Button>
          </Box>

          <Divider 
            sx={{ 
              borderColor: "#fff",
              color: "#fff",
              "&::before, &::after": {
                borderColor: "#fff"
              }
            }}>
            <Typography sx={{ color: "#fff" }}>or</Typography>
          </Divider>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <MUILink
                href="/login"
                variant="body2"
                sx={{ 
                  alignSelf: "center",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline"
                  }
                }}
              >
                Log in
              </MUILink>
            </Typography>
          </Box>
        </AuthCard>
      </AuthContainer>
    </>
  );
}

export default Register;