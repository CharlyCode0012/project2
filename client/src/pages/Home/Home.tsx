import React from "react";

export interface HomeProps {
	something?: any;
}

const Home: React.FC<HomeProps> = () => {
	return <div>Home</div>;
};

export default Home;
