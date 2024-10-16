import { History, Github, Eclipse } from 'lucide-react';
import DateUtils from '../utils/DateUtils';

function Header({ currentDate, title, onTitleChange, onDrawerToggle }) {


    const handleInputChange = (e) => {
        onTitleChange(e.target.value);
    };


    const handleInputBlur = () => {
        const trimmedTitle = title ? title.trim() : '';
        if (!trimmedTitle) {
            onTitleChange(DateUtils.formatMonthYear(new Date()));
        }
    };

    return (
        <header className="border-b border-zinc-200 bg-zinc-50">
            <div className="px-4 sm:px-6 md:px-8 py-4">
                <div className="flex justify-between items-center">
                    <p className="text-md text-zinc-500 justify-self-start">{currentDate}</p>
                    <input
                        type="text"
                        value={title}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className="text-lg font-semibold text-center text-zinc-950 justify-self-center bg-transparent border-none focus:outline-none"
                        placeholder={DateUtils.formatMonthYear(new Date())}
                        aria-label="Header Title"
                    />

                    <div className="flex space-x-2 justify-self-end text-zinc-700">


                        <button
                            type="button"
                            onClick={onDrawerToggle}
                            className="p-2 rounded-full hover:bg-zinc-100 hover:text-zinc-900 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                            aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-offcanvas-right"
                            aria-label="History"
                        >
                            <History className='size-5' fill="none" xmlns="http://www.w3.org/2000/svg" />
                        </button>
                        <a href="https://github.com/lyon93/notejour"
                            target="_blank"
                            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-700  hover:text-zinc-900 transition-colors"
                            aria-label="GitHub"
                        >
                            <Github className='size-5' fill="none" xmlns="http://www.w3.org/2000/svg" />
                        </a>
                    </div>
                </div>
            </div>


        </header>
    );
}

export default Header;
