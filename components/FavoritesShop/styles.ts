import { Box, Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledStack = styled(Stack)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: "none"
    }
}));