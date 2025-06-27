import { createContext, useContext, useState } from "react";

import { TopAlert } from "@/components";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import type { AlertType, AlertContextType } from "@/types";

const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
});

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<AlertType>("success");

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
        setTimeout(() => setMessage(""), 500);
    }

    const showAlert = (msg: string, t: AlertType = "success") => {
        setMessage(msg);
        setType(t);
        setOpen(true);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <TopAlert 
                open={open} 
                type={type} 
                message={message} 
                handleClose={handleClose} 
            />
        </AlertContext.Provider>
    );
}

export const useAlert = () => useContext(AlertContext);