export interface ErrorTitleProps {
  title: string;
	status: string;
}


export interface ErrorMessageProps {
  message: string;
	navigateText?: string;
	navigate?: () => void;
}
