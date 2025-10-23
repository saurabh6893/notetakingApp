import React from "react";

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<unknown>,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(): void {
    console.error("Error caught in boundary");
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
