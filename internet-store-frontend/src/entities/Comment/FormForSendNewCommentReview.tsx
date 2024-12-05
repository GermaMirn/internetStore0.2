import React, { useState, useRef, useEffect } from 'react';
import styles from './FormForSendNewCommentReview.module.css';
import classNames from 'classnames';
import { FormForSendNewCommentReviewProps } from '../../interfaces';


const FormForSendNewCommentReview: React.FC<FormForSendNewCommentReviewProps> = ({ onClose, onSubmit, isReplyToComment, username, isReview }) => {
	const MAX_COMMENT_LENGTH = isReview ? 1550 : 600;
	const MAX_HEIGHT = 10;
  const [commentText, setCommentText] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLDivElement | null>(null);
	const [isKeyDownAllowed, setIsKeyDownAllowed] = useState(false);

  useEffect(() => {
    if (isReplyToComment && username && textAreaRef.current) {
      textAreaRef.current.innerHTML = `<span class="${styles.answerUsername}" contentEditable="false">@${username}</span>: `;
    }
  }, [isReplyToComment, username]);

  const handleChange = () => {
    if (textAreaRef.current) {
			let currentText = textAreaRef.current.innerHTML;

			if (currentText.length > MAX_COMMENT_LENGTH) {
				currentText = currentText.slice(0, MAX_COMMENT_LENGTH);
				textAreaRef.current.innerHTML = currentText;
			}

			setIsKeyDownAllowed(currentText.length === MAX_COMMENT_LENGTH);
			setCommentText(currentText);

			if (textAreaRef.current.scrollHeight > MAX_HEIGHT) {
        textAreaRef.current.style.overflowY = 'auto';
      } else {
        textAreaRef.current.style.overflowY = 'hidden';
      }
		}
  };

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const allowedKeys = ['Backspace', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    if (!allowedKeys.includes(event.key) && (event.key.length === 1 || /[a-zA-Z0-9]/.test(event.key))) {
			event.preventDefault();
    }

		if (event.key === 'Enter' && textAreaRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(textAreaRef.current).lineHeight, 10);
      const maxLines = Math.floor(MAX_HEIGHT / lineHeight);
      const currentLines = Math.floor(textAreaRef.current.scrollHeight / lineHeight);

      if (currentLines >= maxLines) {
        event.preventDefault();
      }
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
				onKeyDown={isKeyDownAllowed ? handleKeyDown : undefined}
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
            styles.submitButton,
            styles.button,
            { [styles.buttonReview]: isReview }
          )}
          onClick={handleSubmit}
        >
          Отправить
        </button>

        <button
          className={classNames(
            styles.cancelButton,
            { [styles.cancelButtonReview]: isReview }
          )}
          onClick={onClose}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};


export default FormForSendNewCommentReview;
