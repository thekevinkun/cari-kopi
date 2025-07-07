import {
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const LocationPermissionModal = ({
  open,
  onConfirm,
  onDismiss,
}: {
  open: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}) => {
  return (
    <Dialog open={open} onClose={onDismiss}>
      <DialogContent sx={{ textAlign: "center", px: 4, pt: 3 }}>
        <LocationOnIcon sx={{ fontSize: 48, color: "#804A26", mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          Allow location for better experience
        </Typography>
        <Typography variant="body2" color="textSecondary">
          We use your location to show coffee shops near you instantly. You can also
          search manually if you prefer not to share your location.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            bgcolor: "#804A26",
            "&:hover": { bgcolor: "#66381F" },
            fontWeight: 600,
          }}
        >
          Use My Location
        </Button>
        <Button onClick={onDismiss} color="inherit">
          No, thanks
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationPermissionModal;
