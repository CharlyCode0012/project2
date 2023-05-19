import { AddCircle, DeleteForever, Edit } from "@mui/icons-material";
import {
	Box,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Container,
	InputLabel,
	FormControl,
	Select,
	MenuItem,
	SelectChangeEvent,
} from "@mui/material";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import { Question } from "models/Question";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
import Modal from "@/Modal/Modal";
import DudasForm from "./DudasForm";
import { useReadLocalStorage } from "usehooks-ts";
import { User } from "models/User";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import ExcelDownloadButton from "@/ExcelDownloadButton/ExcelDownloadButton";
import NavbarProduct from "@/Navbar/NavbarProduct";
import { Catalog } from "models/Menu";

const URL_IMAGE = "http://127.0.0.1:3200/api/images/";

const Dudas: React.FC = () => {
	const url = "/questions";

	const { enqueueSnackbar } = useSnackbar();

	const [questions, setQuestions] = useState<Question[]>([]);
	const selectedQuestionToAnswer = useRef<Question | boolean>(false);
	const catalogId = useRef<string>("");

	const [showModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = ["ID", "Cliente", "Pregunta"];

	const searchOptions = ["Id", "Cliente"];

	/**
	 * Determines if some admin action buttons will be
	 * displayed in the table too
	 */
	const userLogin: User | null = useReadLocalStorage("log_in");
	const typeUser: string | undefined = userLogin?.type_use;
	const isAdmin: boolean =
		typeUser === "admin" || typeUser === "vendedor" ? true : false;

	// console.log(isAdmin);
	// TODO:

	useEffect(() => {
		// fetchQuestion();
	}, []);

	async function fetchQuestion() {
		const cId = catalogId.current;
		try {
			const { data: questions } = await instance.get<Question[]>(url, {
				params: { order: "ASC", catalogId: cId },
			});
			setQuestions(questions);
			enqueueSnackbar("Se mostraron los productos con extio", {
				variant: "success",
			});
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los productos", {
				variant: "error",
			});
		}
	}

	function onProductSubmitted(wasUpdates: boolean) {
		closeFormModal();
		enqueueSnackbar(
			wasUpdates ? "Se actualizo exitosamente" : "Se creo con exito",
			{
				variant: "success",
			}
		);
		fetchQuestion();
	}

	function handleEdit(question: Question) {
		selectedQuestionToAnswer.current = question;
		openFormModal();
	}

	async function deleteProduct(question: Question) {
		const { id } = question;
		const deletedProductID: number = id;
		// TODO: Display loader

		const endpoint = `${url}/${deletedProductID}`;

		try {
			console.log(`delete endpoint: ${endpoint}`);

			const res = await instance.delete(endpoint);
			const dataCatalog = await res.data;

			if (dataCatalog?.err) {
				const message = dataCatalog?.statusText;
				const status = dataCatalog?.status;
				throw { message, status };
			}
			else {
				const newCatalogs = questions.filter(
					(QuestionD: Question) => QuestionD.id !== deletedProductID
				);
				setQuestions(newCatalogs);
			}
			enqueueSnackbar(`Se elimino exitosamente ${name}`, {
				variant: "success",
			});
		}
		catch (error: any) {
			enqueueSnackbar(`Error al eliminar la ${name}`, { variant: "error" });
			alert(
				`Descripcion del error: ${error.message}\nEstado: ${
					error?.status ?? 500
				}`
			);
		}
	}

	async function onSubmitSearch(
		filter: string,
		search: string,
		order: QueryOrder
	) {
		try {
			let Dudas: Question[];

			switch (filter) {
			case "Nombre":
				Dudas = (
					await instance.get<Question[]>(
						`/questions/productByName/${search}`,
						{
							params: { order },
						}
					)
				).data;
				break;

			case "Estado":
				Dudas = (
					await instance.get<Question[]>(`/questions/productBy/${search}`, {
						params: { order },
					})
				).data;
				break;

			default:
				Dudas = (
					await instance.get<Question[]>(url, {
						params: { order },
					})
				).data;
				break;
			}

			setQuestions(Dudas);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los productos", {
				variant: "error",
			});
		}
	}

	return (
		<>
			<NavbarProduct />
			<Container maxWidth="sm">
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: "10px",
						}}
					>
						<SearchAppBar
							searchOptions={searchOptions}
							onSubmitSearch={onSubmitSearch}
						/>
						<h1>Dudas</h1>
						{showModal && (
							<Modal
								open={showModal}
								handleOpen={setShowModal}
								title="Formulario productos"
							>
								<DudasForm
									onSubmit={onProductSubmitted}
									questionData={
										selectedQuestionToAnswer.current instanceof Object
											? selectedQuestionToAnswer.current
											: undefined
									}
								></DudasForm>
							</Modal>
						)}
						<TableContainer
							sx={{ width: "1100px", maxHeight: "400px" }}
							component={Paper}
							elevation={5}
						>
							<Table>
								<TableHead>
									<TableRow>
										{tableHeaders.map((header) => (
											<TableCell key={header} align="left">
												<TableSortLabel>{header}</TableSortLabel>
											</TableCell>
										))}

										{isAdmin && <TableCell />}
									</TableRow>
								</TableHead>

								<TableBody>
									{!(questions?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										questions?.map((question: Question) => (
											<TableRow key={question.id}>
												<TableCell align="left">{question.id}</TableCell>
												<TableCell align="left">{question.id_client}</TableCell>
												<TableCell align="left">{question.question}</TableCell>
												{isAdmin && (
													<TableCell align="center">
														<IconButton onClick={() => handleEdit(question)}>
															<Edit fontSize="inherit" />
														</IconButton>
													</TableCell>
												)}
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>

						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								gap: "10px",
							}}
						></Box>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default Dudas;
