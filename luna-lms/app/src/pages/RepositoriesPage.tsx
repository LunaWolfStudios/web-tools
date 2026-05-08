import { Github, ExternalLink, GitBranch, Terminal } from 'lucide-react';

export default function RepositoriesPage() {
  const repos = [
    { name: 'railbound-prototype', course: 'GAME 410', status: 'passing', commits: 42, lastActive: '2h ago' },
    { name: 'coppervalle-rush', course: 'DES 220', status: 'failing', commits: 15, lastActive: '1d ago' },
    { name: 'unity-custom-shaders', course: 'ART 302', status: 'passing', commits: 8, lastActive: '3d ago' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-medium text-white mb-1">Repositories</h1>
          <p className="text-gray-400 text-sm">Manage your synced Git repositories across all courses.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm text-white transition-colors">
          <Github size={16} /> Connect Account
        </button>
      </div>

      <div className="space-y-4">
        {repos.map((repo, i) => (
          <div key={i} className="glass-panel p-5 flex items-center justify-between group hover:border-[var(--color-neon-cyan)]/30 transition-colors">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-white/5 rounded-lg text-gray-400">
                  <Terminal size={20} />
               </div>
               <div>
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    {repo.name} 
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">{repo.course}</span>
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                     <span className="flex items-center gap-1"><GitBranch size={12}/> {repo.commits} commits</span>
                     <span>Updated {repo.lastActive}</span>
                  </div>
               </div>
             </div>
             
             <div className="flex items-center gap-6">
                <div className={`flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded border ${repo.status === 'passing' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  CI: {repo.status.toUpperCase()}
                </div>
                <button className="text-gray-400 hover:text-[var(--color-neon-cyan)] p-2 transition-colors">
                  <ExternalLink size={16} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
