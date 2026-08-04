type FigmaCursorProps = {
  className?: string;
};

// Shared by Intro, Director and Follow so Javier remains the same collaborator
// in every editing state.
export function FigmaCursor({ className }: FigmaCursorProps) {
  return (
    <svg className={className} viewBox="0 0 24 28" aria-hidden="true" focusable="false" shapeRendering="geometricPrecision">
      <path d="M3.03 2.18 21.08 14.7a.78.78 0 0 1-.28 1.42l-6.73 1.5-3.68 6.44a.8.8 0 0 1-1.47-.2L1.98 3.1a.8.8 0 0 1 1.05-.92Z" fill="white" stroke="white" strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M3.03 2.18 21.08 14.7a.78.78 0 0 1-.28 1.42l-6.73 1.5-3.68 6.44a.8.8 0 0 1-1.47-.2L1.98 3.1a.8.8 0 0 1 1.05-.92Z" fill="currentColor" />
    </svg>
  );
}
