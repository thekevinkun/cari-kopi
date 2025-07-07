import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Backdrop, Box, Typography, Button } from "@mui/material";
import LocationOffIcon from "@mui/icons-material/LocationOff";

import { modalVariants } from "@/utils/motion";
import { getLocationPermissionInstructions } from "@/utils/helpers";

const MotionBox = motion.create(Box);

const LocationBlockedModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [instructions, setInstructions] = useState("");

  const handleOnClose = () => {
    setIsVisible(false);

    setTimeout(onClose, 300);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInstructions(getLocationPermissionInstructions());
    }
  }, []);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleOnClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
        },
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1300,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MotionBox
              variants={modalVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              sx={{
                width: "90%",
                maxWidth: 420,
                background: "white",
                borderRadius: 1,
                boxShadow: 24,
                pt: 3,
                px: 3,
                textAlign: "center",
                transformOrigin: "center",
              }}
            >
              <LocationOffIcon sx={{ fontSize: 48, color: "#c62828", mb: 1 }} />

              <Typography variant="h6" sx={{ mb: 2 }}>
                Location Permission is Blocked
              </Typography>

              <Typography variant="body2" gutterBottom>
                To allow your location,
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                {instructions || "Instructions unavailable"}
              </Typography>

              <Typography
                variant="caption"
                display="block"
                sx={{ mb: 2, color: "gray" }}
              >
                Refresh the page after changing permission.
              </Typography>

              <Button 
                variant="contained" 
                color="error" 
                onClick={handleOnClose} 
                sx={{ mb: 2 }}
              >
                Close
              </Button>
            </MotionBox>
          </div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default LocationBlockedModal;
