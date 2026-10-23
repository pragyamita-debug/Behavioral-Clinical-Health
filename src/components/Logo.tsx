/** A sprig with a small morning sun behind it — used in the top bar, sidebar, footer and upload screen. */
export function Logo({ size = 34, light = false }: { size?: number; light?: boolean }) {
  const ink = light ? '#e9ecdf' : 'var(--forest)';
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <circle className="logo__sun" cx="27" cy="11" r="5" fill="var(--warm)" opacity="0.9" />
      <g fill="none" stroke={ink} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 35V13" />
        <path d="M20 21c-5.5 0-8.5-3.2-9.5-8.5 5.5 0 8.5 3.2 9.5 8.5Z" />
        <path d="M20 27c5.5 0 8.5-3.2 9.5-8.5-5.5 0-8.5 3.2-9.5 8.5Z" />
        <path d="M20 31c-4.5 0-7-2.5-8-6.5 4.5 0 7 2.5 8 6.5Z" />
        <path d="M20 13c0-3 1.2-5.5 3.5-7" />
      </g>
    </svg>
  );
}
