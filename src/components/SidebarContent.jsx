
function SidebarContent({
  recentJournals,
  onJournalSelect,
  currentChapterId,
}) {
  return (
    <div>
      <div className="p-4"> {/* Existing padding */}
        <h2 className="text-md font-medium text-neutral-200 mb-4 whitespace-nowrap"> {/* Prevent title wrapping */}
          Recent Journals
        </h2>
        {recentJournals.map((journal) => (
          <button
            key={journal.id}
            onClick={() => onJournalSelect(journal.id)}
            className={`block w-full text-left px-2 py-1 rounded mb-1 whitespace-nowrap ${ // Prevent button text wrapping
              journal.id === currentChapterId
                ? "bg-neutral-700 text-white"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
            }`}
          >
            {journal.title || "Untitled"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SidebarContent;
