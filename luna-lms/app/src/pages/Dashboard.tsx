import { Code, BookOpen, Clock, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_COURSES = [
  { id: 'c1', title: 'CS 410: Advanced Web Architecture', instructor: 'Dr. Sarah Lin', progress: 75, nextDue: 'Tomorrow, 11:59PM', tasks: 2, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400&h=200' },
  { id: 'c2', title: 'ENG 302: Interactive Physics Sims', instructor: 'Prof. Marcus Vance', progress: 40, nextDue: 'Friday, 5:00PM', tasks: 1, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400&h=200' },
  { id: 'c3', title: 'MATH 220: Linear Algebra', instructor: 'Dr. Evelyn Sato', progress: 90, nextDue: 'Next Week', tasks: 0, image: 'https://images.unsplash.com/photo-1632516643736-2245d8b88d22?auto=format&fit=crop&q=80&w=400&h=200' },
];

const RECENT_ACTIVITY = [
  { id: 1, type: 'grade', text: 'Grade posted for React Performance Lab', score: '98/100', time: '2 hours ago' },
  { id: 2, type: 'assignment', text: 'New assignment: WebGL Shader Basics', time: '5 hours ago' },
  { id: 3, type: 'review', text: 'Pull Request comment by TA regarding memory leak', time: 'Yesterday' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-semibold text-white">Welcome back, Alex.</h1>
        <p className="text-gray-400">You have <span className="neon-text font-bold">3 assignments due</span> this week. Keep up the momentum.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Courses */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-display font-medium text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <BookOpen size={20} className="text-[var(--color-neon-cyan)]" /> Active Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_COURSES.map(course => (
              <Link to={`/course/${course.id}`} key={course.id} className="glass-panel group block overflow-hidden">
                <div className="h-24 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent z-10" />
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 relative z-20 space-y-3 mt--4">
                  <h3 className="font-semibold text-white leading-tight group-hover:text-[var(--color-neon-cyan)] transition-colors line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-gray-400">{course.instructor}</p>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">Progress</span>
                      <span className="text-[var(--color-neon-cyan)] font-mono">{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-cyan)] rounded-full shadow-[0_0_8px_rgba(102,252,241,0.6)]" 
                        style={{ width: `${course.progress}%` }} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} className="text-[var(--color-neon-purple)]" /> {course.nextDue}
                    </span>
                    {course.tasks > 0 && (
                      <span className="text-[10px] uppercase tracking-wider bg-[var(--color-neon-purple)]/20 text-[var(--color-neon-purple)] px-2 py-0.5 rounded-full border border-[var(--color-neon-purple)]/30">
                        {course.tasks} Due
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="glass-panel p-5 space-y-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--color-neon-blue)]/10 blur-xl rounded-full" />
            <h3 className="font-display font-medium text-white flex items-center gap-2">
              <Activity size={18} className="text-[var(--color-neon-blue)]" /> Recent Activity
            </h3>
            <div className="space-y-4">
              {RECENT_ACTIVITY.map(act => (
                <div key={act.id} className="flex gap-3 items-start">
                  <div className={`mt-1 rounded-full p-1 border flex-shrink-0
                      ${act.type === 'grade' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                        act.type === 'assignment' ? 'bg-[var(--color-neon-cyan)]/10 border-[var(--color-neon-cyan)]/30 text-[var(--color-neon-cyan)]' :
                        'bg-blue-500/10 border-blue-500/30 text-blue-400'}
                    `}>
                    {act.type === 'grade' ? <CheckCircle2 size={12} /> : act.type === 'assignment' ? <BookOpen size={12} /> : <Code size={12} />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">{act.text}</p>
                    {act.score && <p className="text-xs font-mono text-emerald-400 mt-0.5">{act.score}</p>}
                    <p className="text-xs text-gray-500 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-xs text-gray-400 hover:text-white transition-colors pt-2 border-t border-white/5 uppercase tracking-widest flex items-center justify-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </div>

          <div className="glass-panel p-5">
             <h3 className="font-display font-medium text-white flex items-center gap-2 mb-4">
               <Code size={18} className="text-amber-400" /> Pull Requests
             </h3>
             <div className="space-y-3">
               <div className="bg-white/5 border border-white/10 rounded p-3 flex justify-between items-center group cursor-pointer hover:border-amber-400/50 transition-colors">
                 <div>
                   <p className="text-sm text-gray-200 group-hover:text-amber-400 transition-colors">Physics Engine Core</p>
                   <p className="text-xs text-gray-500 font-mono mt-1">#42 opened 2 days ago</p>
                 </div>
                 <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.6)] animate-pulse" />
               </div>
             </div>
          </div>
        </div>

      </div>

    </div>
  );
}
