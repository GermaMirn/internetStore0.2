export const refactorText = (text: string) => {
	return text.length > 9 ? `${text.slice(0, 9)}...` : text;
};
