import { ArrowLeft, Clock, FileText, Code, CheckCircle, Lock, LayoutGrid, Github, BookOpen } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const MODULES = [
  {
    id: 'm1',
    title: 'Week 1: Fundamentals of Unity 3D',
    status: 'completed',
    items: [
      { id: 'i1', type: 'lecture', title: 'Course Intro & Unity Editor', time: '15m' },
      { id: 'i2', type: 'reading', title: 'GameObjects and MonoBehaviours', time: '45m' },
      { id: 'i3', type: 'assignment', title: 'Setup GitHub & Unity Project', time: '2h', points: 10, status: 'graded', score: '10/10' },
    ]
  },
  {
    id: 'm2',
    title: 'Week 2: Input & Physics Core',
    status: 'active',
    items: [
      { id: 'i4', type: 'lecture', title: 'Deep dive: Rigidbodies', time: '1h 20m' },
      { id: 'i5', type: 'reading', title: 'The new Input System', time: '30m' },
      { id: 'i6', type: 'coding', title: 'Implement Player Controller', time: '4h', points: 50, status: 'pending', due: 'Tomorrow, 11:59PM' },
    ]
  },
  {
    id: 'm3',
    title: 'Week 3: AI & NavMesh Pathfinding',
    status: 'locked',
    items: [
      { id: 'i7', type: 'lecture', title: 'State Machines for AI', time: '1h' },
      { id: 'i8', type: 'coding', title: 'Implement NavMesh in Unity', time: '5h', points: 100, status: 'locked' }
    ]
  }
];

export default function CourseView() {
  const { id } = useParams();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <Link to="/luna-lms/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <span>/</span>
        <span className="text-[var(--color-neon-cyan)]">GAME 410</span>
      </div>

      <header className="glass-panel relative overflow-hidden p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-neon-blue)]/5 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-3 flex-1 relative z-10">
          <div className="flex gap-2 text-xs font-mono text-[var(--color-neon-cyan)]">
            <span className="bg-[var(--color-neon-cyan)]/10 px-2 py-1 rounded">GAME 410</span>
            <span className="bg-white/5 py-1 px-2 rounded">Fall 2026</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white">Unity Game Architecture</h1>
          <p className="text-gray-400 max-w-2xl">Explore advanced C# patterns in Unity, game physics with Rigidbodies, and artificial intelligence for NPCs.</p>
        </div>

        <div className="flex flex-col gap-4 min-w-[200px] relative z-10">
           <div className="bg-white/5 border border-white/10 rounded-xl p-4">
             <div className="flex justify-between text-sm mb-2">
               <span className="text-gray-400">Your Grade</span>
               <span className="text-white font-mono text-lg">96%</span>
             </div>
             <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[96%] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] rounded-full"></div>
             </div>
           </div>
           <button className="flex items-center justify-center gap-2 w-full py-2 bg-[var(--color-neon-cyan)]/10 hover:bg-[var(--color-neon-cyan)]/20 text-[var(--color-neon-cyan)] border border-[var(--color-neon-cyan)]/30 rounded-lg transition-colors font-medium">
             <Github size={16} /> Sync Repository
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-display text-white">Course Modules</h2>
              <div className="flex gap-2">
                <button className="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-md"><LayoutGrid size={16} /></button>
              </div>
            </div>

            <div className="space-y-6">
              {MODULES.map((module) => (
                <div key={module.id} className={`glass-panel border-l-4 ${module.status === 'locked' ? 'border-l-gray-600 opacity-60' : module.status === 'active' ? 'border-l-[var(--color-neon-cyan)] shadow-[0_0_20px_rgba(102,252,241,0.05)]' : 'border-l-emerald-500'}`}>
                  <div className="p-5 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      {module.status === 'locked' && <Lock size={16} className="text-gray-500" />}
                      {module.title}
                    </h3>
                    <span className="text-xs uppercase tracking-wider font-semibold px-2 py-1 rounded bg-white/5 text-gray-400">
                      {module.items.length} items
                    </span>
                  </div>
                  <div className="p-2 space-y-1">
                    {module.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-md 
                            ${item.type === 'lecture' ? 'bg-purple-500/10 text-purple-400' : 
                              item.type === 'reading' ? 'bg-blue-500/10 text-blue-400' : 
                              'bg-amber-500/10 text-amber-400'}`}>
                            {item.type === 'lecture' ? <FileText size={16} /> : item.type === 'reading' ? <BookOpen size={16} /> : <Code size={16} />}
                          </div>
                          <div>
                            {module.status === 'locked' ? (
                              <span className="text-gray-400">{item.title}</span>
                            ) : item.type === 'coding' ? (
                              <Link to={`/luna-lms/assignment/${item.id}`} className="text-gray-200 group-hover:text-[var(--color-neon-cyan)] transition-colors inline-block">{item.title}</Link>
                            ) : (
                              <span className="text-gray-200 cursor-pointer">{item.title}</span>
                            )}
                            {item.due && <p className="text-xs text-amber-400 mt-1 font-mono">Due: {item.due}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500 text-xs flex items-center gap-1"><Clock size={12} /> {item.time}</span>
                          {item.points && <span className="text-gray-400 text-xs w-16 text-right">{item.points} pts</span>}
                          {item.status === 'graded' && <span className="bg-emerald-500/10 text-emerald-400 text-xs font-mono px-2 py-0.5 rounded border border-emerald-500/20">{item.score}</span>}
                          {item.status === 'pending' && <span className="w-16 flex justify-end">
                             <Link to={`/luna-lms/assignment/${item.id}`} className="bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)] border border-[var(--color-neon-cyan)]/30 text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Start</Link>
                          </span>}
                          {item.status === 'locked' && <Lock size={14} className="text-gray-600 w-16" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
         </div>
         
         <div className="space-y-6">
            <div className="glass-panel p-5">
              <h3 className="font-display font-medium text-white mb-4 border-b border-white/10 pb-2">Instructor</h3>
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/150?u=instructor1" alt="Dr. Sarah Lin" className="w-12 h-12 rounded-full border border-white/20" />
                <div>
                  <p className="text-gray-200 font-medium text-sm">Dr. Sarah Lin</p>
                  <p className="text-gray-500 text-xs">Email · Office Hours: Wed 2pm</p>
                </div>
              </div>
            </div>

             <div className="glass-panel p-5">
              <h3 className="font-display font-medium text-white mb-4 border-b border-white/10 pb-2">Upcoming Deadlines</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center bg-white/5 rounded px-2 py-1 min-w-[3rem]">
                    <span className="text-[10px] uppercase text-gray-500">Oct</span>
                    <span className="text-lg font-mono text-white">24</span>
                  </div>
                  <div>
                    <Link to="/luna-lms/assignment/i6" className="text-sm font-medium text-[var(--color-neon-cyan)] hover:underline">Player Controller</Link>
                    <p className="text-xs text-gray-400">11:59 PM</p>
                  </div>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
