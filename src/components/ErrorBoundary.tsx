import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    // Auto-reload on dynamic import chunk loading failures
    const errorMessage = error?.message || "";
    const isChunkFailed = 
      errorMessage.includes("Failed to fetch dynamically imported module") ||
      errorMessage.includes("Loading chunk") ||
      errorMessage.includes("dynamic import failed") ||
      errorMessage.includes("Failed to fetch");

    if (isChunkFailed) {
      try {
        const chunkReloadKey = "chunk-failed-reload";
        const hasReloaded = sessionStorage.getItem(chunkReloadKey);
        if (!hasReloaded) {
          sessionStorage.setItem(chunkReloadKey, "true");
          window.location.reload();
        }
      } catch (e) {
        console.error("Failed to auto-reload:", e);
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
          <h1 style={{ color: "red" }}>Something went wrong.</h1>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f1f1f1", padding: "10px", borderRadius: "5px" }}>
            {this.state.error?.message}
            {"\n"}
            {this.state.error?.stack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ padding: "10px", marginTop: "10px", cursor: "pointer" }}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}
