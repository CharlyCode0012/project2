import { Box, Button, Chip } from "@mui/material";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import React, { useState } from "react";

export interface FileUploadProps {
	apiObjective: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ apiObjective }) => {
	/**
	 * Displays notifications to the user
	 */
	const { enqueueSnackbar } = useSnackbar();

	/**
	 * Keeps track of the name of the file submitted by
	 * the user
	 */
	const [filename, setFilename] = useState("");

	/**
	 * Displays the name of the selected file
	 */
	function updateFilename (event: React.ChangeEvent<HTMLInputElement>) {
		setFilename(event.target.value.split("\\").pop() ?? "Selected File.xlsx");
	}

	/**
	 * Takes the file selected in the form and submits it
	 * to the server, if the info of the file was correct, the table will
	 * update and the page will refresh.
	 * 
	 * Otherwise, an error telling what happened will be displayed
	 * 
	 * @param event contains the info of the file
	 */
	async function uploadFile (event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const data = new FormData();
		const file : File | null = data.get("excel-file") as File;

		try {
			await instance.post(`/${apiObjective}/upload`, file, {
				headers: {
					"Content-Type": file?.type
				}
			});
		}
		catch {
			enqueueSnackbar("Algo salio mal", { variant: "error" });
		}

	}

	return (
		<Box
			component="form"
			sx={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				gap: "10px",
			}}
			onSubmit={uploadFile}
		>
			<input
				accept=".xlsx, .xls"
				name="excel-file"
				id="file-input"
				type="file"
				hidden
				onChange={updateFilename}
			/>
			<label htmlFor="file-input">
				<Button
					variant="outlined"
					color="primary"
					component="span"
				>
					Seleccionar un archivo excel
				</Button>
			</label>
			
			{filename !== "" ? <Chip variant="outlined" label={filename} /> : <></>}

			<Button
				type="submit"
				variant="contained"
				color="primary"
			>
				Subir archivo
			</Button>
		</Box>
	);
};

export default FileUpload;
