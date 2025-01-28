export const refactorText = (text: string) => {
	return text.length > 32 ? `${text.slice(0, 32)}...` : text;
};
