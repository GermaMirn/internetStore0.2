import styles from '../ReviewCommentData.module.css';

export const formatCommentText = (commentText: string) => {
  const regex = /(@[a-zA-Z0-9_а-яА-ЯёЁ]+)/g;

  const formattedText = commentText.replace(regex, (match) => {
    return `<span class="${styles.userNameReview}">${match}</span>`;
  });

  return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
};
