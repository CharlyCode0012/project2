import React, { useState, useEffect, createContext } from "react";
import { useLocalStorage } from "usehooks-ts";

import { useLocation, useNavigate } from "react-router-dom";
import { User } from "models/User";
import { useReadLocalStorage } from "usehooks-ts";

interface CurrentUserContextType {
	username?: string;
	logIn: User | null;
	handleLogin: (user: User | null) => void;
}

const defaultState = {
	username: "",
	logIn: {
		id: "",
		name: "",
		date_B: new Date("Jan 17, 2003"),
		cel: "",
		e_mail: "",
		pass: "",
		type_use: "",
	},
	handleLogin: (user: User | null) => {},
};

const LoginContext = createContext<CurrentUserContextType>(defaultState);

interface LoginProviderProps {
	children: React.ReactNode;
}

const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
	const [logIn, setLogIn] = useLocalStorage<User | null>("log_in", null);

	const navigate = useNavigate();
	const location = useLocation();

	function handleLogin(user: User | null): void {
		setLogIn(user);
	}

	useEffect(() => {
		const { pathname } = location;

		if (!logIn) navigate("/", { replace: true });
		else if (pathname === "/") navigate("/inicio", { replace: true });

		return () => {
			// cookies.remove("log_in");
		};
	}, []);

	const data = {
		logIn,
		handleLogin,
	};
	return <LoginContext.Provider value={data}>{children}</LoginContext.Provider>;
};

export { LoginProvider };

export default LoginContext;
