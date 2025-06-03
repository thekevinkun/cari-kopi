import { useState } from "react";
import {
  Collapse,
  Typography,
  Grid,
  IconButton,
  Box,
  Paper
} from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const OpeningHours = ({ openState, weekdayText }: { openState: string, weekdayText: string[] }) => {
  const todayIndex = new Date().getDay(); // Sunday = 0
  const [expanded, setExpanded] = useState(false);

  const reordered = [
    ...weekdayText.slice(todayIndex),
    ...weekdayText.slice(0, todayIndex),
  ];

  const [currentDayLabel, currentDayHours] = weekdayText[todayIndex].split(": ");

  return (
    <Paper sx={{
        mt: 0.5, 
        pr: 1, 
        borderRadius: 0,
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.2),0px 0px 0px 0px rgba(0,0,0,0.14),0px 1.5px 0px 0px rgba(0,0,0,0.12)" 
    }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setExpanded(!expanded)}
        sx={{ cursor: "pointer" }}
      >
        <Typography 
          variant="body2" 
          color="textSecondary" 
          fontSize="0.825rem"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <AccessTimeFilledIcon 
            sx={{ 
              position: "relative",
              top: "-1.1px",
              fontSize: "1rem", 
              marginRight: "6px" 
            }} 
            /> 
          {openState ? openState : currentDayHours}
        </Typography>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Grid container direction="column" spacing={1} sx={{ mt: 1, pl: 2, pb: 2 }}>
          {reordered.map((text, index) => {
            const [day, hours] = text.split(": ");
            const isToday = day.toLowerCase().startsWith(
              new Date().toLocaleDateString("en-US", { weekday: "long"}).toLowerCase()
            );

            return (
              <Grid
                container
                key={day}
                justifyContent="space-between"
                wrap="nowrap"
              >
                <Typography
                  fontSize="small"
                  fontWeight={isToday ? "bold" : "normal"}
                  sx={{ minWidth: 100 }}
                >
                  {day}
                </Typography>

                <Typography 
                  fontSize="small" 
                  fontWeight={isToday ? "bold" : "normal"}
                  sx={{
                    color: /[(（]/.test(hours) ? "primary.main" : "text.primary",
                    fontStyle: /[(（]/.test(hours) ? "italic" : "normal",
                  }}
                >
                  {hours}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </Collapse>
    </Paper>
  );
}

export default OpeningHours;