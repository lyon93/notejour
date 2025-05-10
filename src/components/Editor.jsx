import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useState, useRef } from "react";
import { predict } from "../utils/PredictionaryHandler";
import { SoundEffectsManager } from "../lib/SoundEffectsManager";
import { useEffect } from "react";
import DateUtils from "../utils/DateUtils";

function Editor({ blocks, onBlocksChange, chapterDate }) {
  const editor = useCreateBlockNote({
    initialContent: blocks,
  });

  const soundEffectsRef = useRef(null);

  useEffect(() => {
    // Initialize sound effects manager
    soundEffectsRef.current = new SoundEffectsManager();

    return () => {
      // Cleanup if needed
    };
  }, []);
  // State to track the last suggestion
  const [lastSuggestion, setLastSuggestion] = useState(null);

  // Handle changes in the editor
  const handleOnChange = () => {
    onBlocksChange(editor.document);
  };

  const typingTimerRef = useRef(null);

  // Handle key down events for generating, accepting, or rejecting suggestions
  //   const handleKeyDown = () => {
  //     clearTimeout(typingTimerRef.current);
  //     typingTimerRef.current = setTimeout(() => {
  //       const selection = editor.getTextCursorPosition();
  //       const { block } = selection;
  //       const { content } = block;
  //       console.log({ content });
  //       if (content.length) {
  //         const lastTextNode = content.at(0);
  //         const lastWord = getLastWord(lastTextNode?.text);
  //         console.log("Last word:", lastWord);
  //         const suggestion = lastWord ? predict(lastWord) : null;
  //         console.log("Suggestion:", suggestion);

  //         if (suggestion && suggestion !== lastSuggestion) {
  //           // Check for duplicate suggestion
  //           try {
  //             // remove suggestion
  //             if (lastSuggestion) {
  //               const suggestionSpan = document.querySelector(
  //                 '.bn-inline-content span[data-text-color="gray"]'
  //               );
  //               if (suggestionSpan) {
  //                 // remove span
  //                 suggestionSpan.parentNode.removeChild(suggestionSpan);
  //               }
  //             }

  //             editor.insertInlineContent([
  //               {
  //                 text: suggestion,
  //                 type: "text",
  //                 styles: { textColor: "gray" },
  //               },
  //             ]);

  //             // Move cursor before the suggestion
  //             const range = window.getSelection().getRangeAt(0);
  //             range.setStart(
  //               range.startContainer,
  //               range.startOffset - suggestion.length
  //             );
  //             range.collapse(true);
  //             window.getSelection().removeAllRanges();
  //             window.getSelection().addRange(range);

  //             console.log("Suggestion inserted successfully");
  //             setLastSuggestion(suggestion); // Update the last suggestion
  //           } catch (error) {
  //             console.error("Error inserting suggestion:", error);
  //           }
  //         } else {
  //           console.log("Duplicate suggestion detected. Skipping insertion.");
  //         }
  //       } else {
  //         setLastSuggestion("");
  //       }
  //     }, 200);
  //   };

  const handleKeyDown = (event) => {
    if (!soundEffectsRef.current) return;

    switch (event.key) {
      case " ":
        soundEffectsRef.current.playSpacePress();
        break;
      case "Enter":
        soundEffectsRef.current.playEnterPress();
        break;
      case "Backspace":
        soundEffectsRef.current.playBackspacePress();
        break;
      default:
        // Regular key press
        soundEffectsRef.current.playKeyPress();
    }

    // ...any existing keyDown handling code
  };

  const handleKeyUp = (event) => {
    if (!soundEffectsRef.current) return;

    switch (event.key) {
      case " ":
        soundEffectsRef.current.playSpaceRelease();
        break;
      case "Enter":
        soundEffectsRef.current.playEnterRelease();
        break;
      case "Backspace":
        soundEffectsRef.current.playBackspaceRelease();
        break;
      default:
        // Regular key release
        soundEffectsRef.current.playKeyRelease();
    }
  };

  // Auxiliary function to get the last word
  const getLastWord = (text) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words[words.length - 1];
  };

  return (
    <div
      className="bg-editor flex flex-col shadow-sm relative min-h-[500px] w-full rounded-2xl  sm:mb-[calc(20vh)] scrollbar scrollbar-thumb-neutral-800 scrollbar-track-neutral-100"
      style={{
        overflow: "auto",
        height: "500px",
      }}
    >

      <div className="px-4 py-4">
        <span className="float-right text-neutral-500 text-sm lowercase">
          {DateUtils.formatFullDate(new Date(chapterDate))}
        </span>
      </div>
      <BlockNoteView
        onChange={handleOnChange}
        // onKeyDown={handleKeyDown}
        theme="light"
        editor={editor}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default Editor;
