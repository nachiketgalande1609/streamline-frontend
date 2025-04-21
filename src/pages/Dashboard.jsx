import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Divider, CircularProgress, Box, Tooltip, Grid, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import GradientCircularProgress from "../components/GradientCircularProgress";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupIcon from "@mui/icons-material/Group";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { motion } from "framer-motion";

const StyledCard = styled(Card)(({ theme }) => ({
    background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
    color: theme.palette.text.primary,
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100px",
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 12px 20px rgba(0,0,0,0.12)",
    },
    border: "none",
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

const CardTitle = styled(Typography)({
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#666",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
});

const CardValue = styled(Typography)(({ theme }) => ({
    fontSize: "2rem",
    fontWeight: 700,
    color: theme.palette.text.primary,
    lineHeight: 1.2,
}));

const GrowthIndicator = styled(Box)(({ positive }) => ({
    display: "inline-flex",
    alignItems: "center",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: positive ? "#4CAF50" : "#F44336",
    backgroundColor: positive ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
    padding: "4px 8px",
    borderRadius: "12px",
    marginTop: "8px",
}));

const WarehouseCard = styled(Card)(({ theme }) => ({
    background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
    padding: "20px",
    minWidth: "220px",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 12px 20px rgba(0,0,0,0.12)",
    },
}));

const SectionHeader = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
});

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: "1.25rem",
    fontWeight: 600,
    color: theme.palette.text.primary,
    display: "flex",
    alignItems: "center",
    gap: "8px",
}));

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        userCount: 0,
        warehouseCount: 0,
        orderCount: 0,
        customerCount: 0,
        ticketCount: 0,
        warehouse_summary: [],
    });

    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    const breadcrumbs = [{ label: "Home", path: "" }];

    const fetchData = () => {
        setLoading(true);
        axios
            .get("/api/dashboard")
            .then((response) => {
                if (response.data.success) {
                    setDashboardData(response.data.data);
                }
            })
            .catch((error) => {
                console.error("There was an error fetching the dashboard data!", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => fetchData(), []);

    const CountCards = () => {
        const cardDetails = [
            {
                title: "Total Users",
                value: dashboardData.userCount,
                icon: <PeopleAltIcon fontSize="small" />,
                growth: "+5.2%",
            },
            {
                title: "Total Warehouses",
                value: dashboardData.warehouseCount,
                icon: <WarehouseIcon fontSize="small" />,
                growth: "+2.1%",
            },
            {
                title: "Total Orders",
                value: dashboardData.orderCount,
                icon: <ShoppingCartIcon fontSize="small" />,
                growth: "+12.7%",
            },
            {
                title: "Total Customers",
                value: dashboardData.customerCount,
                icon: <GroupIcon fontSize="small" />,
                growth: "+8.3%",
            },
            {
                title: "Total Tickets",
                value: dashboardData.ticketCount,
                icon: <SupportAgentIcon fontSize="small" />,
                growth: "-3.4%",
            },
        ];

        return (
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {cardDetails.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                            <StyledCard>
                                <Box>
                                    <CardTitle>
                                        {card.icon}
                                        {card.title}
                                    </CardTitle>
                                    <CardValue>{card.value}</CardValue>
                                    <GrowthIndicator positive={!card.growth.startsWith("-")}>{card.growth}</GrowthIndicator>
                                </Box>
                            </StyledCard>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        );
    };

    const WarehouseGauge = () => {
        const [animatedStock, setAnimatedStock] = useState([]);

        useEffect(() => {
            const interval = setInterval(() => {
                setAnimatedStock((prevStock) =>
                    dashboardData.warehouse_summary.map((warehouse, index) => {
                        const targetPercentage = Math.round((warehouse.currentStock / warehouse.capacity) * 100);
                        const current = prevStock[index] || 0;
                        return current < targetPercentage ? current + 5 : targetPercentage;
                    })
                );
            }, 50);

            return () => clearInterval(interval);
        }, [dashboardData.warehouse_summary]);

        return (
            <Box
                sx={{
                    background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                    padding: "24px",
                    mt: 4,
                }}
            >
                <SectionHeader>
                    <SectionTitle>
                        <WarehouseIcon fontSize="small" />
                        Warehouse Capacity
                    </SectionTitle>
                    <Tooltip title="This section provides a quick view of each warehouse's total and available capacity" placement="right">
                        <InfoOutlinedIcon sx={{ color: theme.palette.text.secondary }} />
                    </Tooltip>
                </SectionHeader>

                <Box
                    sx={{
                        display: "flex",
                        gap: 3,
                        overflowX: "auto",
                        pb: 2,
                        pt: 1,
                        "&::-webkit-scrollbar": {
                            height: "6px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: theme.palette.divider,
                            borderRadius: "3px",
                        },
                    }}
                >
                    {dashboardData.warehouse_summary.map((warehouse, index) => {
                        const stockPercentage = animatedStock[index] || 0;
                        const gaugeColor =
                            stockPercentage > 85 ? "#F44336" : stockPercentage > 70 ? "#FF9800" : stockPercentage > 50 ? "#FFC107" : "#4CAF50";

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <WarehouseCard>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        {`Warehouse #${warehouse.warehouse_id}`}
                                    </Typography>
                                    <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
                                        <CircularProgress
                                            variant="determinate"
                                            value={100}
                                            size={100}
                                            thickness={4}
                                            sx={{
                                                color: theme.palette.divider,
                                                position: "absolute",
                                            }}
                                        />
                                        <CircularProgress
                                            variant="determinate"
                                            value={stockPercentage}
                                            size={100}
                                            thickness={4}
                                            sx={{
                                                color: gaugeColor,
                                                transition: "all 0.5s ease-in-out",
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                right: 0,
                                                position: "absolute",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Typography variant="h6" component="div" fontWeight={700}>
                                                {`${stockPercentage}%`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {`${warehouse.currentStock} / ${warehouse.capacity} units`}
                                        </Typography>
                                    </Box>
                                </WarehouseCard>
                            </motion.div>
                        );
                    })}
                </Box>
            </Box>
        );
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 120px)">
                <GradientCircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <DashboardIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                    Dashboard Overview
                </Typography>
            </Box>

            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />

            <CountCards />

            <WarehouseGauge />
        </Box>
    );
}
