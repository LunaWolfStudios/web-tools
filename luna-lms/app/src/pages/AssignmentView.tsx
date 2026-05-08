import { ArrowLeft, GitCommit, Play, Terminal, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function AssignmentView() {
  const [activeTab, setActiveTab] = useState<'instructions' | 'diff' | 'preview'>('instructions');

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <Link to="/course/c1" className="hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Back to GAME 410
          </Link>
          <span>/</span>
          <span className="text-gray-200">Implement Player Controller</span>
        </div>
        <div className="flex items-center text-xs gap-3">
          <span className="text-amber-400 flex items-center gap-1"><Clock size={12}/> Due Tomorrow</span>
          <span className="text-gray-400">50 pts</span>
        </div>
      </div>

      <header className="glass-panel p-5 shrink-0 flex items-end justify-between mb-4">
        <div>
           <div className="flex gap-2 text-xs font-mono mb-2">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider">Pending Submission</span>
           </div>
           <h1 className="text-3xl font-display font-medium text-white mb-1">Implement Player Controller</h1>
           <p className="text-sm text-gray-400">Implement a physics-based player controller in Unity C# using Rigidbodies.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm rounded-lg transition-colors flex items-center gap-2">
            <GitCommit size={16} /> Sync Branch
          </button>
          <button className="px-6 py-2 bg-[var(--color-neon-cyan)] hover:bg-[var(--color-neon-cyan)]/90 text-black font-medium text-sm rounded-lg transition-colors shadow-[0_0_15px_rgba(102,252,241,0.3)]">
            Submit Assignment
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* Left pane: Navigation/Context */}
        <div className="w-1/4 flex flex-col gap-4">
           <div className="glass-panel flex-1 flex flex-col overflow-hidden">
             <div className="border-b border-white/5 p-2 flex gap-1 bg-[#0b0c10]/40">
                <button 
                  onClick={() => setActiveTab('instructions')}
                  className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${activeTab === 'instructions' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Instructions
                </button>
                <button 
                  onClick={() => setActiveTab('diff')}
                  className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${activeTab === 'diff' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Code Diff
                </button>
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${activeTab === 'preview' ? 'bg-white/10 text-[var(--color-neon-cyan)] font-medium shadow-[0_0_10px_rgba(102,252,241,0.1)] border border-[var(--color-neon-cyan)]/30' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Preview
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {activeTab === 'instructions' && (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <h3 className="text-white font-medium">Task Overview</h3>
                    <p className="text-gray-400">In this assignment, you will build a <code>PlayerController.cs</code> script attached to a Rigidbody to handle movement in a 3D environment.</p>
                    <hr className="border-white/10 my-4" />
                    <h4 className="text-gray-200">Requirements:</h4>
                    <ul className="text-gray-400 space-y-2">
                       <li>Implement movement in <code>Assets/Scripts/PlayerController.cs</code>.</li>
                       <li>It must use <code>Rigidbody.AddForce</code> instead of directly translating the transform.</li>
                       <li>Ensure movement is smooth by applying Time.deltaTime properly if necessary, or utilizing FixedUpdate.</li>
                    </ul>
                    <div className="bg-[#0b0c10] border border-white/5 p-3 rounded-lg mt-4">
                      <p className="text-xs font-mono text-emerald-400 mb-2">// Setup Instructions</p>
                      <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
                        <code>
{`1. Sync branch 'feat/player-movement'
2. Attach script to 'PlayerSphere'
3. Set Rigidbody mass to default (1.0)`}
                        </code>
                      </pre>
                    </div>
                  </div>
                )}
                {activeTab !== 'instructions' && (
                  <div className="space-y-4">
                     <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Repository Status</h3>
                     <div className="bg-[#0b0c10] border border-white/5 rounded-lg p-3 space-y-2">
                       <div className="flex justify-between text-xs">
                         <span className="text-gray-400">Branch</span>
                         <span className="font-mono text-[var(--color-neon-cyan)]">feat/player-movement</span>
                       </div>
                       <div className="flex justify-between text-xs">
                         <span className="text-gray-400">Latest Commit</span>
                         <span className="font-mono text-gray-300">a1b2c3d</span>
                       </div>
                       <div className="flex justify-between text-xs">
                         <span className="text-gray-400">CI Status</span>
                         <span className="text-emerald-400 flex items-center gap-1"><CheckCircle size={10}/> Passing</span>
                       </div>
                     </div>
                  </div>
                )}
             </div>
           </div>
        </div>

        {/* Right pane: Editor/Preview */}
        <div className="flex-1 glass-panel overflow-hidden flex flex-col bg-[#0b0c10]/90">
             <div className="h-10 border-b border-white/10 flex items-center px-4 bg-white/5 shrink-0 justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-gray-500" />
                  <span className="text-xs font-mono text-gray-400">
                    {activeTab === 'diff' ? 'Assets/Scripts/PlayerController.cs (Diff view)' : activeTab === 'preview' ? 'Unity WebGL Preview' : '/workspace'}
                  </span>
                </div>
                {activeTab === 'preview' && (
                  <div className="flex items-center gap-2">
                     <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                     </span>
                     <span className="text-[10px] text-emerald-400 uppercase tracking-widest">Running</span>
                  </div>
                )}
             </div>
             
             <div className="flex-1 overflow-auto relative">
                {activeTab === 'instructions' && (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm flex-col gap-2">
                    <ArrowLeft size={24} className="opacity-50" />
                    <p>Select "Code Diff" or "Preview" to view your workspace</p>
                  </div>
                )}

                {activeTab === 'diff' && (
                  <div className="p-4 font-mono text-sm">
                    <div className="mb-4">
                      <div className="text-gray-500 text-xs mb-1">@@ -15,10 +15,12 @@</div>
                      <div className="text-gray-400 pl-4 border-l-2 border-transparent">{'    void FixedUpdate() {'}</div>
                      <div className="text-red-400 bg-red-500/10 pl-4 border-l-2 border-red-500/50">-        transform.position += Vector3.forward * speed * Time.deltaTime;</div>
                      <div className="text-emerald-400 bg-emerald-500/10 pl-4 border-l-2 border-emerald-500/50">+        float moveHorizontal = Input.GetAxis("Horizontal");</div>
                      <div className="text-emerald-400 bg-emerald-500/10 pl-4 border-l-2 border-emerald-500/50">+        float moveVertical = Input.GetAxis("Vertical");</div>
                      <div className="text-emerald-400 bg-emerald-500/10 pl-4 border-l-2 border-emerald-500/50">+</div>
                      <div className="text-emerald-400 bg-emerald-500/10 pl-4 border-l-2 border-emerald-500/50">+        Vector3 movement = new Vector3(moveHorizontal, 0.0f, moveVertical);</div>
                      <div className="text-emerald-400 bg-emerald-500/10 pl-4 border-l-2 border-emerald-500/50">+        rb.AddForce(movement * speed);</div>
                      <div className="text-gray-400 pl-4 border-l-2 border-transparent">{'    }'}</div>
                    </div>
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div className="h-full w-full flex items-center justify-center relative overflow-hidden bg-white">
                     {/* Simulated iframe preview of the student's app */}
                     <div className="absolute inset-0 bg-[#0b0c10] grid place-items-center text-white">
                       <div className="text-center space-y-4">
                         <div className="w-[600px] h-[350px] bg-gray-800 rounded-lg shadow-2xl overflow-hidden relative">
                           <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]">
                             <Play size={48} className="text-white mb-4 opacity-80" />
                             <h1 className="text-xl font-bold font-sans">WebGL Build Preview</h1>
                             <p className="text-sm text-gray-400 mt-2">Click to load interactive Unity player</p>
                           </div>
                         </div>
                       </div>
                     </div>
                  </div>
                )}
             </div>
        </div>

      </div>

    </div>
  );
}
