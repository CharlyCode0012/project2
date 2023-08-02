import { Edit } from "@mui/icons-material";
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
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { Question } from "models/Question";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
import Modal from "@/Modal/Modal";
import DudasForm from "./DudasForm";

import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import NavbarProduct from "@/Navbar/NavbarProduct";
import { useTheme } from "@mui/material/styles";

const Dudas: React.FC = () => {
	const url = "/questions";
	const theme = useTheme();

	const { enqueueSnackbar } = useSnackbar();

	const [questions, setQuestions] = useState<Question[]>([]);

	const [showModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);

	const selectedQuestionToAnswer = useRef<Question | boolean>(false);

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = ["ID", "Cliente", "Producto ID", "Producto", "Pregunta"];

	const searchOptions = ["Cliente", "Producto"];

	/**
	 * Determines if some admin action buttons will be
	 * displayed in the table too
	 */

	// console.log(isAdmin);
	// TODO:

	useEffect(() => {
		fetchQuestion();
	}, []);

	async function fetchQuestion() {
		try {
			const { data: questions } = await instance.get<Question[]>(url, {
				params: { order: "ASC" },
			});
			setQuestions(questions);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar las dudas", {
				variant: "error",
			});
		}
	}

	function onQuestionSubmitted(wasUpdates: boolean) {
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

	async function deleteQuestion(question: Question) {
		const { id } = question;
		const deletedQuestionID: number = id;
		// TODO: Display loader

		const endpoint = `${url}/${deletedQuestionID}`;

		try {
			console.log(`delete endpoint: ${endpoint}`);
			await instance.delete(endpoint);
			setQuestions((questions) =>
				questions.filter((question) => question.id !== deletedQuestionID)
			);
		}
		catch (error: any) {
			console.log(error);
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
			case "Cliente":
				Dudas = (
					await instance.get<Question[]>("/questions/searchByClientID", {
						params: { order, search },
					})
				).data;
				break;

			case "Producto":
				Dudas = (
					await instance.get<Question[]>("/questions/searchByProduct", {
						params: { order, search },
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
			enqueueSnackbar("Hubo un error al mostrar las dudas", {
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
								title="Formulario dudas"
							>
								<DudasForm
									onSubmit={onQuestionSubmitted}
									questionData={
										selectedQuestionToAnswer.current instanceof Object
											? selectedQuestionToAnswer.current
											: undefined
									}
								></DudasForm>
							</Modal>
						)}
						<TableContainer
							sx={{ width: "800px", maxHeight: "400px" }}
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

										<TableCell />
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
												<TableCell align="left">
													{question.id_client.substring(0, 3) === "521"
														? question.id_client.substring(3)
														: question.id_client}
												</TableCell>
												<TableCell align="left">
													{question.id_product}
												</TableCell>
												<TableCell align="left">
													{question.product_name}
												</TableCell>
												<TableCell align="left">{question.question}</TableCell>

												<TableCell align="center">
													<IconButton
														sx={{ color: theme.palette.text.primary }}
														onClick={() => handleEdit(question)}
													>
														<Edit fontSize="inherit" />
													</IconButton>
												</TableCell>
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
