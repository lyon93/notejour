const getCurrentSelection = () => {
  return window.getSelection();
};

const hasSelection = () => {
  return getCurrentSelection().rangeCount > 0;
};

const getCurrentRange = () => {
  const selection = getCurrentSelection();
  return selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
};

const createRange = () => {
  return document.createRange();
};

const setCursorPosition = ({ element, position = 'end' }) => {
  const range = createRange();
  const selection = getCurrentSelection();
  
  if (position === 'end') {
    range.setStart(element, element.childNodes.length);
  } else if (position === 'start') {
    range.setStart(element, 0);
  }
  
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};

const setCursorBeforeElement = (element) => {
  const range = createRange();
  const selection = getCurrentSelection();
  range.setStartBefore(element);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};

const insertElementAtCursor = (element) => {
  if (!hasSelection()) return false;

  try {
    const range = getCurrentRange().cloneRange();
    range.collapse(false);
    range.insertNode(element);
    setCursorBeforeElement(element);
    return true;
  } catch (error) {
    console.error("Failed to insert element at cursor:", error);
    return false;
  }
};

const getCurrentParentElement = () => {
  if (!hasSelection()) return null;

  const range = getCurrentRange();
  let node = range.startContainer;

  // If the node is a text node, go up to the parent
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentNode;
  }

  return node;
};

const clearSelection = () => {
  getCurrentSelection().removeAllRanges();
};

// Export all functions
export {
  getCurrentSelection,
  hasSelection,
  getCurrentRange,
  createRange,
  setCursorPosition,
  setCursorBeforeElement,
  insertElementAtCursor,
  getCurrentParentElement,
  clearSelection,
};

// Default export for convenience
export default {
  getCurrentSelection,
  hasSelection,
  getCurrentRange,
  createRange,
  setCursorPosition,
  setCursorBeforeElement,
  insertElementAtCursor,
  getCurrentParentElement,
  clearSelection,
};