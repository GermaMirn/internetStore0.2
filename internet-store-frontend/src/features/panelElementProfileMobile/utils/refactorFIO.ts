import { formatFIOProps } from "../../../interfaces";


export function formatFIO({ fio }: formatFIOProps): string {
	const parts = fio.split(' ');
	const firstName = parts[0];
	const lastName = parts[1] ? parts[1] : '';
	const patronymic = parts[2] ? parts[2] : '';

	const formattedLastNameInitial = lastName ? `${lastName.charAt(0).toUpperCase()}.` : '';
	const formattedPatronymicInitial = patronymic ? `${patronymic.charAt(0).toUpperCase()}.` : '';

	const formattedFIO = `${firstName} ${formattedLastNameInitial}${formattedPatronymicInitial}`;

	return formattedFIO;
}
