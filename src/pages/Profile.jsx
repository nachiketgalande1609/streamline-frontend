import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    Typography,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Snackbar,
    Alert,
    Tooltip,
    CircularProgress,
    Avatar,
    Grid,
    useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GradientCircularProgress from "../components/GradientCircularProgress";
import PersonIcon from "@mui/icons-material/Person";
import LoadingButton from "@mui/lab/LoadingButton";
import { CameraAlt } from "@mui/icons-material";
import { UserContext } from "../context/UserContext";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import { motion } from "framer-motion";

const baseURL = "https://streamline-backend-700h.onrender.com";

const StyledCard = styled(Card)(({ theme }) => ({
    background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
    borderRadius: "12px",
    boxShadow: "9px 9px 18px #ededed,-9px -9px 18px #ffffff",
    padding: "24px",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "4px",
        height: "100%",
        background: theme.palette.primary.main,
    },
}));

const ProfileCard = styled(Card)(({ theme }) => ({
    background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
    borderRadius: "12px",
    boxShadow: "9px 9px 18px #ededed,-9px -9px 18px #ffffff",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    transition: "all 0.3s ease",
    position: "relative",
    height: "372.41px",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "4px",
        height: "100%",
        background: theme.palette.primary.main,
    },
}));

const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        "& fieldset": {
            transition: "all 0.3s ease",
        },
        "&:hover fieldset": {
            borderColor: "#1976d2",
        },
    },
});

const StyledSelect = styled(Select)({
    borderRadius: "12px",
    "& .MuiOutlinedInput-notchedOutline": {
        transition: "all 0.3s ease",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1976d2",
    },
});

export default function Profile({ profileImage, setProfileImage }) {
    const { user, updateUser } = useContext(UserContext);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        profilePicture: "",
        role: "",
        status: "",
        city: "",
        country: "",
    });

    const roles = ["admin", "sales", "user", "manager"];
    const statuses = ["active", "inactive", "pending"];
    const theme = useTheme();

    const [loading, setLoading] = useState(true);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [updatingProfilePicture, setUpdatingProfilePicture] = useState(false);

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Profile", path: "" },
    ];

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.post("api/users/profile", {
                email: user?.email,
            });
            setUserData(response?.data?.data);
            setFormData(response?.data?.data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, [user]);

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUpdatingProfilePicture(true);
            const formData = new FormData();
            formData.append("profilePicture", file);

            try {
                const response = await axios.post("api/users/uploadProfilePicture", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const newProfilePicture = response?.data?.data?.profilePicture;

                if (newProfilePicture) {
                    localStorage.setItem("userProfile", newProfilePicture);
                    setProfileImage(newProfilePicture);
                    setMessage("Profile Picture uploaded successfully!");
                    setSeverity("success");
                    setAlertOpen(true);
                }
            } catch (error) {
                console.error("Error uploading profile picture:", error);
            } finally {
                setUpdatingProfilePicture(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        setUpdatingProfile(true);
        e.preventDefault();
        try {
            const response = await axios.put("api/users/update", formData);
            if (response.data.success) {
                setMessage("Profile updated successfully!");
                setSeverity("success");
                setAlertOpen(true);
                await fetchUserProfile();
            } else {
                setMessage(response.data.data);
                setSeverity("error");
                setAlertOpen(true);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage(error);
            setSeverity("error");
            setAlertOpen(true);
        } finally {
            setUpdatingProfile(false);
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                    My Profile
                </Typography>
            </Box>
            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 220px)" }}>
                    <GradientCircularProgress />
                </Box>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <ProfileCard>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="upload-profile-picture"
                                    style={{ display: "none" }}
                                    onChange={handleProfilePictureChange}
                                />
                                <label htmlFor="upload-profile-picture" style={{ position: "relative" }}>
                                    <Tooltip title="Upload Profile Image" placement="top" arrow>
                                        <Box
                                            sx={{
                                                position: "relative",
                                                "&:hover .overlay": {
                                                    opacity: 1,
                                                    cursor: "pointer",
                                                },
                                            }}
                                        >
                                            <Avatar
                                                src={
                                                    profileImage
                                                        ? `${baseURL}${profileImage}`
                                                        : "https://static-00.iconduck.com/assets.00/profile-major-icon-512x512-xosjbbdq.png"
                                                }
                                                alt="Profile"
                                                sx={{
                                                    width: 180,
                                                    height: 180,
                                                    borderRadius: "50%",
                                                    marginBottom: 2,
                                                    border: `4px solid ${theme.palette.primary.main}`,
                                                    cursor: "pointer",
                                                    position: "relative",
                                                    zIndex: 1,
                                                }}
                                            />
                                            {updatingProfilePicture && (
                                                <Box
                                                    className="overlay"
                                                    sx={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        borderRadius: "50%",
                                                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                                                        opacity: 1,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        transition: "opacity 0.3s ease",
                                                        zIndex: 2,
                                                    }}
                                                >
                                                    <CircularProgress size={50} sx={{ color: "#fff" }} />
                                                </Box>
                                            )}
                                            {!updatingProfilePicture && (
                                                <Box
                                                    className="overlay"
                                                    sx={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        borderRadius: "50%",
                                                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                                                        opacity: 0,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        transition: "opacity 0.3s ease",
                                                        zIndex: 2,
                                                    }}
                                                >
                                                    <CameraAlt sx={{ color: "#fff", fontSize: 30 }} />
                                                </Box>
                                            )}
                                        </Box>
                                    </Tooltip>
                                </label>

                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    {userData?.firstName} {userData?.lastName}
                                </Typography>
                                <Box
                                    sx={{
                                        backgroundColor: theme.palette.primary.light,
                                        px: 2,
                                        py: 1,
                                        borderRadius: "12px",
                                        fontWeight: 600,
                                        textTransform: "capitalize",
                                        mb: 2,
                                        color: "#ffffff",
                                    }}
                                >
                                    {userData?.role}
                                </Box>
                                <Typography variant="body1" color="text.secondary">
                                    {userData?.email}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {userData?.phoneNumber}
                                </Typography>
                            </ProfileCard>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <StyledCard>
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    Profile Information
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                label="First Name"
                                                name="firstName"
                                                value={formData?.firstName}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                label="Last Name"
                                                name="lastName"
                                                value={formData?.lastName}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                label="Phone Number"
                                                name="phoneNumber"
                                                value={formData?.phoneNumber}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                label="Email Address"
                                                name="email"
                                                value={formData?.email}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel id="status-label">Status</InputLabel>
                                                <StyledSelect
                                                    labelId="status-label"
                                                    name="status"
                                                    value={formData?.status}
                                                    onChange={handleChange}
                                                    label="Status"
                                                >
                                                    {statuses.map((status) => (
                                                        <MenuItem key={status} value={status}>
                                                            {status}
                                                        </MenuItem>
                                                    ))}
                                                </StyledSelect>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel id="role-label">Role</InputLabel>
                                                <StyledSelect
                                                    labelId="role-label"
                                                    name="role"
                                                    value={formData?.role}
                                                    onChange={handleChange}
                                                    label="Role"
                                                >
                                                    {roles.map((role) => (
                                                        <MenuItem key={role} value={role}>
                                                            {role}
                                                        </MenuItem>
                                                    ))}
                                                </StyledSelect>
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                                        <LoadingButton
                                            type="submit"
                                            variant="contained"
                                            loading={updatingProfile}
                                            loadingPosition="end"
                                            sx={{
                                                borderRadius: "12px",
                                                px: 4,
                                                py: 1.5,
                                                fontWeight: 600,
                                                textTransform: "none",
                                                fontSize: "1rem",
                                            }}
                                        >
                                            {updatingProfile ? "Saving..." : "Save Changes"}
                                        </LoadingButton>
                                    </Box>
                                </form>
                            </StyledCard>
                        </Grid>
                    </Grid>
                </motion.div>
            )}

            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert
                    onClose={handleAlertClose}
                    severity={severity}
                    sx={{
                        width: "100%",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
