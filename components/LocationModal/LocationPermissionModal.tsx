import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Backdrop, Box, Button, Modal, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { modalVariants } from "@/utils/motion";

const MotionBox = motion.create(Box);

const LocationPermissionModal = ({
  open,
  onConfirm,
  onDismiss,
}: {
  open: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleOnConfirm = () => {
    setIsVisible(false);

    setTimeout(onConfirm, 300);
  };

  const handleOnDismiss = () => {
    setIsVisible(false);

    setTimeout(onDismiss, 300);
  };

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleOnConfirm}
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
                maxWidth: 620,
                background: "white",
                borderRadius: 1,
                boxShadow: 24,
                pt: 3,
                px: 3,
                textAlign: "center",
                transformOrigin: "center",
              }}
            >
              <LocationOnIcon sx={{ fontSize: 48, color: "#804A26", mb: 1 }} />

              <Typography variant="h6" gutterBottom>
                Allow location for better experience
              </Typography>

              <Typography variant="body2" color="textSecondary">
                We use your location to show coffee shops near you instantly.
                You can also search manually if you prefer not to share your
                location.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  mt: 3,
                  pb: 2,
                }}
              >
                <Button
                  onClick={handleOnConfirm}
                  variant="contained"
                  sx={{
                    bgcolor: "#804A26",
                    "&:hover": { bgcolor: "#66381F" },
                    fontWeight: 600,
                  }}
                >
                  Use My Location
                </Button>

                <Button onClick={handleOnDismiss} color="inherit">
                  No, thanks
                </Button>
              </Box>
            </MotionBox>
          </div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default LocationPermissionModal;
