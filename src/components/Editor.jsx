import { useState, useEffect, useCallback } from "react";
import EditorWYSIWYG, { Toolbar } from "react-simple-wysiwyg";
import {
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikethrough,
  BtnBulletList,
  BtnNumberList,
  BtnH1,
  BtnH2,
  BtnH3,
  BtnBlockquote,
  Paragraph,
} from "./toolbar/buttons";
import { init, predict, learnFromInput } from "../lib/prediction";
import CursorManager from "../lib/cursor-manager";

const EDITOR_CONTAINER_SELECTOR = ".rsw-editor";
const CONTENT_EDITABLE_SELECTOR = ".rsw-ce";

export default function Editor({ onValue }) {
  const [value, setValue] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [dictionaryLoaded, setDictionaryLoaded] = useState(false);
  const cursorManager = new CursorManager();

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        await init();
        setDictionaryLoaded(true);
      } catch (error) {
        console.error("Failed to load dictionary:", error);
      }
    };

    loadDictionary();
  }, []);

  const onChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onValue(newValue);

    if (dictionaryLoaded) {
      learnFromInput(newValue);
    }
  };

  const getLastWord = (text) => {
    const words = text.split(/\s+/);
    return words[words.length - 1];
  };

  const showInlineAutoComplete = (remainingChars) => {
    if (!cursorManager.hasSelection() || !remainingChars) return;

    hideInlineAutoComplete();

    const autocompleteElement = document.createElement("span");
    autocompleteElement.id = "inline-autocomplete";
    autocompleteElement.textContent = remainingChars;
    autocompleteElement.style.cssText = `
      color: #9ca3af;
      opacity: 0.6;
      pointer-events: none;
      user-select: none;
    `;

    const success = cursorManager.insertElementAtCursor(autocompleteElement);
    if (!success) {
      autocompleteElement.remove();
    }
  };

  const hideInlineAutoComplete = () => {
    const existingAutocomplete = document.querySelector("#inline-autocomplete");
    if (existingAutocomplete) {
      existingAutocomplete.remove();
    }
  };

  const handlePrediction = useCallback(() => {
    const editorElement = document.querySelector(CONTENT_EDITABLE_SELECTOR);
    if (!editorElement) return;

    const text = editorElement.textContent || "";
    const lastWord = getLastWord(text);

    if (lastWord && lastWord.length >= 1) {
      const prediction = predict(lastWord);
      if (
        prediction &&
        prediction !== lastWord &&
        prediction.toLocaleLowerCase().startsWith(lastWord.toLocaleLowerCase())
      ) {
        setSuggestion(prediction);
        showInlineAutoComplete(prediction.slice(lastWord.length));
      } else {
        setSuggestion("");
        hideInlineAutoComplete();
      }
    } else {
      setSuggestion("");
      hideInlineAutoComplete();
    }
  }, []); // Add suggestion as dependency since showInlineAutoComplete uses it

  const getCurrentParentElement = () => {
    return cursorManager.getCurrentParentElement();
  };

  const acceptSuggestion = () => {
    const editorElement = document.querySelector(".rsw-ce");

    if (!editorElement || !suggestion) return;

    const selectedParentElement = getCurrentParentElement();
    const targetElement =
      selectedParentElement !== editorElement
        ? selectedParentElement
        : editorElement;

    const currentText = targetElement.textContent || "";
    const lastWord = getLastWord(currentText);

    const isSuggestionValid =
      lastWord && suggestion.toLowerCase().startsWith(lastWord.toLowerCase());

    if (isSuggestionValid) {
      const textWithoutLastWord = currentText.substring(
        0,
        currentText.length - lastWord.length
      );

      targetElement.textContent = textWithoutLastWord + suggestion + " ";

      // Use CursorManager to move cursor to end
      cursorManager.setCursorPosition(targetElement, "end");

      setSuggestion("");
      hideInlineAutoComplete();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault();
      acceptSuggestion();
    } else if (e.key === "Escape") {
      setSuggestion("");
      hideInlineAutoComplete();
    }
  };

  useEffect(() => {
    const editorElement = document.querySelector(EDITOR_CONTAINER_SELECTOR);

    if (editorElement && dictionaryLoaded) {
      editorElement.addEventListener("input", handlePrediction);
      return () => {
        editorElement.removeEventListener("input", handlePrediction);
        hideInlineAutoComplete();
      };
    }
  }, [dictionaryLoaded, handlePrediction]);

  return (
    <div className="relative">
      <EditorWYSIWYG
        placeholder="Give me your thoughts..."
        className="bg-transparent border-none text-white"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      >
        <Toolbar className="rsw-toolbar">
          <BtnH1 />
          <BtnH2 />
          <BtnH3 />
          <Paragraph />
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnStrikethrough />
          <BtnBulletList />
          <BtnNumberList />
          <BtnBlockquote />
        </Toolbar>
      </EditorWYSIWYG>
    </div>
  );
}
