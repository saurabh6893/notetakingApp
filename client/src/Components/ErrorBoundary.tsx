import React from "react";

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ padding: 20, textAlign: "center" }}>
          <h1>Oops! Something went wrong.</h1>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
