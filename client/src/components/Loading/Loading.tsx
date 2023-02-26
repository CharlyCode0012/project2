import { Box, CircularProgress } from "@mui/material";
import React from "react";

const Loading: React.FC = () => (
	<Box
		sx={{
			position: "absolute",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			width: "100vw",
			height: "100vh",
			backgroundColor: "rgb(0, 0, 0, .60)",
		}}
	>
		<CircularProgress sx={{ color: "white" }} />
	</Box>
);
export default Loading;
