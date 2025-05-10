import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths } from 'date-fns';

function Calendar({ journals, onJournalSelect, selectedMonth, setSelectedMonth }) {
  const today = new Date();
  
  const goToPreviousMonth = () => {
    setSelectedMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const goToNextMonth = () => {
    setSelectedMonth(prevMonth => addMonths(prevMonth, 1));
  };
  
  const goToCurrentMonth = () => {
    setSelectedMonth(today);
  };
  
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Pad with empty cells for days before the 1st of the month
    const paddingDays = getDay(monthStart);
    const paddedDays = Array(paddingDays).fill(null).concat(daysInMonth);
    
    // Pad with empty cells to complete the last week
    const totalCells = Math.ceil(paddedDays.length / 7) * 7;
    while (paddedDays.length < totalCells) {
      paddedDays.push(null);
    }
    
    return paddedDays;
  }, [selectedMonth]);
  
  const journalDates = useMemo(() => {
    return journals.map(journal => new Date(journal.date));
  }, [journals]);

  return (
    <div className="mb-4 text-center">
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={goToPreviousMonth} 
          className="p-1 rounded-md hover:bg-zinc-200"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-medium">{format(selectedMonth, 'MMMM yyyy')}</h2>
          
        </div>
        <button 
          onClick={goToNextMonth} 
          className="p-1 rounded-md hover:bg-zinc-200"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2 text-xs text-center">
        <div className="text-zinc-500">S</div>
        <div className="text-zinc-500">M</div>
        <div className="text-zinc-500">T</div>
        <div className="text-zinc-500">W</div>
        <div className="text-zinc-500">T</div>
        <div className="text-zinc-500">F</div>
        <div className="text-zinc-500">S</div>
        
        {calendarDays.map((day, i) => {
          const hasEntry = day ? journalDates.some(date => isSameDay(date, day)) : false;
          const isToday = day ? isSameDay(day, today) : false;
          
          return (
            <div
              key={i}
              className={`
                h-6 w-6 flex items-center justify-center rounded-full text-xs
                ${day ? (
                  isToday ? 'bg-zinc-800 text-white' :
                  hasEntry ? 'bg-zinc-200 hover:bg-zinc-300 cursor-pointer' : ''
                ) : ''}
              `}
              onClick={() => {
                if (day && hasEntry) {
                  const journal = journals.find(j => isSameDay(new Date(j.date), day));
                  if (journal) onJournalSelect(journal.id);
                }
              }}
            >
              {day ? day.getDate() : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;