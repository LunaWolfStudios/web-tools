import React, { useState } from 'react';
import { Bot, X, Sparkles, Send, FileText, Activity } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AIAssistantPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your VDOT Occupational Health AI Assistant. I can help summarize records, detect risks, and explain compliance policies. What can I help you with today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const suggestedQueries = [
    "Summarize overarching compliance risks.",
    "Who is overdue for audiograms in Bristol?",
    "Generate OSHA snapshot for last 30 days."
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue('');
    
    // Simulate AI thinking and response
    setTimeout(() => {
      let reply = "I've analyzed the current data. No immediate anomalies found.";
      if (text.toLowerCase().includes('bristol') || text.toLowerCase().includes('audiogram')) {
        reply = "Looking at the **Bristol district**, there are currently 14 employees overdue for audiograms. The risk grouping is primarily in the Construction department. I recommend scheduling a mobile testing unit.";
      } else if (text.toLowerCase().includes('snapshot') || text.toLowerCase().includes('osha')) {
        reply = "I've drafted a preliminary OSHA 300A compliance summary based on the 3 flagged exposures in the last 30 days. Would you like me to export this to your documents?";
      } else if (text.toLowerCase().includes('risk')) {
        reply = "The overall compliance is 88.4%. The primary risks currently identified are: \n- 142 Overdue Exams (High priority)\n- 3 Recent chemical exposures on Route 460.\nI flag the Route 460 incident for immediate follow-up.";
      }
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    }, 1500);
  };

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 w-80 sm:w-96 bg-card border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-chart-2 flex items-center justify-center text-primary-foreground text-xs font-bold">
            AI
          </div>
          <div>
            <h2 className="text-sm font-semibold">Health Assistant</h2>
            <p className="text-[10px] text-chart-4 tracking-wide uppercase">Online • Ready to Analyze</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
              msg.role === 'user' 
                ? "bg-primary text-primary-foreground rounded-tr-sm" 
                : "bg-muted/50 text-foreground border border-border rounded-tl-sm"
            )}>
              {msg.role === 'assistant' && idx !== 0 && (
                <div className="flex items-center space-x-1 mb-2 text-xs text-primary font-medium">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Analysis</span>
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-border bg-background/40">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestedQueries.map((q, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(q)}
              className="text-[11px] bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1.5 transition-colors whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
        <form 
          className="relative flex items-center"
          onSubmit={e => {
            e.preventDefault();
            handleSend(inputValue);
          }}
        >
          <input 
            type="text" 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask a compliance query..." 
            className="w-full bg-card border border-border rounded-full pl-4 pr-12 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground transition-all"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim()}
            className="absolute right-2 p-1.5 text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted rounded-full transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
