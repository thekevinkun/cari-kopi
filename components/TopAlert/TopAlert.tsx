import { Alert, Slide, Snackbar } from "@mui/material";
import type { SlideProps } from "@mui/material";
import type { TopAlertProps } from "@/types";

const SlideDown = (props: SlideProps) => <Slide {...props} direction="down" />;

const TopAlert = ({
  open,
  message,
  type = "success",
  handleClose,
}: TopAlertProps) => {
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      TransitionComponent={SlideDown}
      sx={{
        zIndex: 1400,
        mt: 2,
        maxWidth: "100vw",
      }}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{
          width: "100%",
          maxWidth: 520,
          px: 3,
          py: 1,
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: 500,
          backgroundColor: type === "success" ? "#804A26" : undefined,
          color: type === "success" ? "#fff" : undefined,
          backdropFilter: "blur(8px)",
          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default TopAlert;
