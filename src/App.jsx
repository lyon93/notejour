import { useState, useEffect } from "react";
import "@fontsource-variable/inter";
import Header from "./components/Header";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
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

const SIDEBAR_WIDTH = 280; // Define a constant for the sidebar width

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
  const currentDate2DigitFormat =  DateUtils.format2Digit(today);
  const [chapterDate, setChapterDate] = useState(currentDateIsoDateFormat);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar visibility

  const [sidebarJournals, setSidebarJournals] = useState([]);

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
        setSidebarJournals(journalsData);
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

  const [renderEditor, setRenderEditor] = useState(false);

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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 flex overflow-hidden min-h-screen">
      <Sidebar
        journals={sidebarJournals}
        onJournalSelect={handleJournalSelect}
        currentChapterId={currentChapterId}
        width={isSidebarCollapsed ? 0 : SIDEBAR_WIDTH} // Pass width based on state
        isCollapsed={isSidebarCollapsed} // Pass collapsed state
      />
      <div
        className={`flex-1 flex flex-col min-w-0 ${
          isSidebarCollapsed ? "px-8" : "px-4"
        } `}
      >
        <Header
          currentDate={currentDate2DigitFormat}
          title={title}
          onTitleChange={handleTitleChange}
          onToggleSidebar={handleToggleSidebar} // Pass the toggle handler
          isSidebarCollapsed={isSidebarCollapsed} // Pass the state for icon logic
        />
        <main
          style={{ height: 500 }}
          className={` transition-all duration-300 `}
        >
          {" "}
          {/* Added flex-1 and overflow-auto */}
          {!renderEditor ? (
            <Editor
              chapterDate={chapterDate}
              blocks={blocks}
              currentChapterId={currentChapterId}
              onBlocksChange={handleBlocksChange}
            />
          ) : (
            <Loading /> // Show loading indicator while switching chapters
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
