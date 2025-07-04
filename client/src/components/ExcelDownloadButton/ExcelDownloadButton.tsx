import Button from "@mui/material/Button";
import { instance } from "helper/API";
import React from "react";
import { useSnackbar } from "notistack";

export interface ExcelDownloadButtonProps {
	apiObjective: string;
	onDownload: () => void;
}

const ExcelDownloadButton: React.FC<ExcelDownloadButtonProps> = ({
	apiObjective,
	onDownload,
}) => {
	/**
	 * Displays notifications to the user
	 */
	const { enqueueSnackbar } = useSnackbar();

	/**
	 * Calls the route to download the file from the given
	 * objective
	 */
	async function downloadFile() {
		try {
			let response;
			if (apiObjective.includes(":")) {
				const endpoint = apiObjective.split(":");

				response = await instance.get(`/${endpoint[0]}/download`, {
					params: { info: endpoint[1] },
					responseType: "blob",
				});
			}
			else {
				response = await instance.get(`/${apiObjective}/download`, {
					responseType: "blob",
				});
			}

			// Get the Excel filename returned by the server
			const contentDispositionHeader = response.headers[
				"content-disposition"
			] as string;
			const filenameMatches = contentDispositionHeader.match(/"[^"]*"/g);
			const filename = filenameMatches
				? filenameMatches[0].slice(1, -1)
				: "Informacion.xlsx";

			// Download the file using an anchor tag element as the way-to-achieve-it
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.setAttribute("href", url);
			link.setAttribute("download", filename);
			document.body.appendChild(link);
			link.click();

			enqueueSnackbar("Se descargó con exito", { variant: "success" });
			onDownload(); // Enable file submission
		}
		catch (error) {
			console.log(error);
			enqueueSnackbar("Hubo un error al descargar el archivo", {
				variant: "error",
			});
		}
	}

	return (
		<>
			<Button color="secondary" variant="contained" onClick={downloadFile}>
				Descargar
			</Button>
		</>
	);
};

export default ExcelDownloadButton;
