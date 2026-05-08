import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, BookOpen, Code, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Current time starts at 2026-05-08 based on metadata
const INITIAL_DATE = new Date(2026, 4, 8); // May 8, 2026

type EventType = 'assignment' | 'lecture' | 'exam' | 'event';

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  course: string;
  type: EventType;
  time?: string;
  assignmentId?: string;
}

const ALL_EVENTS: CalendarEvent[] = [
  { id: 'e1', date: new Date(2026, 4, 9), title: 'Player Controller Setup', course: 'GAME 410', type: 'assignment', time: '11:59 PM', assignmentId: 'i6' },
  { id: 'e2', date: new Date(2026, 4, 12), title: 'Railbound Prototype Milestone', course: 'GAME 410', type: 'assignment', time: '11:59 PM', assignmentId: 'i6' },
  { id: 'e3', date: new Date(2026, 4, 14), title: 'Coppervalle Rush Level Review', course: 'DES 220', type: 'lecture', time: '5:00 PM' },
  { id: 'e4', date: new Date(2026, 4, 16), title: 'WuHu Game Jam 2026', course: 'University Wide', type: 'event', time: '8:00 AM' },
  { id: 'e5', date: new Date(2026, 4, 20), title: '3D Asset Pipeline Midterm', course: 'ART 302', type: 'exam', time: '10:00 AM' },
  { id: 'e6', date: new Date(2026, 4, 25), title: 'Implement NavMesh in Unity', course: 'GAME 410', type: 'assignment', time: '11:59 PM', assignmentId: 'i6' },
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(INITIAL_DATE.getFullYear(), INITIAL_DATE.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(INITIAL_DATE);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date(INITIAL_DATE.getFullYear(), INITIAL_DATE.getMonth(), 1));
    setSelectedDate(INITIAL_DATE);
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, INITIAL_DATE);
  };

  const monthEvents = useMemo(() => {
    return ALL_EVENTS.filter(event => 
      event.date.getMonth() === currentMonth.getMonth() && 
      event.date.getFullYear() === currentMonth.getFullYear()
    );
  }, [currentMonth]);

  const selectedDateEvents = useMemo(() => {
    return ALL_EVENTS.filter(event => isSameDay(event.date, selectedDate));
  }, [selectedDate]);

  const upcomingEvents = useMemo(() => {
    const upcoming = ALL_EVENTS.filter(event => event.date >= INITIAL_DATE).sort((a, b) => a.date.getTime() - b.date.getTime());
    return upcoming.slice(0, 5);
  }, []);

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="min-h-[100px] p-2 border border-white/5 opacity-50 bg-[#0b0c10]/20"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = isSameDay(date, selectedDate);
      const isCurrentDay = isToday(date);
      const dayEvents = monthEvents.filter(e => isSameDay(e.date, date));
      
      cells.push(
        <div 
          key={day} 
          onClick={() => handleDateClick(day)}
          className={`min-h-[100px] p-2 border border-white/5 relative cursor-pointer group transition-all bg-[#111827]/40
            ${isSelected ? 'shadow-[inset_0_0_0_1px_rgba(102,252,241,0.5)] bg-[var(--color-neon-cyan)]/5' : 'hover:bg-white/5'}
          `}
        >
          <div className="flex justify-between items-start">
            <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-colors
              ${isCurrentDay && !isSelected ? 'bg-white/20 text-white' : ''}
              ${isSelected ? 'bg-[var(--color-neon-cyan)] text-black shadow-[0_0_10px_rgba(102,252,241,0.5)]' : 'text-gray-400'}
            `}>
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="text-[10px] text-gray-500 font-medium">
                {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="mt-2 space-y-1">
            {dayEvents.slice(0, 3).map(event => (
              <div 
                key={event.id}
                className={`text-[10px] truncate px-1.5 py-0.5 rounded cursor-pointer transition-colors
                  ${event.type === 'assignment' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20' : 
                    event.type === 'exam' ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' : 
                    event.type === 'event' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20' :
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20'}
                `}
                title={event.title}
              >
                {event.time && <span className="opacity-70 mr-1">{event.time.split(' ')[0]}</span>}
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-[10px] text-gray-500 px-1">+ {dayEvents.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }
    return cells;
  };

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'assignment': return <Code size={16} className="text-amber-400" />;
      case 'exam': return <AlertCircle size={16} className="text-red-400" />;
      case 'event': return <CalendarIcon size={16} className="text-purple-400" />;
      case 'lecture': return <BookOpen size={16} className="text-blue-400" />;
    }
  };

  const getEventBorderClass = (type: EventType) => {
    switch (type) {
      case 'assignment': return 'border-amber-500/30';
      case 'exam': return 'border-red-500/30';
      case 'event': return 'border-purple-500/30';
      case 'lecture': return 'border-blue-500/30';
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-medium text-white mb-1">Calendar</h1>
          <p className="text-gray-400 text-sm">Unified view of your deadlines, lectures, and events.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={goToToday}
            className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        
        {/* Calendar Main Area */}
        <div className="flex-1 flex flex-col glass-panel overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-neon-blue)]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
            <h2 className="text-2xl font-display font-medium text-white">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 border border-white/10 rounded hover:bg-white/10 text-gray-400 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="p-2 border border-white/10 rounded hover:bg-white/10 text-gray-400 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-7 border-b border-white/10 shrink-0 bg-white/5 sticky top-0 z-10">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="p-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 flex-1 content-start">
              {renderCells()}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 shrink-0 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
          
          {/* Selected Date Details */}
          <div className="glass-panel p-5">
            <h3 className="font-display font-medium text-white mb-1 flex items-center justify-between">
              {selectedDate.toLocaleString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
              {isToday(selectedDate) && <span className="text-[10px] bg-[var(--color-neon-cyan)]/20 text-[var(--color-neon-cyan)] px-2 py-0.5 rounded uppercase tracking-wider">Today</span>}
            </h3>
            
            <div className="mt-4 space-y-3">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <div key={event.id} className={`p-3 bg-[#0b0c10]/60 border-l-2 rounded-r-lg ${getEventBorderClass(event.type)}`}>
                    <div className="flex items-center gap-2 mb-1.5 cursor-default">
                      {getEventIcon(event.type)}
                      <span className="text-white text-sm font-medium">{event.title}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{event.course}</span>
                      {event.time && <span className="flex items-center gap-1"><Clock size={12}/> {event.time}</span>}
                    </div>
                    {event.type === 'assignment' && event.assignmentId && (
                      <Link to={`/assignment/${event.assignmentId}`} className="mt-3 block text-center w-full bg-white/5 hover:bg-white/10 text-gray-300 text-xs py-1.5 rounded transition-colors border border-white/5">
                        View Assignment
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center p-6 text-gray-500 text-sm flex flex-col items-center gap-2">
                  <CalendarIcon size={24} className="opacity-50" />
                  No events scheduled for this day.
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events Mini-widget */}
          <div className="glass-panel p-5">
            <h3 className="font-display font-medium text-white mb-4 border-b border-white/10 pb-2">Upcoming in 7 Days</h3>
            <div className="space-y-4">
              {upcomingEvents.map(event => {
                const diffDays = Math.ceil((event.date.getTime() - INITIAL_DATE.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={`up-${event.id}`} className="flex gap-3">
                    <div className="flex flex-col items-center bg-white/5 rounded px-2 py-1 min-w-[3rem] self-start border border-white/5">
                      <span className="text-[10px] uppercase text-gray-500">
                        {event.date.toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-mono text-white">
                        {event.date.getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      {event.type === 'assignment' && event.assignmentId ? (
                        <Link to={`/assignment/${event.assignmentId}`} className="text-sm font-medium text-[var(--color-neon-cyan)] hover:underline line-clamp-1">
                          {event.title}
                        </Link>
                      ) : (
                        <div className="text-sm font-medium text-gray-200 line-clamp-1">{event.title}</div>
                      )}
                      <div className="text-xs text-gray-400 flex justify-between items-center mt-1">
                        <span>{event.course}</span>
                        <span className="font-mono text-amber-500/80">{diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `In ${diffDays} days`}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link to="/courses" className="mt-4 block text-center text-xs text-gray-500 hover:text-white uppercase tracking-widest transition-colors pt-3 border-t border-white/5">
              View All Timeline &rarr;
            </Link>
          </div>
          
        </div>

      </div>
    </div>
  );
}
