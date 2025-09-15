import {Box, Card, Typography} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

const WeeklyTimeCard = (props) => {
    return <Card
        sx={{
            padding: "2rem 1.5rem",
            border: "solid rgba(108, 115, 108, 0.2)",
            boxShadow: "unset",
            borderRadius: "1.5rem",
            borderWidth: "0.1rem",
            display: "flex",
            flexDirection: "column",
            rowGap: "0.3rem",
            height: "fit-content"
        }}
    >
        <Box
            sx={{
                display: "flex",
                color: "gray",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Typography sx={{fontWeight: 500}}>Last Restock</Typography>
            <InventoryIcon/>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Typography variant="h4" sx={{ fontSize: { xs: "1.4rem", md: "2rem" } }}>
          <b>{lastRestock?.lastRestockDate || "No restock data"}</b>
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            fontSize: { xs: "1.2rem", md: "1.5rem" },
            color: "text.secondary"
          }}
        >
          <b>{lastRestock?.lastRestockQuantity ?? "0"} Items</b>
        </Typography>
        </Box>
        
        {/*<div
            className="hidden md:block w-[100%] min-h-[16rem] pt-[1rem]"
        >
            <ResponsiveContainer width="100%" height="100%" minWidth="12rem" minHeight="14rem">
                <BarChart data={props.data}>
                    <XAxis
                        dataKey="name"
                        tick={{fontSize: "0.75rem"}} // Adjust tick font size
                    />
                    <YAxis
                        tick={{fontSize: "0.75rem"}} // Adjust tick font size
                    />
                    <Tooltip/>
                    <Bar dataKey="value" fill="#8884d8"/>
                </BarChart>
            </ResponsiveContainer>
        </div>*/}
    </Card>;
}

export default WeeklyTimeCard;