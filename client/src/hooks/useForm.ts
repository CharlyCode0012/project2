import React, { useState } from "react";

export function useForm<T>(initialForm: T, dataToEdit?: T) {
	const [form, setForm] = useState<T>(dataToEdit ?? initialForm);

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value,
		});
	}

	function setInfo<T>(data: T extends React.SetStateAction<T> ? any : any) {
		setForm(data);
	}

	return {
		form,
		handleChange,
		setInfo,
	};
}
