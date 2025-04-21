import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
    Divider,
    IconButton,
    InputAdornment,
    Paper,
    Fade,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowForward } from "@mui/icons-material";
import signUpIllustration from "../../assets/signup-illustration.svg";

export default function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    async function registerUser(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "/api/register",
                {
                    firstName,
                    lastName,
                    email,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.data.error) {
                setMessage("Registration successful. Please log in.");
                setSeverity("success");
                setOpen(true);
                navigate("/login");
            } else {
                setMessage(response.data.data);
                setSeverity("error");
                setOpen(true);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
            setSeverity("error");
            setOpen(true);
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)",
            }}
        >
            <Fade in={true} timeout={800}>
                <Container maxWidth="md">
                    <Paper
                        elevation={10}
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            borderRadius: 4,
                            overflow: "hidden",
                            boxShadow: "0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,0.1)",
                        }}
                    >
                        {/* Left side - Illustration */}
                        <Box
                            sx={{
                                flex: 1,
                                background: "linear-gradient(160deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                p: 6,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                position: "relative",
                                "&:before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                                },
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    letterSpacing: 1,
                                    textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                                }}
                            >
                                STREAMLINE
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                                Create your account to streamline your operations.
                            </Typography>
                            <Box
                                component="img"
                                src={signUpIllustration}
                                alt="Login illustration"
                                sx={{
                                    width: "100%",
                                    maxWidth: 350,
                                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
                                    transform: "scale(1.05)",
                                    transition: "transform 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.08)",
                                    },
                                }}
                            />
                        </Box>

                        {/* Right side - Form */}
                        <Box
                            sx={{
                                flex: 1,
                                p: 6,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                background: "#ffffff",
                            }}
                        >
                            <Box sx={{ mb: 4 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                        color: "#3a416f",
                                    }}
                                >
                                    Sign Up
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 3,
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        style={{
                                            color: "#667eea",
                                            fontWeight: 600,
                                            textDecoration: "none",
                                            "&:hover": {
                                                textDecoration: "underline",
                                            },
                                        }}
                                    >
                                        Sign In
                                    </Link>
                                </Typography>
                            </Box>

                            <Box component="form" onSubmit={registerUser} sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                <TextField
                                    fullWidth
                                    placeholder="First Name"
                                    variant="outlined"
                                    margin="normal"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            "& fieldset": {
                                                borderColor: "#e0e0e0",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#667eea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#667eea",
                                                boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
                                            },
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: "#667eea",
                                        },
                                        margin: 0,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    placeholder="Last Name"
                                    variant="outlined"
                                    margin="normal"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            "& fieldset": {
                                                borderColor: "#e0e0e0",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#667eea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#667eea",
                                                boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
                                            },
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: "#667eea",
                                        },
                                        margin: 0,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    placeholder="Email"
                                    variant="outlined"
                                    margin="normal"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            "& fieldset": {
                                                borderColor: "#e0e0e0",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#667eea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#667eea",
                                                boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
                                            },
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: "#667eea",
                                        },
                                        margin: 0,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    placeholder="Password"
                                    variant="outlined"
                                    margin="normal"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                    sx={{
                                                        color: showPassword ? "#667eea" : "inherit",
                                                        ":hover": { backgroundColor: "transparent" },
                                                    }}
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff sx={{ fontSize: "20px" }} />
                                                    ) : (
                                                        <Visibility sx={{ fontSize: "20px" }} />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            "& fieldset": {
                                                borderColor: "#e0e0e0",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#667eea",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#667eea",
                                                boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
                                            },
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: "#667eea",
                                        },
                                        margin: 0,
                                    }}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    disabled={loading}
                                    endIcon={!loading && <ArrowForward />}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        boxShadow: "0 4px 6px rgba(102, 126, 234, 0.2)",
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: 500,
                                        "&:hover": {
                                            boxShadow: "0 6px 12px rgba(102, 126, 234, 0.3)",
                                            transform: "translateY(-1px)",
                                        },
                                        "&:active": {
                                            transform: "translateY(0)",
                                        },
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{
                            mt: 3,
                            opacity: 0.8,
                        }}
                    >
                        © {new Date().getFullYear()} Streamline. All rights reserved.
                    </Typography>

                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                        <Alert
                            onClose={handleClose}
                            severity={severity}
                            sx={{
                                width: "100%",
                                borderRadius: 2,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                        >
                            {message}
                        </Alert>
                    </Snackbar>
                </Container>
            </Fade>
        </Box>
    );
}
