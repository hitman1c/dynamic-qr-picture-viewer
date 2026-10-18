interface LoadingIndicatorProps {
  label: string;
}

export default function LoadingIndicator({ label }: LoadingIndicatorProps) {
  return (
    <div className="loading-indicator" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
