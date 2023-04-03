import React, { useState, useEffect, createContext } from "react";
import { instance } from "../helper/API";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { User } from "models/User";

interface CurrentUserContextType {
	username?: string;
	success?: User;
}

const defaultState = {
	username: "",
	success: {
		id: "",
		name: "",
		date_B: new Date("Jan 17, 2003"),
		cel: "",
		e_mail: "",
		pass: "",
		type_use: false,
	},
};

const LoginContext = createContext<CurrentUserContextType>(defaultState);

interface LoginProviderProps {
	children: React.ReactNode;
}

const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
	const [currentUser, setCurrentUser] =
		useState<CurrentUserContextType>(defaultState);

	const navigate = useNavigate();
	useEffect(() => {
		const cookies = new Cookies();

		if (!cookies.get("user") || cookies.get("user") === undefined)
			navigate("/", { replace: true });
		else {
			if (cookies.get("user")) {
				console.log(cookies.get("user"));
				setCurrentUser({ ...currentUser, success: cookies.get("user") });
			}
		}
	}, []);
	return (
		<LoginContext.Provider value={currentUser}>
			{children}
		</LoginContext.Provider>
	);
};

export { LoginProvider };
