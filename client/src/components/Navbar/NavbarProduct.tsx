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
import { useTheme } from "@mui/material/styles";

type NavPage = {
	name: string;
	admin?: boolean;
};

const pages: NavPage[] = [
	{ name: "Catálogos" },
	{ name: "Categorías" },
	{ name: "Dudas" },
];

const userSettings: NavPage[] = [{ name: "Perfil" }, { name: "Configuración" }];

const NavbarProduct = () => {
	const theme = useTheme();

	// These are the anchor HTML elements where the submenus display.
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

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
							<Box>
								<Button
									onClick={handleOpenNavMenu}
									sx={{ color: theme.palette.text.primary }}
								>
									Productos
									<ArrowDropDown />
								</Button>
								<Menu
									sx={{ mt: "45px" }}
									id="menu-nav"
									anchorEl={anchorElNav}
									anchorOrigin={{ vertical: "top", horizontal: "right" }}
									keepMounted
									transformOrigin={{ vertical: "top", horizontal: "right" }}
									open={Boolean(anchorElNav)}
									onClose={handleCloseNavMenu}
								>
									<MenuItem key="productos" onClick={handleCloseUserMenu}>
										<NavLink
											to="/productos"
											style={{
												color: theme.palette.text.primary,
												textDecoration: "none",
											}}
										>
											<Typography textAlign="center">Productos</Typography>
										</NavLink>
									</MenuItem>
									<MenuItem key="imagen" onClick={handleCloseUserMenu}>
										<NavLink
											to="/productos/imagen"
											style={{
												color: theme.palette.text.primary,
												textDecoration: "none",
											}}
										>
											<Typography textAlign="center">Imagen</Typography>
										</NavLink>
									</MenuItem>
								</Menu>
							</Box>
							{pages.map((page) => (
								<NavLink
									key={page.name}
									to={`/productos/${page.name
										.toLowerCase()
										.split(/ +/)
										.join("-")}`}
									style={{ textDecoration: "none" }}
								>
									<Button sx={{ color: theme.palette.text.primary }}>
										{page.name}
									</Button>
								</NavLink>
							))}
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
								sx={{ mt: "45px" }}
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

export default NavbarProduct;
