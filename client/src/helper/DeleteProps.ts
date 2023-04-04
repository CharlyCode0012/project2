export const DeleteProps = (object: any, props: string[]): void => {
	if (Array.isArray(object)) {
		object.map((data) => {
			props.map((prop) => {
				delete data[prop];
			});
		});
	}
	else {
		props.map((prop) => {
			delete object[prop];
		});
	}
};
