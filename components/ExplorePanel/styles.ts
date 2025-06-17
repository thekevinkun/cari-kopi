import { styled, alpha, InputBase, Typography } from "@mui/material";

export const StyledAddress = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
  fontSize: "0.725rem",
  fontWeight: "bold",
  [theme.breakpoints.down('md')]: {
    maxWidth: 640,
    fontSize: "0.75rem",
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: "0.7rem"
  }
}));

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f5f5f5", // light gray background for contrast
  border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
  boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.1)}`,
  padding: theme.spacing(0.25, 1.5),
  width: "100%",
  [theme.breakpoints.down('md')]: {
    maxWidth: 640,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.15, 1.25),
    maxWidth: "100%"
  }
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  marginRight: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
  [theme.breakpoints.down('sm')]: {
    marginRight: theme.spacing(0.65),
  }
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  color: theme.palette.text.primary,
  fontSize: "0.95rem",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 0),
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: "0.85rem",
    "& .MuiInputBase-input": {
      padding: theme.spacing(0.75, 0),
    },
  }
}));