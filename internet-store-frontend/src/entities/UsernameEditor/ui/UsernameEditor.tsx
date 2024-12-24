import React from 'react';
import { Editor, EditorState, DraftHandleValue, RichUtils } from 'draft-js';
import { applyStyleToUsername } from '../utils/applyStyleToUsername';
import { UsernameEditorProps } from '../../../interfaces';


export const UsernameEditor: React.FC<UsernameEditorProps> = ({ editorState, onChange }) => {
  const handleKeyCommand = (command: string, state: EditorState): DraftHandleValue => {
    if (command === 'bold') {
      const newState = RichUtils.toggleInlineStyle(state, 'BOLD');
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleChange = (newState: EditorState) => {
    const styledState = applyStyleToUsername(newState);
    onChange(styledState);
  };

  return (
		<Editor
			editorState={editorState}
			onChange={handleChange}
			handleKeyCommand={handleKeyCommand}
			customStyleMap={{
				USERNAME_STYLE: {
					color: '#492DBB',
				},
			}}
		/>
  );
};
