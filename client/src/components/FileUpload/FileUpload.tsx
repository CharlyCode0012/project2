import { Box, Button, Chip } from "@mui/material";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";

export interface FileUploadProps {
	apiObjective: string;
	disabled: boolean;
	onUpload: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
	apiObjective,
	onUpload,
	disabled,
}) => {
	const { enqueueSnackbar } = useSnackbar();
	const theme = useTheme();
	const [filename, setFilename] = useState("");

	function updateFilename(event: React.ChangeEvent<HTMLInputElement>) {
		setFilename(event.target.value.split("\\").pop() ?? "Selected File.xlsx");
	}

	async function uploadFile(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		try {
			if (apiObjective.includes(":")) {
				const endpoint = apiObjective.split(":");
				await instance.post(`/${endpoint[0]}/upload`, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
					params: {
						info: endpoint[1],
					},
				});
			}
			else {
				await instance.post(`/${apiObjective}/upload`, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
			}

			enqueueSnackbar("Se subió con exito el archivo", { variant: "success" });
			onUpload();
		}
		catch (error) {
			console.log(error);
			enqueueSnackbar("Algo salió mal", { variant: "error" });
		}
	}

	const disabledColor = theme.palette.mode === "dark" ? "#bbb" : "#ddd";

	return (
		<Box
			component="form"
			sx={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				gap: "10px",
				color: theme.palette.text.secondary,
			}}
			onSubmit={uploadFile}
		>
			<input
				accept=".xlsx, .xls"
				name="excel_file"
				id="file-input"
				type="file"
				hidden
				onChange={updateFilename}
			/>
			<label htmlFor="file-input">
				<Box
					sx={{
						backgroundColor: disabled ? disabledColor : "inherit",
						p: 1,
						borderRadius: 1,
						color: theme.palette.text.primary,
					}}
				>
					<Button
						variant="outlined"
						component="span"
						disabled={disabled}
						sx={{
							outlineColor: theme.palette.text.secondary,
							color: theme.palette.text.secondary,
						}}
					>
						Seleccionar un archivo excel
					</Button>
				</Box>
			</label>

			{filename !== "" ? <Chip variant="outlined" label={filename} /> : <></>}

			<Box
				sx={{
					backgroundColor: disabled ? disabledColor : "inherit",
					p: 1,
					borderRadius: 1,
				}}
			>
				<Button type="submit" variant="contained" disabled={disabled}>
					Subir archivo
				</Button>
			</Box>
		</Box>
	);
};

export default FileUpload;
