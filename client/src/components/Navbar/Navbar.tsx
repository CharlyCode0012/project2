import React, { useState } from "react";
import {
	AppBar,
	Box,
	Button,
	Container,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import { AccountCircle, ArrowDropDown, Home } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { ButtonTheme } from "@/Theme/ButtonTheme";
import { useReadLocalStorage } from "usehooks-ts";
import { User } from "models/User";
import { useTheme } from "@mui/material/styles";

type NavPage = {
	name: string;
	admin?: boolean;
};

const pages: NavPage[] = [{ name: "Productos" }, { name: "Pedidos" }];

const navSettings: NavPage[] = [
	{ name: "Lugares de Entrega" },
	{ name: "Métodos de Pago" },
];

const userSettings: NavPage[] = [{ name: "Perfil" }, { name: "Configuración" }];

const Navbar = () => {
	// These are the anchor HTML elements where the submenus display.
	const theme = useTheme();

	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const userLogin: User | null = useReadLocalStorage("log_in");
	const typeUser: string | undefined = userLogin?.type_use;
	const isAdmin: boolean =
		typeUser === "admin" || typeUser === "vendedor" ? true : false;
	const isSeller = typeUser === "vendedor" ? true : false;
	// Submenus open and close handlers.
	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<Box component="nav" sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Container maxWidth="xl">
					<Toolbar variant="dense" disableGutters>
						<NavLink to="/inicio">
							<IconButton size="large" edge="start" aria-label="inicio">
								<Home sx={{ color: theme.palette.text.primary }} />
							</IconButton>
						</NavLink>

						{/* Maps each page to a <NavLink /> with an href of 'pages-name-with-dashes'. */}
						<Box sx={{ flexGrow: 1, display: "flex" }}>
							{pages.map((page) => (
								<NavLink
									key={page.name}
									to={`/${page.name.toLowerCase().split(/ +/).join("-")}`}
									style={{ textDecoration: "none" }}
								>
									<Button sx={{ color: theme.palette.text.primary }}>
										{page.name}
									</Button>
								</NavLink>
							))}

							{isSeller && (
								<>
									<NavLink to="/análisis" style={{ textDecoration: "none" }}>
										<Button sx={{ color: theme.palette.text.primary }}>
											Análasis
										</Button>
									</NavLink>
									<NavLink to="/usuarios" style={{ textDecoration: "none" }}>
										<Button sx={{ color: theme.palette.text.primary }}>
											Usuarios
										</Button>
									</NavLink>
								</>
							)}
							{isAdmin && (
								<Box>
									<Button
										onClick={handleOpenNavMenu}
										sx={{ color: theme.palette.text.primary }}
									>
										Otros
										<ArrowDropDown />
									</Button>
									<Menu
										sx={{ mt: "45px", colo: theme.palette.text.primary }}
										id="menu-nav"
										anchorEl={anchorElNav}
										anchorOrigin={{ vertical: "top", horizontal: "right" }}
										keepMounted
										transformOrigin={{ vertical: "top", horizontal: "right" }}
										open={Boolean(anchorElNav)}
										onClose={handleCloseNavMenu}
									>
										{navSettings.map((page) => (
											<MenuItem key={page.name} onClick={handleCloseUserMenu}>
												<NavLink
													to={`/${page.name
														.toLowerCase()
														.split(/ +/)
														.join("-")}`}
													style={{
														color: theme.palette.text.primary,
														textDecoration: "none",
													}}
												>
													<Typography textAlign="center">
														{page.name}
													</Typography>
												</NavLink>
											</MenuItem>
										))}
									</Menu>
								</Box>
							)}
						</Box>

						{/* Mapping each page in the user's submenu. */}
						<Box sx={{ flexGrow: 0 }}>
							<Tooltip title="Mas Opciones">
								<IconButton
									size="large"
									edge="end"
									onClick={handleOpenUserMenu}
								>
									<AccountCircle sx={{ color: theme.palette.text.primary }} />
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: "45px", color: theme.palette.text.primary }}
								id="menu-user"
								anchorEl={anchorElUser}
								anchorOrigin={{ vertical: "top", horizontal: "right" }}
								keepMounted
								transformOrigin={{ vertical: "top", horizontal: "right" }}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								{userSettings.map((page) => (
									<MenuItem key={page.name} onClick={handleCloseUserMenu}>
										<NavLink
											to={`/${page.name.toLowerCase().split(/ +/).join("-")}`}
											style={{
												color: theme.palette.text.primary,
												textDecoration: "none",
											}}
										>
											<Typography textAlign="center">{page.name}</Typography>
										</NavLink>
									</MenuItem>
								))}
							</Menu>
						</Box>
						<ButtonTheme />
					</Toolbar>
				</Container>
			</AppBar>
		</Box>
	);
};

export default Navbar;
