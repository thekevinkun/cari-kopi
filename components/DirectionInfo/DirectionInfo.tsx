import { JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Typography, IconButton, Divider, 
    List, ListItem, ListItemIcon, ListItemText, 
    Stack, useMediaQuery } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import CloseIcon from "@mui/icons-material/Close";

import type { Mode, DirectionInfoProps } from "@/types";
import { parentCardDetailVariants, cardSlideVariants } from "@/utils/motion";
import { scrollStyle } from "./styles";

const MotionStack = motion.create(Stack);
const MotionBox = motion.create(Box);

const modeIcons: Record<Mode, JSX.Element> = {
  driving: <DirectionsCarIcon color="primary" />,
  walking: <DirectionsWalkIcon color="primary" />,
  bicycling: <DirectionsBikeIcon color="primary" />,
  transit: <DirectionsTransitIcon color="primary" />,
};

const DirectionInfo = ({ originAddress, destinationAddress, 
    directionInfo, onCloseDirections}: DirectionInfoProps) => {
    
    const isTablet = useMediaQuery("(max-width: 900px)");
    const isMobile = useMediaQuery("(max-width: 600px)");

    return (
        <AnimatePresence>
            <MotionStack
                key={"direction " + destinationAddress}
                variants={parentCardDetailVariants(0.5)}
                initial="hidden"
                animate="show"
                exit="exit"
                sx={{
                    pb: 1,
                    px: 1,
                    height: isTablet ? "280px" : "280px",
                    marginTop: "auto"
                }}
            >
                <MotionBox
                    variants={cardSlideVariants("up")}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    sx={{
                        ...scrollStyle,
                        position: "relative",
                        padding: 2,
                        backgroundColor: "white",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.45)",
                        borderRadius: 2,
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1.5} mb={2}>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">From</Typography>
                            <Typography variant="body2" fontWeight="bold">{originAddress}</Typography>

                            <Typography variant="subtitle2" mt={1} color="text.secondary">To</Typography>
                            <Typography variant="body2" fontWeight="bold">{destinationAddress}</Typography>
                        </Box>
                    </Box>

                    <IconButton 
                        title="Close directions?"
                        sx={{
                            position: "absolute",
                            top: 0,
                            right: 8,
                        }}
                        onClick={onCloseDirections}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Divider />

                    <List sx={{ paddingBottom: 0 }}>
                        {Object.entries(directionInfo).map(([mode, info]) => (
                            <ListItem key={mode}>
                                <ListItemIcon>
                                    {modeIcons[mode as Mode]}
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${info?.duration ?? "-"} (${info?.distance ?? "-"})`}
                                    secondary={mode.charAt(0).toUpperCase() + mode.slice(1)}
                                />
                            </ListItem>
                        ))}
                    </List>
                </MotionBox>
            </MotionStack>
        </AnimatePresence>
    )
}

export default DirectionInfo;