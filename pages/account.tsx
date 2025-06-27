import { useEffect, useState } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";
import { useAlert } from "@/contexts/AlertContext";
import { Box, Typography, Button, TextField, Link, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { verifyToken } from "@/lib/db/auth";
import { validateEmailFormat, validateName } from "@/lib/db/validation";

const checkEmailAvailable = async (email: string) => {
  const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
  const data = await res.json();
  return data.available;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.req.cookies.token;

  const user = token ? verifyToken(token) : null;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

type Field = "fullName" | "email";

export default function Account() {
  const { user, setUser } = useUser();
  const id = user?.id || "";
  const accountName = user?.name?.split(" ")[0] || "Your";
  const accountEmail = user?.email || "";

  const { showAlert } = useAlert();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [editField, setEditField] = useState<Field | null>(null);
  const [formData, setFormData] = useState<Record<Field, string>>({
    fullName: "",
    email: "",
  });
  const [tempValue, setTempValue] = useState("");

  const [deleteConfirmValue, setDeleteConfirmValue] = useState(""); 
  const [tempValueDelete, setTempValueDelete] = useState("");

  const handleEdit = (field: Field) => {
    setEditField(field);
    setTempValue(formData[field] ?? "");
  };

  const handleCancel = () => {
    if (editField === "fullName") {
      setErrors((prev) => ({
        ...prev,
        fullName: "",
      }));
    }

    if (editField === "email") {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }

    setEditField(null);
    setTempValue("");
  };

  const handleSave = async () => {
    if (editField === "fullName") {
      const name = tempValue;

      // Validate name
      const invalidName = validateName(name);
      if (invalidName) {
        setErrors((prev) => ({
          ...prev,
          fullName: invalidName,
        }));

        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/auth/update-name", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, name }),
        });

        const data = await res.json();

        if (!res.ok) {
          showAlert(data.error || "Failed to update your name", "error");
        } else {
          showAlert(data.message, "success");

          setFormData({ ...formData, [editField]: name });
          setEditField(null);

          setUser(data.user);
        }
      } catch (err) {
        showAlert("Something went wrong. Failed to update your name.", "error");
      } finally {
        setLoading(false);
      }
    }

    if (editField === "email") {
      const email = tempValue;

      // Validate email
      const formatEmail = validateEmailFormat(email);
      if (formatEmail) {
        setErrors((prev) => ({
          ...prev,
          email: formatEmail,
        }));

        return;
      }

      const available = await checkEmailAvailable(email);
      if (!available) {
        setErrors((prev) => ({
          ...prev,
          email: "Email already registered",
        }));

        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/auth/update-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, email }),
        });

        const data = await res.json();

        if (!res.ok) {
          showAlert(data.error || "Failed to update your email", "error");
        } else {
          showAlert(data.message, "success");

          setFormData({ ...formData, [editField]: email });
          setEditField(null);

          setUser(data.user);
        }
      } catch (err) {
        showAlert("Something went wrong. Failed to update your email.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetPassword = async () => {
    if (!accountEmail) return;

    try {
      const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: accountEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert(data.error || "Failed to send a link to your email", "error");
      } else {
        showAlert(data.message, "success");
      }
    } catch (err) {
      showAlert("Something went wrong. Failed to send a link to your email.", "error");
    }
  }

  const handleDeleteAccount = async () => {
    if (tempValueDelete !== deleteConfirmValue) {
      setErrors((prev) => ({
        ...prev,
        delete: "Please type correctly.",
      }));

      return;
    }

    setLoadingDelete(true);

    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert(data.error || "Something went wrong. Failed to delete your account.", "error");
      } else {
        showAlert(data.message, "success");
        setUser(null);

        router.replace("/"); 
      }
    } catch(error) {
      console.error("Delete error", error);
      showAlert("Something went wrong. Failed to delete your account.", "error");
    } finally {
      setLoadingDelete(false);
    }
  }

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name ?? "",
        email: user.email ?? "",
      });

      setDeleteConfirmValue(user.email);
    }
  }, [user]);
  
  if (!user) return null;

  return (
    <>
      <Head>
        <title>{accountName}'s Account | Carikopi</title>
        <meta name="description" content="User account information" />
      </Head>

      <Box maxWidth={600} mx="auto" px={2} py={4}>
        <Typography variant="h6" gutterBottom>Account Information</Typography>

        <Typography variant="body2" mb={3}>
          These settings include basic information about your account.
        </Typography>

        {/* Full Name */}
        <EditableSection
          label="Full name"
          field="fullName"
          editField={editField}
          value={formData.fullName ?? ""}
          loading={loading}
          error={errors.fullName}
          tempValue={tempValue}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          onChange={(e) => {
            if (errors.fullName) {
              setErrors((prev) => ({
                ...prev,
                fullName: "",
              }));
            }
            setTempValue(e.target.value)
          }}
          description="The name that is appears on your screen."
        />

        {/* Email */}
        <EditableSection
          label="Email address (Sign in)"
          field="email"
          editField={editField}
          value={formData.email ?? ""}
          loading={loading}
          error={errors.email}
          tempValue={tempValue}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          onChange={(e) => {
            if (errors.email) {
              setErrors((prev) => ({
                ...prev,
                email: "",
              }));
            }
            setTempValue(e.target.value)
          }}
          description="You receive messages from carikopi at this address."
        />

        {/* Password (link only) */}
        <Section
          label="Password"
          value={
            <Button 
              variant="text" 
              sx={{
                padding: 0,
                "&:hover": {
                  textDecoration: "underline"
                }
              }}
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          }
          description=""
        />

        {/* Delete Account */}
        <DeleteSection
          label="Delete My Account"
          deleteConfirmValue={deleteConfirmValue}
          tempValueDelete={tempValueDelete}
          loading={loadingDelete}
          error={errors.delete}
          onChange={(e) => {
            if (errors.delete) {
              setErrors((prev) => ({
                ...prev,
                delete: "",
              }));
            }
            setTempValueDelete(e.target.value);
          }}
          onDelete={handleDeleteAccount}
        />
      </Box>
    </>
  )
}

const Section = ({ label, value, description }: 
  { label: string, value: any, description?: string }) => {

  return (
    <Box mb={3}>
      <Typography variant="subtitle2" color="text.secondary" fontWeight="700">{label}</Typography>

      <Typography variant="body1" fontWeight="medium" mt={1}>{value}</Typography>
      
      {description && (
        <Typography variant="body2" color="text.secondary" mt={1}>{description}</Typography>
      )}
    </Box>
  );
}

const EditableSection = ({
  label, field, value, loading, error, tempValue,
  editField, onEdit, onCancel, onSave, onChange, description
}: {
  label: string;
  field: Field;
  value: string;
  loading: boolean;
  error: string;
  tempValue: string;
  editField: Field | null;
  onEdit: (field: Field) => void;
  onCancel: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
}) => {
  const isEditing = editField === field;

  return (
    <Box mb={3}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography 
          variant="subtitle2" 
          color="text.secondary"
          fontWeight="700"
        >
          {label}
        </Typography>

        <Button 
          size="small" 
          onClick={() => onEdit(field)} 
          sx={{ gap: 0.5, textTransform: "none" }}
        >
          <EditIcon fontSize="small"/> Edit
        </Button>
      </Box>

      {isEditing ? (
        <>
          <TextField
            autoComplete="off"
            fullWidth
            variant="outlined"
            size="small"
            value={tempValue}
            error={!!error}
            helperText={error}
            onChange={onChange}
            sx={{ my: 1 }}
          />

          <Box display="flex" gap={1} mb={2}>
            <Button 
              variant="contained"
              disabled={loading} 
              onClick={onSave}
              sx={{
                pointerEvents: !tempValue || error || tempValue === value ? "none" : "auto",
                opacity: !tempValue || error || tempValue === value ? 0.65 : 1
              }}
            >
              {loading ? "Saving..." : "Save"}
            </Button>

            <Button 
              variant="outlined" 
              disabled={loading}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="body1" fontWeight="medium" mt={1}>{value}</Typography>
        </>
      )}

      {description && (
        <Typography variant="body2" color="text.secondary" mt={1}>{description}</Typography>
      )}
    </Box>
  );
}

const DeleteSection = ({
  label, deleteConfirmValue, tempValueDelete, loading, error, onChange, onDelete,
}: { 
  label: string; 
  deleteConfirmValue: string; 
  tempValueDelete: string;
  loading: boolean;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void; 
}) => {
  return (
    <Box mb={3}>
      <Typography 
        variant="h6"
        color="text.secondary" 
        fontWeight="700"
      >
        {label}
      </Typography>

      <Typography variant="body1" color="text.secondary" mt={1}>
        We're sorry to see you go!
      </Typography>

      <Typography variant="body1" color="text.secondary" mt={1}>
        Please note: Deletion of your account and personal data is permanent and cannot be undone. 
        Carikopi will not be able to recover your account or the data that is deleted.
      </Typography>

      <Typography variant="body2" color="error" mt={2}>
        Warning: Account deletion is permanent. Please read the above carefully before proceeding. 
        This is an irreversible action, and you will no longer be able to use the same email on Carikopi.
      </Typography>

      <TextField
        autoComplete="off"
        color="error"
        variant="outlined"
        size="small"
        placeholder={`Type "${deleteConfirmValue}" to confirm`}
        value={tempValueDelete}
        error={!!error}
        helperText={error}
        sx={{ 
          width: "100%",
          maxWidth: 420,
          mt: 3, 
          "& .MuiInputBase-root": {
            fontSize: "0.875rem",
            fontWeight: "700",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(211, 47, 47, 0.5)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d32f2f",
          },
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor:  "#d32f2f", // on hover
            },
          },
        }}
        onChange={onChange}
      />

      <Button 
        variant="outlined" 
        color="error" 
        disabled={loading}
        sx={{ 
          mt: 2,
          minWidth: 192,
          pointerEvents: !tempValueDelete || error ? "none" : "auto",
          opacity: !tempValueDelete || error ? 0.65 : 1
        }}
        onClick={onDelete}
      >
        {loading ? <CircularProgress size={24} color="inherit" />
          : label
        }
      </Button>
    </Box>
  )
}