import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/Navbar/Navbar";
import {
	Box,
	Container,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
} from "@mui/material";
import { AddCircle, DeleteForever, Edit } from "@mui/icons-material";
import Modal from "@/Modal/Modal";
import { useSnackbar } from "notistack";
import { instance } from "helper/API";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
import { User } from "models/User";
import UserForm from "./UsuariosForm";
import { useReadLocalStorage } from "usehooks-ts";
import { useTheme } from "@mui/material/styles";

const Usuarios = () => {
	/**
	 * Displays notifications to the user
	 */
	const { enqueueSnackbar } = useSnackbar();
	const theme = useTheme();

	/**
	 * Headers that will be displayed to the table
	 */
	const tableHeaders = [
		"ID",
		"Nombre",
		"Fecha de nacimiento",
		"Tipo",
		"Correo",
		"Contraseña",
		"Celular",
	];

	/**
	 * Options that the user can select to filter the data
	 * that is displayed in the table
	 */
	const searchOptions = ["ID", "Nombre"];

	/**
	 * Saves the users stored in the DB
	 * and displays them in the table
	 */
	const [users, setUsers] = useState<User[]>([]);

	/**
	 * Determines if the users's modal will be shown
	 * (only when user creates or edits a user)
	 */
	const [showFormModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);

	/**
	 * Keeps track of the user that the user wanted to
	 * edit (stays null when user creates a new user)
	 */
	const selectedUserToEdit = useRef<User | boolean>(false);
	const userLogin: User | null = useReadLocalStorage("log_in");
	const typeUser: string | undefined = userLogin?.type_use;
	const isSeller: boolean = typeUser === "vendedor" ? true : false;
	/**
	 * When rendered, users are obtained from DB and displayed in the table
	 */
	useEffect(() => {
		fetchUsers();
	}, []);

	/**
	 * Fetches users from the DB
	 * Shows a notification to user when something went wrong
	 */
	async function fetchUsers() {
		try {
			const { data: users } = await instance.get<User[]>("/users");
			setUsers(users);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los usuarios", {
				variant: "error",
			});
		}
	}

	/**
	 * Gets called when a user was created or edited, closes the modal,
	 * notifies the user and refreshes the table
	 *
	 * @param wasAnUpdate changes the notification message depending on the action (created / edited)
	 */
	function onUserSubmitted(wasAnUpdate: boolean) {
		closeFormModal();
		enqueueSnackbar(
			wasAnUpdate ? "Se actualizó con éxito" : "Se creo con éxito",
			{ variant: "success" }
		);
		fetchUsers();
	}

	/**
	 * When called, establishes that there is nothing to edit
	 * (as a new one is being created) and opens the modal
	 */
	function createUser() {
		selectedUserToEdit.current = false;
		openFormModal();
	}

	/**
	 * When called, establishes that there is a user edit
	 * keeps it's reference and opens the modal so it can access
	 * the info of the about-to-edit user
	 */
	function editUser(user: User) {
		selectedUserToEdit.current = user;
		openFormModal();
	}

	/**
	 * Calls the server to delete the given user
	 *
	 * @param user data from the user that will be deleted
	 */
	async function deleteUser(deletedUser: User) {
		try {
			await instance.delete(`/users/${deletedUser.id}`);
			enqueueSnackbar("Usuario eliminado con exito", { variant: "success" });
			setUsers((users) => users.filter((user) => user.id !== deletedUser.id));
		}
		catch {
			enqueueSnackbar("No se pudo eliminar", { variant: "error" });
		}
	}

	/**
	 * Retrieves specific users from the DB, depending on the
	 * filter and search of the user
	 *
	 * @param filter what field will be used to filter
	 * @param search what the user is searching
	 * @param order either ASC or DESC
	 */
	async function onSubmitSearch(
		filter: string,
		search: string,
		order: QueryOrder
	) {
		try {
			let users: User[];

			switch (filter) {
			case "ID":
				users = (
					await instance.get<User[]>("/users/searchByID", {
						params: { order, search },
					})
				).data;
				break;

			case "Nombre":
				users = (
					await instance.get<User[]>("/users/searchByName", {
						params: { order, search },
					})
				).data;
				break;

			default:
				users = (await instance.get<User[]>("/users", { params: { order } }))
					.data;
			}

			setUsers(users);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los usuarios", {
				variant: "error",
			});
		}
	}

	return (
		<>
			<Navbar />

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

						<h1>Usuarios</h1>

						{showFormModal && (
							<Modal
								open={showFormModal}
								handleOpen={setShowModal}
								title={
									selectedUserToEdit.current instanceof Object
										? "Editar un usuario"
										: "Añadir un usuario"
								}
							>
								<UserForm
									onSubmit={onUserSubmitted}
									userData={
										selectedUserToEdit.current instanceof Object
											? selectedUserToEdit.current
											: undefined
									}
								></UserForm>
							</Modal>
						)}

						<TableContainer
							sx={{ width: "1000px", maxHeight: "400px" }}
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
									</TableRow>
								</TableHead>

								<TableBody>
									{!(users?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										users?.map((user) => (
											<TableRow key={user.id}>
												<TableCell align="left">{user.id}</TableCell>
												<TableCell align="left">{user.name}</TableCell>
												<TableCell align="left">
													{user.date_B.toString()}
												</TableCell>
												<TableCell align="left">
													{user.type_use[0].toUpperCase() +
														user.type_use.slice(1)}
												</TableCell>
												<TableCell align="left">{user.e_mail}</TableCell>
												<TableCell align="left">{user.pass}</TableCell>
												<TableCell align="left">{user.cel}</TableCell>
												{isSeller && (
													<TableCell align="center">
														{user.type_use !== "vendedor" ? (
															<>
																<IconButton
																	sx={{ color: theme.palette.text.primary }}
																	onClick={() => editUser(user)}
																>
																	<Edit fontSize="inherit" />
																</IconButton>
																<IconButton
																	sx={{ color: theme.palette.text.primary }}
																	onClick={() => deleteUser(user)}
																>
																	<DeleteForever fontSize="inherit" />
																</IconButton>
															</>
														) : (
															<></>
														)}
													</TableCell>
												)}
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>
						{isSeller && (
							<IconButton
								sx={{
									alignSelf: "flex-start",
									fontSize: "40px",
									padding: "0px",
									color: theme.palette.text.primary,
								}}
								onClick={() => createUser()}
							>
								<AddCircle fontSize="inherit" />
							</IconButton>
						)}
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default Usuarios;
