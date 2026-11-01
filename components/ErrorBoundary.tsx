import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[SRS Genie] Unhandled React Error Boundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetAndReload = () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('srs_genie_saas_store');
      localStorage.removeItem('srs_genie_current_user');
      localStorage.removeItem('srs_genie_saved_projects');
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ink text-body flex items-center justify-center p-6 select-none font-body">
          <div className="max-w-xl w-full bg-surface border border-line p-8 shadow-2xl relative overflow-hidden">
            {/* Top red accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded bg-accent/15 border border-accent/40 flex items-center justify-center text-accent">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display text-xs uppercase tracking-widest text-muted">System Diagnostics</div>
                <h2 className="font-display text-xl font-bold text-headline uppercase tracking-wider">
                  Application Encountered An Issue
                </h2>
              </div>
            </div>

            <p className="text-sm text-body/80 mb-6 leading-relaxed">
              An unexpected render issue occurred while loading this view. You can reload the application or reset stored local state to recover.
            </p>

            {this.state.error && (
              <div className="mb-6 p-4 bg-box border border-line text-xs font-mono text-accent overflow-auto max-h-40 whitespace-pre-wrap select-text">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={this.handleReload}
                className="btn btn--accent flex items-center gap-2 text-xs py-2.5 px-4"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleResetAndReload}
                className="btn btn--secondary flex items-center gap-2 text-xs py-2.5 px-4"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Cache & Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

