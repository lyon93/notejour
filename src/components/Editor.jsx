import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useState, useRef } from "react";
import { predict } from "../utils/PredictionaryHandler";
import DateUtils from '../utils/DateUtils';

function Editor({ blocks, onBlocksChange }) {
   
    const editor = useCreateBlockNote({
        initialContent: blocks,

    });



    // State to track the last suggestion
    const [lastSuggestion, setLastSuggestion] = useState(null);

    // Handle changes in the editor
    const handleOnChange = () => {
        onBlocksChange(editor.document);
    };

    const typingTimerRef = useRef(null);

    // Handle key down events for generating, accepting, or rejecting suggestions
    const handleKeyDown = () => {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {

            const selection = editor.getTextCursorPosition();
            const { block } = selection;
            const { content } = block;
            console.log({ content });
            if (content.length) {
                const lastTextNode = content.at(0);
                const lastWord = getLastWord(lastTextNode?.text);
                console.log("Last word:", lastWord);
                const suggestion = lastWord ? predict(lastWord) : null;
                console.log("Suggestion:", suggestion);

                if (suggestion && suggestion !== lastSuggestion) { // Check for duplicate suggestion
                    try {

                        // remove suggestion
                        if (lastSuggestion) {
                            const suggestionSpan = document.querySelector('.bn-inline-content span[data-text-color="gray"]');
                            if (suggestionSpan) {
                                // remove span
                                suggestionSpan.parentNode.removeChild(suggestionSpan);

                            }
                        }

                        editor.insertInlineContent([
                            {
                                text: suggestion,
                                type: "text",
                                styles: { textColor: "gray" },
                            }
                        ]);

                        // Move cursor before the suggestion
                        const range = window.getSelection().getRangeAt(0);
                        range.setStart(range.startContainer, range.startOffset - suggestion.length);
                        range.collapse(true);
                        window.getSelection().removeAllRanges();
                        window.getSelection().addRange(range);

                        console.log("Suggestion inserted successfully");
                        setLastSuggestion(suggestion); // Update the last suggestion
                    } catch (error) {
                        console.error("Error inserting suggestion:", error);
                    }
                } else {
                    console.log("Duplicate suggestion detected. Skipping insertion.");
                }

            }
            else {
                setLastSuggestion('');
            }
        }, 200);
    };

    // Auxiliary function to get the last word
    const getLastWord = (text) => {
        if (!text) return '';
        const words = text.trim().split(/\s+/);
        return words[words.length - 1];
    };

    return (
        <div className="py-6 bg-zinc-100 ">
            <BlockNoteView
                onChange={handleOnChange}
                // onKeyDown={handleKeyDown}
                theme="light"
                editor={editor}
            />
        </div>
    );
}

export default Editor;
