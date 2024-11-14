import React, { useState, useRef, useEffect } from 'react';
import styles from './FormForSendNewCommentReview.module.css';
import classNames from 'classnames';


interface FormForSendNewCommentReviewProps {
  onClose: () => void;
  onSubmit: (commentText: string, images: File[]) => void;
  isReplyToComment?: boolean;
  username?: string;
  isReview?: boolean;
}


const FormForSendNewCommentReview: React.FC<FormForSendNewCommentReviewProps> = ({ onClose, onSubmit, isReplyToComment, username, isReview }) => {
  const [commentText, setCommentText] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isReplyToComment && username && textAreaRef.current) {
      textAreaRef.current.innerHTML = `<span class="${styles.answerUsername}" contentEditable="false">@${username}</span>: `;
    }
  }, [isReplyToComment, username]);

  const handleChange = () => {
    if (textAreaRef.current) {
      let currentText = textAreaRef.current.innerHTML;
      if (isReplyToComment && username && !currentText.includes(username)) {
        currentText = `<span class="${styles.answerUsername}" contentEditable="false">${username}</span>: ` + currentText;
      }

      setCommentText(currentText);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setImages((prevImages) => [...prevImages, ...Array.from(files)]);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (commentText.trim() === '') {
      return;
    }

    const finalCommentText = isReplyToComment && username
      ? `${commentText.replace(/<[^>]*>/g, '')}`
      : commentText.replace(/<[^>]*>/g, '');
    onSubmit(finalCommentText, images);

    setCommentText('');
    setImages([]);
    onClose();
  };

  return (
    <div className={styles.replyForm}>
      <div
        ref={textAreaRef}
        className={classNames(
          styles.commentTextArea,
          { [styles.commentTextAreaReview]: isReview }
        )}
        contentEditable
        onInput={handleChange}
      />

      <div className={styles.imageUpload}>
        <img
          src="/product/addPhoto.svg"
          alt="Upload Image"
          className={styles.uploadImage}
          onClick={handleImageClick}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className={styles.fileInput}
          style={{ display: 'none' }}
        />

        <div className={styles.imagePreview}>
          {images.length > 0 && images.map((image, index) => (
            <div key={index} className={styles.imageContainer}>
              <img
                src={URL.createObjectURL(image)}
                alt={`uploaded-${index}`}
                className={styles.previewImage}
              />
              <div className={styles.removeImageButton} onClick={() => handleImageRemove(index)}>
                <span className={styles.removeImageIcon}>✖️</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.buttons}>
        <button
					className={classNames(
						styles.cancelButton,
						styles.button,
						{ [styles.buttonReview]: isReview }
					)}
					onClick={onClose}
					>
						Отмена
					</button>

        <button
					className={classNames(
						styles.submitButton,
						styles.button,
						{[styles.buttonReview]: isReview}
					)}
					onClick={handleSubmit}
				>
					Отправить
				</button>
      </div>
    </div>
  );
};


export default FormForSendNewCommentReview;
