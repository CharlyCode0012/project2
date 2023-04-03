import React from "react";
import {
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	Button,
} from "@mui/material";

interface ModalProps {
	children: React.ReactNode;
	title: string;
	text?: string;
	open: boolean;
	handleOpen: (op: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ children, title, open, handleOpen }) => (
	<Dialog maxWidth="md" open={open} onClose={() => handleOpen(false)}>
		<DialogTitle>
			<Box sx={{ display: "flex" }}>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					{title}
				</Typography>
				<Button
					color="secondary"
					variant="contained"
					sx={{ width: "0px" }}
					onClick={() => handleOpen(false)}
				>
					X
				</Button>
			</Box>
		</DialogTitle>
		<DialogContent>{children}</DialogContent>
	</Dialog>
);

export default Modal;
