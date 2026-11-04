export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <span className={`${sizes[size]} font-extrabold tracking-tight select-none`}>
      <span className="text-kumbh-orange" style={{ fontFamily: '"Noto Sans Devanagari", sans-serif' }}>
        कुंभ
      </span>
      <span className="text-kumbh-text ml-1">Ride</span>
    </span>
  );
}

