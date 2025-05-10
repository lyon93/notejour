import { ArrowLeftFromLine, ArrowRightFromLine, SlidersHorizontal } from "lucide-react";
import DateUtils from "../utils/DateUtils";

// Receive onToggleSidebar and isSidebarCollapsed props
function Header({ currentDate, title, onTitleChange, onToggleSidebar, isSidebarCollapsed }) {
  const handleInputChange = (e) => {
    onTitleChange(e.target.value);
  };

  const handleInputBlur = () => {
    const trimmedTitle = title ? title.trim() : "";
    if (!trimmedTitle) {
      onTitleChange(DateUtils.formatMonthYear(new Date()));
    }
  };

  return (
    <header
      className="bg-neutral-950 w-full flex-shrink-0" // Added flex-shrink-0
    >
      <div className=" py-4">
        <div className="flex justify-between items-center"> {/* Changed to justify-between */}
          {/* Button to toggle sidebar */}
          <button onClick={onToggleSidebar} className=" text-neutral-400 hover:text-neutral-100 focus:outline-none">
            {/* Conditionally render icon based on sidebar state */}
            {isSidebarCollapsed ? (
              <ArrowRightFromLine className="size-4" />
            ) : (
              <ArrowLeftFromLine className="size-4" />
            )}
          </button>

          <div className="flex flex-col justify-center items-center text-center">
            <input
              type="text"
              value={title}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="text-lg font-medium text-center text-neutral-50 bg-transparent border-none focus:outline-none w-full max-w-xs sm:max-w-sm md:max-w-md" // Added width constraints
              placeholder={"Title"}
              aria-label="Header Title"
            />
            <p className="text-sm text-neutral-500">
              {currentDate}
            </p>
          </div>

          {/* Placeholder for right-side controls if needed, ensure it balances the layout */}
          <div > {/* Added fixed width div to balance the toggle button */}
             {/* <SlidersHorizontal className="size-5 text-neutral-400" /> */}
             {/* You can add other controls here later */}
          </div>
        </div>
      </div> 
    </header>
  );
}

export default Header;
