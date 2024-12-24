import { EditorState, Modifier, SelectionState, ContentBlock } from 'draft-js';


export const applyStyleToUsername = (editorState: EditorState): EditorState => {
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();
  const selectionState = editorState.getSelection();

  let newContentState = contentState;

  blockMap.forEach((block, blockKey) => {
    if (!block || !blockKey) return;

    const text = (block as ContentBlock).getText();

    const blockSelection = SelectionState.createEmpty(blockKey).merge({
      anchorOffset: 0,
      focusOffset: text.length,
    });

    newContentState = Modifier.removeInlineStyle(newContentState, blockSelection, 'USERNAME_STYLE');

    const regex = /@[a-zA-Zа-яА-ЯёЁ0-9_]+(?=\s|$)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      const selection = SelectionState.createEmpty(blockKey).merge({
        anchorOffset: start,
        focusOffset: end,
      });

      newContentState = Modifier.applyInlineStyle(newContentState, selection, 'USERNAME_STYLE');
    }
  });

  const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
  return EditorState.forceSelection(newEditorState, selectionState);
};
