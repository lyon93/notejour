import { useEffect } from "react";
import SidebarContent from './SidebarContent'; // Import the new component

function Sidebar({
  journals,
  onJournalSelect,
  currentChapterId,
  width, // This will be SIDEBAR_WIDTH (280) or 0
  isCollapsed
}) {
  const recentJournals = journals.slice(0, 5);

  // Optional: Update CSS variable if needed elsewhere
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${width}px`
    );
  }, [width]);

  return (
    <aside
      // Use max-width for the transition. It transitions from 280px to 0px.
      style={{ maxWidth: `${width}px` }}
      // Ensure transition applies to max-width. overflow-hidden clips content.
      className={`top-0 left-0 h-screen bg-neutral-950  transition-all duration-300 ease-in-out z-40 flex-shrink-0 overflow-hidden py-4`}
    >

      {/* Placeholder for potential future top content inside the sidebar but outside the scrollable/fadeable area */}
      <div className="">
        {/* Example: Could add a logo or fixed header elements here */}
      </div>

      {/* Use the new SidebarContent component */}
      <SidebarContent
        recentJournals={recentJournals}
        onJournalSelect={onJournalSelect}
        currentChapterId={currentChapterId}
        isCollapsed={isCollapsed}
      />

    </aside>
  );
}

export default Sidebar;
