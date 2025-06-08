import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps} from "next";
import { Box, Button, CircularProgress, 
  Divider, FormLabel, FormControl, 
  Link as MUILink, TextField, Typography } from "@mui/material";

import { AuthContainer, AuthCard } from "@/components";

import { verifyToken } from "@/lib/auth";
import { toTitleCase } from "@/utils/helpers";
import { validateEmailFormat, validatePassword } from "@/lib/validation";

const checkUsernameAvailable = async (username: string) => {
  const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
  const data = await res.json();
  return data.available;
};

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
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Live username check
  useEffect(() => {
    if (username === "") {
      setErrors((prev) => ({
        ...prev,
        username: "",
      }));

      return;
    }

    if (username.trim().length < 5) return;

    const delayDebounce = setTimeout(async () => {
      const available = await checkUsernameAvailable(username);
      setErrors((prev) => ({
        ...prev,
        username: available ? "" : "Username is not available",
      }));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [username]);

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
    if (!name || !username || !email || !password || !confirmPassword) 
      return false;
    
    if (errors.name || errors.username || errors.email || errors.password || errors.confirm) 
      return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!name) newErrors.name = "Name is required";
    
    // Check username
    if (!username) newErrors.username = "Username is required";

    let available = await checkUsernameAvailable(username);
    if (!available) newErrors.username = "Username is not available";

    // Check email 
    if (!email) newErrors.email = "Email is required";

    const formatEmail = validateEmailFormat(email);
    if (formatEmail) newErrors.email = formatEmail;

    available = await checkEmailAvailable(email);
    if (!available) newErrors.email = "Email already registered";

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
        body: JSON.stringify({ name, username, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
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

  return (
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
            <FormLabel htmlFor="username" sx={{ color: "#fff" }}>Username</FormLabel>

            <TextField
              autoComplete="off"
              name="username"
              required
              fullWidth
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={(e) => setUsername(e.target.value.toLowerCase())}
              error={!!errors.username}
              helperText={errors.username}
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
                  borderColor: errors.username ? "#db1818" : "#fff",
                },
                "& .MuiFormHelperText-root": {
                  color: "#fff",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ccc", // default
                  },
                  "&:hover fieldset": {
                    borderColor: errors.username ? "#db1818" : "#fff", // on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: errors.username ? "#db1818" : "#fff", // on focus
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
              sx={{ alignSelf: "center", color: "#111", textDecorationColor: "#222" }}
            >
              Login
            </MUILink>
          </Typography>
        </Box>
      </AuthCard>
    </AuthContainer>
  );
}

export default Register;