class CursorManager {
  constructor() {
    this.selection = window.getSelection();
  }

  getCurrentSelection() {
    return window.getSelection();
  }

  hasSelection() {
    return this.getCurrentSelection().rangeCount > 0;
  }

  getCurrentRange() {
    const selection = this.getCurrentSelection();
    return selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  }

  createRange() {
    return document.createRange();
  }

  setCursorPosition({element, position = 'end'}) {
    const range = this.createRange();
    const selection = this.getCurrentSelection();
    
    if (position === 'end') {
      range.setStart(element, element.childNodes.length);
    } else if (position === 'start') {
      range.setStart(element, 0);
    }
    
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  setCursorBeforeElement(element) {
    const range = this.createRange();
    const selection = this.getCurrentSelection();
    range.setStartBefore(element);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  insertElementAtCursor(element) {
    if (!this.hasSelection()) return false;

    try {
      const range = this.getCurrentRange().cloneRange();
      range.collapse(false);
      range.insertNode(element);
      this.setCursorBeforeElement(element);
      return true;
    } catch (error) {
      console.error("Failed to insert element at cursor:", error);
      return false;
    }
  }

  getCurrentParentElement() {
    if (!this.hasSelection()) return null;

    const range = this.getCurrentRange();
    let node = range.startContainer;

    // If the node is a text node, go up to the parent
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    return node;
  }

  clearSelection() {
    this.getCurrentSelection().removeAllRanges();
  }
}

export default CursorManager;