'use client';
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

interface PremiumCalendarProps {
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
  events?: any[];
}

export const PremiumCalendar: React.FC<PremiumCalendarProps> = ({ 
  currentDate = new Date(),
  onDateChange = () => {},
  events = []
}) => {
  const [viewDate, setViewDate] = React.useState(currentDate);
  const start = startOfMonth(viewDate);
  const end = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="flex flex-col w-full bg-slate-900/50 rounded-xl border border-slate-800/50 overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">
          {format(viewDate, 'MMMM yyyy', { locale: es })}
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewDate(subMonths(viewDate, 1))}
            className="p-1 hover:bg-slate-800 rounded transition"
          >
            ←
          </button>
          <button 
            onClick={() => setViewDate(addMonths(viewDate, 1))}
            className="p-1 hover:bg-slate-800 rounded transition"
          >
            →
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-slate-800/20 text-center text-xs font-medium text-slate-500 p-2">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 bg-slate-800/10 gap-px">
        {days.map((day, idx) => {
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, currentDate);
          
          return (
            <button
              key={idx}
              onClick={() => onDateChange(day)}
              className={`h-12 flex flex-col items-center justify-center transition-all ${
                isSelected ? 'bg-indigo-600/30 text-indigo-400 font-bold' : 
                isToday ? 'bg-slate-800/50 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="text-sm">{format(day, 'd')}</span>
              {events.some(e => isSameDay(new Date(e.date), day)) && (
                <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default PremiumCalendar;
