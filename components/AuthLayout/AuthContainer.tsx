import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

const AuthContainer = styled(Stack)(({ theme }) => ({
  backgroundImage: "url('/coffee-world-map.png')",
  backgroundAttachment: "fixed",
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
  backgroundPosition: "center center",
  height: "100%",
  minHeight: ["100vh", "100svh"],
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  [theme.breakpoints.down("sm")]: {
    backgroundImage: "none",
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
  },
}));

export default AuthContainer;
