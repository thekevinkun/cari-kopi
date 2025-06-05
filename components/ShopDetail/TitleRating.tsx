import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const TitleRating = ({ title, rating, reviews }: { title: string, rating: number, reviews: number }) => {
  return (
    <Box 
        display="flex" 
        alignItems="flex-start" 
        justifyContent="space-between"
        gap={7}
    >
        <Typography variant="h5">{title}</Typography>

        <Box display="flex" alignItems="center">
            <StarIcon 
                style={{
                color: "#faaf00",
                fontSize: "1.5rem"
                }}
            />
            <Typography component="legend">{rating}</Typography>
            <Typography variant="body2" color="info">({reviews})</Typography>
        </Box>
    </Box>
  )
}

export default TitleRating;