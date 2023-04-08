export const DeleteProps = (object: any, props: string[]): void => {
	if (Array.isArray(object)) {
		object.map((data) => {
			props.map((prop) => {
				if (data.prop !== undefined) delete data[prop];
			});
		});
	}
	else {
		props.map((prop) => {
			if (object !== undefined) delete object[prop];
		});
	}
};
