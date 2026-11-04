import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Copy,
  Check,
  Terminal,
  FileCode,
  Info,
  Lightbulb,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

// Parse YAML Frontmatter at top of .specs file if present
function parseFrontmatter(markdown: string): { frontmatter: Record<string, string> | null; cleanBody: string } {
  if (!markdown || !markdown.startsWith('---')) {
    return { frontmatter: null, cleanBody: markdown || '' };
  }

  const endIdx = markdown.indexOf('\n---', 3);
  if (endIdx === -1) {
    return { frontmatter: null, cleanBody: markdown };
  }

  const frontmatterBlock = markdown.slice(3, endIdx).trim();
  const cleanBody = markdown.slice(endIdx + 4).trim();

  const frontmatter: Record<string, string> = {};
  frontmatterBlock.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key) frontmatter[key] = val;
    }
  });

  return { frontmatter: Object.keys(frontmatter).length > 0 ? frontmatter : null, cleanBody };
}

// Code block with copy button and language badge
const CodeBlock: React.FC<{ language?: string; value: string }> = ({ language = 'text', value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanLang = language.replace('language-', '').toUpperCase();

  return (
    <div className="my-5 rounded-none border border-line bg-[#0d1117] shadow-lg overflow-hidden group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-surface/90 border-b border-line text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-semibold text-muted tracking-wider uppercase">
            {cleanLang || 'CODE'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 border border-line/60 bg-ink/60 hover:bg-box text-muted hover:text-white transition-all"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto text-xs font-mono text-gray-200 leading-relaxed custom-scrollbar">
        <pre className="!m-0 !p-0 !bg-transparent font-mono">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
};

// GitHub Style Alert Card
const AlertCard: React.FC<{ type: 'note' | 'tip' | 'important' | 'warning' | 'caution'; children: React.ReactNode }> = ({
  type,
  children
}) => {
  const configs = {
    note: {
      border: 'border-blue-500/40 bg-blue-950/20 text-blue-200',
      icon: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,
      label: 'Note'
    },
    tip: {
      border: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200',
      icon: <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
      label: 'Tip'
    },
    important: {
      border: 'border-purple-500/40 bg-purple-950/20 text-purple-200',
      icon: <AlertCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />,
      label: 'Important'
    },
    warning: {
      border: 'border-amber-500/40 bg-amber-950/20 text-amber-200',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
      label: 'Warning'
    },
    caution: {
      border: 'border-rose-500/40 bg-rose-950/20 text-rose-200',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />,
      label: 'Caution'
    }
  };

  const cfg = configs[type] || configs.note;

  return (
    <div className={`my-4 p-4 border-l-4 border ${cfg.border} shadow-sm space-y-1`}>
      <div className="flex items-center gap-1.5 font-display text-xs uppercase tracking-wider font-semibold">
        {cfg.icon}
        <span>{cfg.label}</span>
      </div>
      <div className="text-xs font-sans leading-relaxed pl-5 text-gray-200">
        {children}
      </div>
    </div>
  );
};

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = '' }) => {
  const { frontmatter, cleanBody } = parseFrontmatter(content || '');

  return (
    <div className={`markdown-viewer space-y-4 ${className}`}>
      {/* Elegant Spec Metadata Header from Frontmatter */}
      {frontmatter && (
        <div className="p-3.5 bg-box/80 border border-line mb-6 font-mono text-xs shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-line/60">
            <span className="font-display uppercase tracking-[0.16em] text-[10px] text-muted flex items-center gap-1.5 font-semibold">
              <Layers className="w-3.5 h-3.5 text-accent" />
              Canonical Specification Header
            </span>
            {frontmatter.updated && (
              <span className="text-[10px] text-muted">
                Updated: {frontmatter.updated}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {frontmatter.tier !== undefined && (
              <span className="px-2 py-0.5 bg-accent/15 border border-accent/40 text-accent font-semibold uppercase">
                Tier {frontmatter.tier}
              </span>
            )}
            {frontmatter.role && (
              <span className="px-2 py-0.5 bg-purple-900/30 border border-purple-700/40 text-purple-300 font-semibold uppercase">
                {frontmatter.role}
              </span>
            )}
            {frontmatter.owner && (
              <span className="px-2 py-0.5 bg-blue-900/30 border border-blue-700/40 text-blue-300">
                Owner: {frontmatter.owner}
              </span>
            )}
            {frontmatter['triggers-regen'] && (
              <span className="px-2 py-0.5 bg-amber-900/30 border border-amber-700/40 text-amber-300">
                Triggers: {frontmatter['triggers-regen']}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Formatted Markdown Content */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code block and inline code
          code({ className: codeClass, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClass || '');
            const isInline = !codeClass && typeof children === 'string' && !children.includes('\n');
            const codeString = String(children).replace(/\n$/, '');

            if (!isInline && match) {
              return <CodeBlock language={match[1]} value={codeString} />;
            }
            if (!isInline && codeString.includes('\n')) {
              return <CodeBlock language="text" value={codeString} />;
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded bg-surface border border-line/70 text-accent font-mono text-[11px]"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Tables
          table({ children }) {
            return (
              <div className="my-6 overflow-x-auto border border-line bg-box/30 shadow-md">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-surface border-b-2 border-line text-[11px] uppercase tracking-wider text-accent font-display">
                {children}
              </thead>
            );
          },
          th({ children }) {
            return (
              <th className="p-3 font-semibold text-white border-r border-line/30 last:border-r-0">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="p-3 border-b border-line/20 border-r border-line/20 last:border-r-0 text-gray-200">
                {children}
              </td>
            );
          },
          tr({ children }) {
            return (
              <tr className="hover:bg-box/70 transition-colors even:bg-ink/30">
                {children}
              </tr>
            );
          },

          // Blockquotes with alert detection
          blockquote({ children }) {
            // Check if content matches github alerts
            const textContent = Array.isArray(children)
              ? children.map(c => (typeof c === 'string' ? c : (c as any)?.props?.children)).flat().join(' ')
              : String(children);

            if (/\[!NOTE\]/i.test(textContent)) {
              return <AlertCard type="note">{children}</AlertCard>;
            }
            if (/\[!TIP\]/i.test(textContent)) {
              return <AlertCard type="tip">{children}</AlertCard>;
            }
            if (/\[!IMPORTANT\]/i.test(textContent)) {
              return <AlertCard type="important">{children}</AlertCard>;
            }
            if (/\[!WARNING\]/i.test(textContent)) {
              return <AlertCard type="warning">{children}</AlertCard>;
            }
            if (/\[!CAUTION\]/i.test(textContent)) {
              return <AlertCard type="caution">{children}</AlertCard>;
            }

            return (
              <blockquote className="my-4 border-l-4 border-accent bg-box/40 pl-4 py-2 text-xs italic text-gray-300 font-sans shadow-sm">
                {children}
              </blockquote>
            );
          },

          // Headings
          h1({ children }) {
            return (
              <h1 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-[0.06em] text-white mt-8 mb-4 pb-2 border-b border-line flex items-center gap-2">
                <span className="w-2 h-5 bg-accent inline-block" />
                <span>{children}</span>
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-base sm:text-lg font-display font-semibold uppercase tracking-[0.08em] text-accent mt-7 mb-3 pb-1 border-b border-line/40 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-accent inline-block" />
                <span>{children}</span>
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-xs sm:text-sm font-display font-semibold uppercase tracking-wider text-white mt-5 mb-2">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-muted mt-4 mb-1">
                {children}
              </h4>
            );
          },

          // Paragraphs
          p({ children }) {
            return (
              <p className="my-2.5 font-sans text-xs text-gray-200 leading-relaxed">
                {children}
              </p>
            );
          },

          // Lists
          ul({ children }) {
            return (
              <ul className="my-3 space-y-1 pl-5 list-disc text-xs font-sans text-gray-200 marker:text-accent">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="my-3 space-y-1 pl-5 list-decimal text-xs font-sans text-gray-200 marker:text-accent font-medium">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return (
              <li className="leading-relaxed">
                {children}
              </li>
            );
          },

          // Horizontal rule
          hr() {
            return <hr className="my-6 border-line/70" />;
          },

          // Links
          a({ href, children }) {
            return (
              <a
                href={href}
                className="text-accent hover:underline font-mono"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          }
        }}
      >
        {cleanBody}
      </ReactMarkdown>
    </div>
  );
};

