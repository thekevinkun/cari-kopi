import { JSX, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Typography, IconButton, Divider, 
    List, ListItem, ListItemIcon, ListItemText, 
    useMediaQuery } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import CloseIcon from "@mui/icons-material/Close";
import TurnLeftIcon from "@mui/icons-material/TurnLeft";
import TurnRightIcon from "@mui/icons-material/TurnRight";
import UTurnLeftIcon from "@mui/icons-material/UTurnLeft";
import StraightIcon from "@mui/icons-material/Straight";
import NavigationIcon from "@mui/icons-material/Navigation";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import CallSplitIcon from "@mui/icons-material/CallSplit";

import type { Mode, DirectionInfoProps } from "@/types";
import { parentCardDetailVariants, cardSlideVariants } from "@/utils/motion";
import { StyledStack, scrollStyle } from "./styles";

const MotionStack = motion.create(StyledStack);
const MotionBox = motion.create(Box);

const getStepIcon = (instruction: string, maneuver?: string | null): React.ReactNode => {
  const type = maneuver?.toLowerCase() ?? instruction.toLowerCase();

  if (type.includes("left")) return <TurnLeftIcon />;
  if (type.includes("right")) return <TurnRightIcon />;
  if (type.includes("u-turn")) return <UTurnLeftIcon />;
  if (type.includes("straight") || type.includes("continue")) return <StraightIcon />;
  if (type.includes("merge")) return <CallMergeIcon />;
  if (type.includes("ramp")) return <AltRouteIcon />;
  if (type.includes("roundabout")) return <SyncAltIcon />;
  if (type.includes("fork")) return <CallSplitIcon />;

  return <NavigationIcon />;
};

const modeIcons: Record<Mode, JSX.Element> = {
  driving: <DirectionsCarIcon color="primary" />,
  walking: <DirectionsWalkIcon color="primary" />,
  bicycling: <DirectionsBikeIcon color="primary" />,
  transit: <DirectionsTransitIcon color="primary" />,
};

const DirectionInfo = ({ visible, originAddress, destinationAddress, 
    directionInfo, directionSteps, onCloseDirections}: DirectionInfoProps) => {

    const isTablet = useMediaQuery("(max-width: 900px)");
    const isMobile = useMediaQuery("(max-width: 600px)");

    useEffect(() => {
        if (directionInfo && isTablet) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [directionInfo]);
    
    return (
        <AnimatePresence>
            {visible &&
                <MotionStack
                    key={"direction " + destinationAddress}
                    variants={parentCardDetailVariants(0.75)}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    sx={{
                        pb: 1,
                        px: 1,
                        marginTop: "auto"
                    }}
                >
                    <MotionBox
                        variants={cardSlideVariants(`${isMobile ? "down" : isTablet ? "right" : "up"}`)}
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
                            borderTopRightRadius: {
                                xs: 0,
                                sm: 8
                            },
                            borderTopLeftRadius: {
                                xs: 0,
                                sm: 8
                            },
                            borderBottomRightRadius: {
                                sm: 0,
                                md: 8
                            },
                            borderBottomLeftRadius: {
                                sm: 0,
                                md: 8
                            }
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
                                top: 5,
                                right: 10,
                                bgcolor: "rgba(0,0,0,0.35)",
                                color: "#fff",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
                                "&:hover": {
                                    bgcolor: "rgba(0,0,0,0.65)",
                                },
                                backdropFilter: "blur(2px)", // optional: adds a slight blur behind
                                borderRadius: "50%",
                                width: 35,
                                height: 35,
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
                        
                        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>
                            Directions
                        </Typography>

                        <List>
                        {directionSteps.map((step, index) => (
                            <ListItem key={index} alignItems="flex-start">

                            <ListItemIcon>
                                {getStepIcon(step.instruction, step.maneuver)}
                            </ListItemIcon>

                            <ListItemText
                                primary={
                                <span
                                    dangerouslySetInnerHTML={{ __html: step.instruction }}
                                    style={{ fontSize: "0.95rem" }}
                                />
                                }
                                secondary={step.distance}
                                secondaryTypographyProps={{ fontSize: "0.8rem" }}
                            />
                            </ListItem>
                        ))}
                        </List>
                    </MotionBox>
                </MotionStack>
            }
        </AnimatePresence>
    )
}

export default DirectionInfo;