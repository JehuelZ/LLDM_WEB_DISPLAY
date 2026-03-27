'use client';

import React, { useState } from 'react';
import { 
    format, 
    addMonths, 
    subMonths, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    isSameMonth, 
    isSameDay, 
    addDays, 
    parseISO,
    isToday
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumCalendarProps {
    selectedDate: string; // yyyy-MM-dd
    onDateSelect: (date: string) => void;
    theme?: 'classic' | 'primitivo' | 'luna';
    className?: string;
}

const PremiumCalendar: React.FC<PremiumCalendarProps> = ({ 
    selectedDate, 
    onDateSelect, 
    theme = 'classic',
    className 
}) => {
    const [currentMonth, setCurrentMonth] = useState(parseISO(selectedDate));
    const [direction, setDirection] = useState(0);

    const nextMonth = () => {
        setDirection(1);
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setDirection(-1);
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleDateClick = (day: Date) => {
        onDateSelect(format(day, 'yyyy-MM-dd'));
    };

    const renderHeader = () => {
        const accentColor = theme === 'primitivo' ? 'text-amber-400' : theme === 'luna' ? 'text-emerald-400' : 'text-primary';
        const buttonStyle = theme === 'primitivo' 
            ? 'hover:bg-amber-400/10 border-amber-400/20' 
            : theme === 'luna' 
            ? 'hover:bg-emerald-400/10 border-emerald-400/20' 
            : 'hover:bg-primary/10 border-primary/20';

        return (
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex flex-col">
                    <motion.h3 
                        key={format(currentMonth, 'MMMM yyyy')}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn("text-lg font-black uppercase tracking-[0.2em]", accentColor)}
                    >
                        {format(currentMonth, 'MMMM', { locale: es })}
                    </motion.h3>
                    <span className="text-[10px] font-medium opacity-40 uppercase tracking-[0.3em]">
                        {format(currentMonth, 'yyyy')}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={prevMonth}
                        className={cn("p-2.5 rounded-xl border transition-all duration-300", buttonStyle)}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setCurrentMonth(new Date())}
                        className={cn("px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all duration-300", buttonStyle)}
                    >
                        HOY
                    </button>
                    <button 
                        onClick={nextMonth}
                        className={cn("p-2.5 rounded-xl border transition-all duration-300", buttonStyle)}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
        return (
            <div className="grid grid-cols-7 mb-4">
                {days.map((day, i) => (
                    <div key={i} className="text-center">
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{day}</span>
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");
                const cloneDay = day;
                const isSelected = isSameDay(day, parseISO(selectedDate));
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isTodayDate = isToday(day);

                // Theme-specific cell styles
                let cellClasses = "relative h-12 flex items-center justify-center cursor-pointer group transition-all duration-300 overflow-hidden";
                let innerStyle = "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-500 z-10";
                
                if (isSelected) {
                    if (theme === 'primitivo') {
                        innerStyle += " bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-110";
                    } else if (theme === 'luna') {
                        innerStyle += " bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110";
                    } else {
                        innerStyle += " bg-primary text-black shadow-lg scale-110";
                    }
                } else if (!isCurrentMonth) {
                    innerStyle += " text-white/10";
                } else if (isTodayDate) {
                    innerStyle += " border border-primary/40 text-primary";
                } else {
                    innerStyle += " text-white/60 group-hover:bg-white/5 group-hover:text-white";
                }

                days.push(
                    <div
                        key={day.toString()}
                        className={cellClasses}
                        onClick={() => handleDateClick(cloneDay)}
                    >
                        <motion.div 
                            layoutId={isSelected ? "activeDay" : undefined}
                            className={innerStyle}
                        >
                            {formattedDate}
                        </motion.div>
                        {isTodayDate && !isSelected && (
                            <div className={cn(
                                "absolute bottom-1 w-1 h-1 rounded-full",
                                theme === 'primitivo' ? 'bg-amber-400' : theme === 'luna' ? 'bg-emerald-400' : 'bg-primary'
                            )} />
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }

        return (
            <motion.div 
                key={currentMonth.toString()}
                initial={{ opacity: 0, x: direction * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="min-h-[280px]"
            >
                {rows}
            </motion.div>
        );
    };

    return (
        <div className={cn(
            "p-4 sm:p-6 rounded-[2rem] border backdrop-blur-3xl select-none w-full max-w-[400px] mx-auto",
            theme === 'primitivo' 
                ? "bg-[#0f0f12]/95 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                : theme === 'luna'
                ? "bg-[#0a0b10]/95 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                : "glass-card border-white/10 shadow-2xl",
            className
        )}>
            {renderHeader()}
            {renderDays()}
            <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    {renderCells()}
                </AnimatePresence>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-3 h-3" />
                    <span>Selector Institucional</span>
                </div>
                <div className="flex items-center gap-2">
                    <Target className="w-3 h-3 text-emerald-500" />
                    <span>Nodo Live</span>
                </div>
            </div>
        </div>
    );
};

export default PremiumCalendar;
