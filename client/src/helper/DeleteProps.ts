export const DeleteProps = (object: any, props: string[]): void => {
	if (Array.isArray(object)) {
		object.map((data) => {
			props.map((prop) => {
				if (data.prop && data.prop !== "") delete data[prop];
			});
		});
	}
	else {
		props.map((prop) => {
			if (object.prop && object.prop !== "") delete object[prop];
		});
	}
};
