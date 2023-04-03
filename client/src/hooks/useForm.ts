import React, { useState } from "react";

export function useForm<T>(initialForm: T, dataToEdit?: T, error = true) {
	const [form, setForm] = useState(dataToEdit ?? initialForm);

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void {
		const { name, value } = e.currentTarget;
		setForm({
			...form,
			[name]: value,
		});
	}

	return {
		form,
		handleChange,
	};
}
