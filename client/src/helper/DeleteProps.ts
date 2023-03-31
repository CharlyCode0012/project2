export const DeleteProps = (object: any, props: string[]): void => {
	props.map((prop) => {
		delete object[prop];
	});
};
