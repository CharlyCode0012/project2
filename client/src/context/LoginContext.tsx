import React, { useState, useEffect, createContext } from "react";
import { useSessionStorage } from "usehooks-ts";
import Cookies from "universal-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "models/User";

interface CurrentUserContextType {
	username?: string;
	success?: User;
	handleLogin?: (user: User) => void;
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
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	const [logIn, setLogIn] = useSessionStorage<User | null>("log_in", null);

	const navigate = useNavigate();
	const location = useLocation();

	function handleLogin(user: User): void {
		setLogIn(user);
	}

	useEffect(() => {
		const cookies = new Cookies();
		const user = cookies.get<User>("user");

		console.log("log_in: ", logIn);

		const { pathname } = location;
		console.log(pathname);

		if ((!user || user === undefined) && !logIn)
			navigate("/", { replace: true });
		else {
			if (pathname === "/") navigate("/inicio", { replace: true });

			if (user) {
				console.log(user);
				setCurrentUser(user);
			}
		}
		return () => {
			// cookies.remove("log_in");
		};
	}, []);

	const data = {
		currentUser,
		handleLogin,
	};
	return <LoginContext.Provider value={data}>{children}</LoginContext.Provider>;
};

export { LoginProvider };
