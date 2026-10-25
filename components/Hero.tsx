import React from 'react';
import { ArrowRight, FileText, Code2, Cpu } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
        <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
        Powered by Gemini 2.5 Flash
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
        Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">SRS Documents</span>
        <br /> in Seconds.
      </h1>
      
      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
        Stop writing boilerplate. Create professional Software Requirement Specifications and actionable AI coding tasks instantly.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 focus:ring-offset-slate-900"
        >
          Start New Project
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <div className="absolute -inset-3 rounded-xl bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl text-left">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Detailed Reports</h3>
          <p className="text-slate-400">Generates full Markdown reports including Intro, Scope, Functional Requirements, and Architecture.</p>
        </div>
        
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
            <Code2 className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Vibe Coding Ready</h3>
          <p className="text-slate-400">Exports specific prompt chains optimized for AI code editors like Cursor and Windsurf.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
            <Cpu className="w-6 h-6 text-teal-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Modern Export</h3>
          <p className="text-slate-400">Download as PDF, Markdown, or Copy to Clipboard with a single click.</p>
        </div>
      </div>
    </div>
  );
};