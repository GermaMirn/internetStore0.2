import styles from '../ReviewCommentData.module.css'


export const formatCommentText = (commentText: string) => {
	const match = commentText.match(/@([a-zA-Z0-9_а-яА-ЯёЁ]+):/);
	if (match && match.index !== undefined) {
		const userName = match[1];
		const message = commentText.substring(match.index + match[0].length);
		return (
			<span>
				<span className={styles.userNameReview}>{userName}:</span> {message}
			</span>
		);
	}
	return <span>{commentText}</span>;
};
