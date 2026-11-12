import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import ErrorState from "./ui/ErrorState";

interface ErrorBoundaryProps {
  children: ReactNode;
  fullScreen?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error al mostrar la pantalla", error, info.componentStack);
  }

  retry = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;

    const fallback = (
      <ErrorState
        title={navigator.onLine ? "Algo salió mal en esta pantalla" : "No pudimos abrir esta pantalla"}
        body={navigator.onLine
          ? "No es tu culpa. Vuelve a intentarlo; si sigue pasando, recarga la página."
          : "Sin conexión: revisa tu red y vuelve a intentarlo."}
        onRetry={this.retry}
      />
    );

    return this.props.fullScreen
      ? <div className="flex min-h-screen items-center justify-center p-4"><div className="w-full max-w-md">{fallback}</div></div>
      : fallback;
  }
}
