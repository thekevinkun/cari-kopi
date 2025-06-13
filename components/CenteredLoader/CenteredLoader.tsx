import { Box, CircularProgress, SxProps } from "@mui/material";

const CenteredLoader = ({ height = "100%", sx }: { height?: string, sx?: SxProps }) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ 
                height,
                ...sx,
            }}
        >
            <CircularProgress />
        </Box>
    )
}

export default CenteredLoader;