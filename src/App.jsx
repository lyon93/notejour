import { useState, useEffect } from 'react'
import '@fontsource-variable/inter';
import Header from './components/Header'
import Editor from './components/Editor'
import {
  getChapterByDate,
  addChapter,
  updateChapter,
  getAllChapters,
  getChapterById,
} from './db/db';

// import * as predictionary from './utils/PredictionaryHandler';

import "preline/preline";

import History from './components/History';
import DateUtils from './utils/DateUtils';

function App() {
  const [blocks, setBlocks] = useState([
    {
      type: "heading",
      content: "Default Title",
    },
  ])
  const [title, setTitle] = useState('Default Title')
  const currentDate = new Date();
  const currentDateFormattedShort = DateUtils.formatISODate(currentDate);
  const [currentDateFormattedLong, setCurrentDateFormattedLong] = useState(DateUtils.formatFullDate(currentDate));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [journals, setJournals] = useState([]);

  // Function to initialize chapter
  const initializeChapter = async () => {
    try {
      setIsLoading(true); //
      const todayChapter = await getChapterByDate(currentDateFormattedShort);
      if (todayChapter) {
        // Chapter for today exists; load it
        setCurrentChapterId(todayChapter.id);
        setTitle(todayChapter.title);

        setBlocks(todayChapter.content);
      } else {
        // No chapter for today; create one
        const newChapterData = {
          title: 'Default Title',
          date: currentDateFormattedShort,
          content: blocks,
        };
        const newId = await addChapter(newChapterData);
        setCurrentChapterId(newId);
        setTitle(newChapterData.title);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing chapter:', err);
      setError('Failed to load or create chapter.');
      setIsLoading(false);
    }
  };



  // useEffect(() => { // Initialize the dictionary on component mount
  //   // predictionary.init();

  // }, []);

  useEffect(() => {
    initializeChapter();
  }, []);



  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [window.location.pathname]);

  // Handler for title changes
  const handleTitleChange = async (newTitle) => {
    setTitle(newTitle);
    if (currentChapterId) {
      try {
        await updateChapter(currentChapterId, { title: newTitle });
      } catch (err) {
        console.error('Error updating title:', err);
        setError('Failed to update title.');
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
        console.error('Error updating content:', err);
        setError('Failed to update content.');
      }
    }
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const [renderEditor, setRenderEditor] = useState(false);
  const handleJournalSelect = async (id) => {
    setRenderEditor(true);
    const { title, date, content } = await getChapterById(id);

    if (date) {
      setCurrentChapterId(id);
      setCurrentDateFormattedLong(DateUtils.formatMonthYear(new Date(date)));
      setTitle(title);

      setBlocks([...content]);
    }
    setRenderEditor(false);
  };

  useEffect(() => {
    if (isDrawerOpen) {
      const fetchAllJournals = async () => {
        try {
          const journals = await getAllChapters();
          setJournals(journals);
        } catch (err) {
          console.error('Error fetching all journals:', err);
          setError('Failed to load journal history.');
        }
      };
      fetchAllJournals();
    }

  }, [isDrawerOpen]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500 text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <Header
        currentDate={currentDateFormattedLong}
        title={title}
        onTitleChange={handleTitleChange}
        onDrawerToggle={handleDrawerToggle}
      />
      <main className="container mx-auto px-4 py-6 overflow-hidden">
        {!renderEditor ?
          <Editor
            blocks={blocks}
            currentChapterId={currentChapterId}
            onBlocksChange={handleBlocksChange}
          /> : ''}
        <History
          isOpen={isDrawerOpen}
          onToggle={handleDrawerToggle}
          journals={journals}
          onJournalSelect={handleJournalSelect}
        />
      </main>
    </div>
  );
}

export default App
