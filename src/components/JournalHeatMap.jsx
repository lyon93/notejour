import  { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  parseISO,
  isSameDay
} from 'date-fns';
import DateUtils from '../utils/DateUtils';

function JournalHeatMap({ journals }) {
  const today = new Date();
  
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
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
  }, [today]);

  const journalDates = useMemo(() => {
    return journals.map(journal => parseISO(journal.date));
  }, [journals]);

  const createWeek = (weekIndex) => (
    <div key={weekIndex} className="flex  space-x-2 mb-2">
      {monthDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, i) => {
        const hasEntry = day ? journalDates.some(date => isSameDay(date, day)) : false;
        return (
          <div
            key={i}
            className={`size-4 rounded-sm ${
              day 
                ? hasEntry 
                  ? 'bg-zinc-800' 
                  : 'bg-zinc-200'
                : 'bg-transparent'
            }`}
            title={day ? DateUtils.formatFullDate(day) : ''}
            aria-label={day ? DateUtils.formatFullDate(day) : ''}
          ></div>
        );
      })}
    </div>
  );

  const weekCount = Math.ceil(monthDays.length / 7);

  return (
    <div className="p-2">
      <h2 className="text-lg text-center  py-2">{DateUtils.formatMonthYear(today)}</h2>
      {Array.from({ length: weekCount }, (_, i) => createWeek(i))}
    </div>
  );
}

export default JournalHeatMap;
