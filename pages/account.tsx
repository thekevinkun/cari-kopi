import { useEffect, useState } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useUser } from "@/contexts/UserContext";
import { Box, Typography, Button, TextField, Divider, Link } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { verifyToken } from "@/lib/db/auth";

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
  const { user } = useUser();
  const name = user?.name?.split(" ")[0] || "Your";

  const [editField, setEditField] = useState<Field | null>(null);
  const [formData, setFormData] = useState<Record<Field, string>>({
    fullName: "",
    email: "",
  });
  const [tempValue, setTempValue] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(""); 

  const handleEdit = (field: Field) => {
    setEditField(field);
    setTempValue(formData[field] ?? "");
  };

  const handleCancel = () => {
    setEditField(null);
    setTempValue("");
  };

  const handleSave = () => {
    if (editField) {
      setFormData({ ...formData, [editField]: tempValue });
      setEditField(null);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name ?? "",
        email: user.email ?? "",
      });

      setDeleteConfirm(user.email);
    }
  }, [user]);
  
  if (!user) return null;

  return (
    <>
      <Head>
        <title>{name}'s Account | Carikopi</title>
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
          tempValue={tempValue}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          onChange={(e) => setTempValue(e.target.value)}
          description="The name that is appears on your screen."
        />

        {/* Email */}
        <EditableSection
          label="Email address (Sign in)"
          field="email"
          editField={editField}
          value={formData.email ?? ""}
          tempValue={tempValue}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          onChange={(e) => setTempValue(e.target.value)}
          description="You receive messages from carikopi at this address."
        />

        {/* Password (link only) */}
        <Section
          label="Password"
          value={<Link href="#">Reset Password</Link>}
          description=""
        />

        {/* Delete Account */}
        <DeleteSection
          label="Delete My Account"
          deleteConfirm={deleteConfirm}
          onDelete={() => {}}
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
  label, field, value, tempValue,
  editField, onEdit, onCancel, onSave, onChange, description
}: {
  label: string;
  field: Field;
  value: string;
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
            fullWidth
            variant="outlined"
            size="small"
            value={tempValue}
            onChange={onChange}
            sx={{ my: 1 }}
          />

          <Box display="flex" gap={1} mb={2}>
            <Button variant="contained" onClick={onSave}>Save</Button>
            <Button variant="outlined" onClick={onCancel}>Cancel</Button>
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
  label, deleteConfirm, onDelete,
}: { label: string; deleteConfirm: string; onDelete: () => void; }) => {

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
        color="error"
        variant="outlined"
        size="small"
        placeholder={`Type "${deleteConfirm}" to confirm`}
        sx={{ 
          width: "100%",
          maxWidth: 420,
          mt: 3, 
          "& .MuiInputBase-root": {
            fontSize: "0.875rem",
            fontWeight: "700"
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(211, 47, 47, 0.5)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d32f2f",
          },
        }}
      />

      <Button variant="outlined" color="error" sx={{ mt: 2 }} onClick={onDelete}>
        {label}
      </Button>
    </Box>
  )
}