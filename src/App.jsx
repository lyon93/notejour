import { useState, useEffect, useRef } from "react";
import "@fontsource-variable/inter";
import Editor from "./components/Editor";
import {
  getChapterByDate,
  addChapter,
  updateChapter,
  getAllChapters,
  getChapterById,
} from "./db/db";
import Loading from "./components/Loading"; // Import the new Loading component

import "preline/preline";

import DateUtils from "./utils/DateUtils";

function App() {
  const [blocks, setBlocks] = useState([
    {
      type: "heading",
      content: "Default Title",
    },
  ]);
  const [title, setTitle] = useState("Default Title");
  const today = new Date();
  const currentDateIsoDateFormat = DateUtils.formatISODate(today);
  const currentDate2DigitFormat = DateUtils.format2Digit(today);
  const [chapterDate, setChapterDate] = useState(currentDateIsoDateFormat);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentChapterId, setCurrentChapterId] = useState(null);

  // Function to initialize chapter
  const initializeChapter = async () => {
    try {
      setIsLoading(true); //
      const todayChapter = await getChapterByDate(currentDateIsoDateFormat);
      if (todayChapter) {
        // Chapter for today exists; load it
        setCurrentChapterId(todayChapter.id);
        setTitle(todayChapter.title);

        setBlocks(todayChapter.content);
      } else {
        // No chapter for today; create one
        const newChapterData = {
          title: "Default Title", // Use the default or formatted date
          date: currentDateIsoDateFormat,
          content: blocks, // Use initial blocks state
        };
        const newId = await addChapter(newChapterData);
        setCurrentChapterId(newId);
        setTitle(newChapterData.title); // Set title after creation
        setBlocks(newChapterData.content); // Ensure blocks state matches
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error initializing chapter:", err);
      setError("Failed to load or create chapter.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeChapter();
  }, []);

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [window.location.pathname]);

  // Load journals for sidebar
  useEffect(() => {
    const loadSidebarJournals = async () => {
      try {
        // Fetch only if the sidebar is potentially visible or needed
        // Or fetch always if the data might be used elsewhere
        const journalsData = await getAllChapters();
        // setSidebarJournals(journalsData);
      } catch (err) {
        console.error("Error fetching sidebar journals:", err);
        // Optionally set an error state specific to the sidebar
      }
    };

    loadSidebarJournals();
  }, []); // Reload when current chapter changes, or adjust trigger as needed

  // Handler for title changes
  const handleTitleChange = async (newTitle) => {
    setTitle(newTitle);
    if (currentChapterId) {
      try {
        await updateChapter(currentChapterId, { title: newTitle });
      } catch (err) {
        console.error("Error updating title:", err);
        setError("Failed to update title.");
      }
    }
  };

  // Handler for blocks changes
  const handleBlocksChange = async (newBlocks) => {
    setBlocks(newBlocks);
    if (currentChapterId) {
      try {
        const updatedContent = newBlocks;
        await updateChapter(currentChapterId, { content: updatedContent });
      } catch (err) {
        console.error("Error updating content:", err);
        setError("Failed to update content.");
      }
    }
  };

  // Function to toggle sidebar collapse state
  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleJournalSelect = async (id) => {
    setRenderEditor(true); // Consider setting loading state here
    try {
      const chapter = await getChapterById(id);
      if (chapter) {
        setCurrentChapterId(id);

        setChapterDate(chapter.date);

        setTitle(chapter.title);
        setBlocks([...chapter.content]); // Ensure deep copy if necessary
      } else {
        setError(`Chapter with id ${id} not found.`);
      }
    } catch (err) {
      console.error("Error fetching chapter by ID:", err);
      setError("Failed to load selected chapter.");
    } finally {
      setRenderEditor(false); // Ensure this runs even if there's an error
    }
  };

  const [shouldFadeTop, setShouldFadeTop] = useState(false);
  const contentRef = useRef(null);

  // Check if content needs fading based on scroll position
  const handleScroll = () => {
    if (contentRef.current) {
      // Apply fade only if scrolled down at least 100px
      setShouldFadeTop(contentRef.current.scrollTop > 20);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-black flex overflow-hidden min-h-screen px-[100px] ">
      <div className="w-full border-r-1 border-l-1 border-neutral-800">
        <div className="border-b border-[#1F1F1F] pt-20 relative">
          <div className="size-2 rotate-45 absolute bg-[#7C7C7C] -bottom-1 -left-1"></div>
          <div className="size-2 rotate-45 absolute bg-[#7C7C7C] -bottom-1 -right-1"></div>
        </div>
        {true ? <Loading /> : <Editor onValue={handleBlocksChange} />}
      </div>
    </div>
  );
}

export default App;
