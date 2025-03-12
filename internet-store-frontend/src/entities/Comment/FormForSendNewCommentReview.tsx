import React, { useState, useRef, useEffect } from 'react';
import { EditorState, ContentState, RichUtils } from 'draft-js';
import classNames from 'classnames';
import { UsernameEditor } from '../UsernameEditor/ui/UsernameEditor';
import { useImageUploader } from '../../hooks/useImageUploader';
import { FormForSendNewCommentReviewProps } from '../../interfaces';
import styles from './FormForSendNewCommentReview.module.css';
import { useNotification } from '../../app/providers/notifications/NotificationProvider';


const FormForSendNewCommentReview: React.FC<FormForSendNewCommentReviewProps> = ({
  onClose, onSubmit, isReplyToComment, username, isReview
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { images, handleImageChange, handleImageRemove } = useImageUploader();
  const { showNotification } = useNotification();

  useEffect(() => {
		if (isReplyToComment && username) {
			const contentWithPrefix = `@${username} :`;
			const contentState = ContentState.createFromText(contentWithPrefix);
			let newEditorState = EditorState.createWithContent(contentState);
			newEditorState = RichUtils.toggleInlineStyle(newEditorState, 'USERNAME_STYLE');

			setEditorState(newEditorState);
		}
	}, [isReplyToComment, username]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    const finalCommentText = editorState.getCurrentContent().getPlainText();
    if (!finalCommentText.trim()) {
      showNotification('Поле должно быть заполнено', 'error');
      return;
    }

    onSubmit(finalCommentText, images);
    setEditorState(EditorState.createEmpty());
    onClose();
  };

  return (
    <div className={styles.replyForm}>
      <div  className={classNames(styles.commentTextArea, { [styles.commentTextAreaReview]: isReview })}>
        <UsernameEditor editorState={editorState} onChange={setEditorState} />
      </div>

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
          {images.map((image, index) => (
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
          className={classNames(styles.submitButton, styles.button, { [styles.buttonReview]: isReview })}
          onClick={handleSubmit}
        >
          Отправить
        </button>

        <button
          className={classNames(styles.cancelButton, { [styles.cancelButtonReview]: isReview })}
          onClick={onClose}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};


export default FormForSendNewCommentReview;
