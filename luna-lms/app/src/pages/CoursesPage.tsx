import { Search, Filter, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const ALL_COURSES = [
  { id: 'c1', title: 'GAME 410: Unity Game Architecture', instructor: 'Dr. Sarah Lin', status: 'Active', term: 'Fall 2026' },
  { id: 'c2', title: 'ART 302: 3D Modeling & Animation', instructor: 'Prof. Marcus Vance', status: 'Active', term: 'Fall 2026' },
  { id: 'c3', title: 'DES 220: Level Design Patterns', instructor: 'Dr. Evelyn Sato', status: 'Active', term: 'Fall 2026' },
  { id: 'c4', title: 'GAME 350: Applied Game Physics', instructor: 'Dr. Alan Turing', status: 'Completed', term: 'Spring 2026' },
];

export default function CoursesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-white mb-1">Your Courses</h1>
          <p className="text-gray-400 text-sm">Manage and view all your past and present enrollments.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full bg-[#111827]/60 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-neon-cyan)]/50 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#111827]/60 border border-white/10 hover:bg-white/5 rounded-lg text-sm text-gray-300 transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ALL_COURSES.map(course => (
          <Link to={`/course/${course.id}`} key={course.id} className="glass-panel p-5 group flex flex-col h-full hover:-translate-y-1 transition-all duration-300">
             <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-xl bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)] group-hover:scale-110 transition-transform">
                 <BookOpen size={24} />
               </div>
               <span className={`text-xs px-2 py-1 rounded font-medium ${course.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                 {course.status}
               </span>
             </div>
             
             <div className="flex-1 space-y-2">
               <h3 className="text-lg font-medium text-white group-hover:text-[var(--color-neon-cyan)] transition-colors">{course.title}</h3>
               <p className="text-sm text-gray-400">{course.instructor}</p>
             </div>
             
             <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-500 font-mono">
               <span>{course.term}</span>
               <span className="flex items-center gap-1 group-hover:text-[var(--color-neon-cyan)] transition-colors">Enter Course &rarr;</span>
             </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
