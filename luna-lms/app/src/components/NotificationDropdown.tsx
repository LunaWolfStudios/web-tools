import { useState, useRef, useEffect } from 'react';
import { Bell, Trash2 } from 'lucide-react';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNew, setHasNew] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Grade posted for React Performance Lab: 98/100", time: "2h ago", read: false },
    { id: 2, text: "New assignment: WebGL Shader Basics", time: "5h ago", read: false },
    { id: 3, text: "Dr. Sarah Lin replied to your discussion post.", time: "1d ago", read: false }
  ]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && hasNew) {
      setHasNew(false);
    }
  };

  const clearAll = () => {
    setNotifications([]);
    setHasNew(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className={`relative p-2 transition-colors ${isOpen ? 'text-[var(--color-neon-cyan)]' : 'text-gray-400 hover:text-white'}`}
      >
        <Bell size={20} />
        {hasNew && notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-neon-cyan)] rounded-full shadow-[0_0_5px_rgba(102,252,241,0.5)]"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#111827]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 md:w-96 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-medium text-white font-display">Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={clearAll} 
                className="text-xs text-gray-400 hover:text-[var(--color-neon-cyan)] transition-colors flex items-center gap-1"
              >
                <Trash2 size={12} /> Clear all
              </button>
            )}
          </div>
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <div key={notif.id} className="px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors cursor-pointer group">
                  <p className="text-sm text-gray-200 leading-tight mb-1 group-hover:text-white transition-colors">{notif.text}</p>
                  <span className="text-[10px] text-gray-500 font-mono">{notif.time}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                <Bell size={24} className="mx-auto mb-2 opacity-20" />
                You're all caught up!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
