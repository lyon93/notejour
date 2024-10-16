import { useState, useEffect } from 'react';

import Drawer from 'react-modern-drawer'
import Avatar from 'boring-avatars';

import { isToday } from 'date-fns'
import 'react-modern-drawer/dist/index.css'
import JournalHeatMap from './JournalHeatMap';
import DateUtils from '../utils/DateUtils';

function History({ isOpen, onToggle, journals, onJournalSelect }) {
    const [activeJournalId, setActiveJournalId] = useState(null);

    const handleJournalClick = (id) => {
        setActiveJournalId(id);
        onJournalSelect(id);
    };

    return (
        <Drawer
            open={isOpen}
            onClose={onToggle}
            direction='right'
            size={400}

            className=" bg-zinc-50 dark:bg-zinc-900 "
        >
            <h2 className="text-2xl px-4 py-4 font-semibold mb-6 text-zinc-800 dark:text-zinc-200  border-zinc-200 dark:border-zinc-700 pb-2">
                Journal History
            </h2>
        <div className="pb-4 flex justify-center items-center">
            <JournalHeatMap journals={journals} />

        </div>
            <ul className="space-y-4 h-[calc(100vh-260px)] overflow-y-auto ">
                {journals.map(({ id, title, date, content }) => {
                    const isActive = id === activeJournalId;
                    const isTodayEntry = isToday(new Date(date));
                    const isHighlighted = isActive || (isTodayEntry && activeJournalId === null);
                    return (
                        <li
                            key={id}
                            className={`max-h-44 h-full dark:bg-zinc-800 border-b border-zinc-200 transition-all ease-in-out hover:cursor-pointer dark:hover:bg-zinc-700
                                ${isHighlighted ? 'border-l-[6px] border-l-zinc-800 dark:border-l-zinc-200' : 'hover:border-l-zinc-800 hover:border-l-[6px]'}
                            `}
                            onClick={() => handleJournalClick(id)}
                        >
                            <div className="flex flex-col px-4 space-y-2 pb-2">
                                <Avatar
                                    size={40}
                                    name={title}
                                    colors={['#fafafa', '#d4d4d8', '#71717a', '#3f3f46', '#18181b']}
                                />
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 ">
                                    {DateUtils.formatFullDate(new Date(date))}
                                </p>

                                <h3 className="font-semibold text-lg text-zinc-800 dark:text-zinc-300">{title}</h3>

                                <p className='text-sm text-zinc-500 line-clamp-2 '>{Array.isArray(content[0].content) ? content[0].content.map(e => e.text).join(" ") : ''}</p>

                            </div>
                        </li>
                    );
                })}
            </ul>
        </Drawer>
    );
}

export default History;
