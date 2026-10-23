import { useEffect, useRef, useState } from 'react';
import type { Goal } from '../lib/types';
import { Icon, type IconName } from './Icon';
import { Logo } from './Logo';

export const NAV: { id: string; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'about', label: 'About', icon: 'user' },
  { id: 'experience', label: 'Experience', icon: 'calendar' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'skills', label: 'Skills', icon: 'cog' },
  { id: 'education', label: 'Education', icon: 'graduation' },
  { id: 'achievements', label: 'Achievements', icon: 'trophy' },
  { id: 'contact', label: 'Contact', icon: 'mail' },
];

/** Closes a popover on outside click / Escape. */
function useDismiss<T extends HTMLElement>(open: boolean, close: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => ref.current && !ref.current.contains(e.target as Node) && close();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);
  return ref;
}

/**
 * Searches the dashboard text (every element marked data-search) and scrolls to the first hit.
 * Small, but it makes the search box in the design actually do something.
 */
function findInPage(term: string) {
  const q = term.trim().toLowerCase();
  if (!q) return false;
  const hit = Array.from(document.querySelectorAll<HTMLElement>('main [data-search]')).find((el) => el.textContent?.toLowerCase().includes(q));
  if (!hit) return false;
  hit.scrollIntoView({ behavior: 'smooth', block: 'center' });
  hit.classList.remove('is-flash');
  void hit.offsetWidth; // restart the animation
  hit.classList.add('is-flash');
  return true;
}

interface TopBarProps {
  name: string;
  role: string;
  goals: Goal[];
  isExample: boolean;
  menuOpen: boolean;
  onMenu: () => void;
  onUploadNew: () => void;
  onEdit: () => void;
  onDownloadCv: () => void;
  onReset: () => void;
}

export function TopBar({ name, role, goals, isExample, menuOpen, onMenu, onUploadNew, onEdit, onDownloadCv, onReset }: TopBarProps) {
  const [term, setTerm] = useState('');
  const [miss, setMiss] = useState(false);
  const [bell, setBell] = useState(false);
  const [account, setAccount] = useState(false);
  const bellRef = useDismiss<HTMLDivElement>(bell, () => setBell(false));
  const accRef = useDismiss<HTMLDivElement>(account, () => setAccount(false));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const actions: { icon: IconName; label: string; run: () => void }[] = [
    { icon: 'upload', label: isExample ? 'Upload a CV' : 'Upload a new CV', run: onUploadNew },
    { icon: 'edit', label: 'Edit details', run: onEdit },
    { icon: 'download', label: isExample ? 'Download the sample CV' : 'Download the CV', run: onDownloadCv },
  ];
  if (!isExample) actions.push({ icon: 'refresh', label: 'Back to the example', run: onReset });

  return (
    <header className={`top ${scrolled ? 'is-scrolled' : ''}`}>
      <button className="icon-btn top__burger" aria-label="Open navigation" aria-expanded={menuOpen} onClick={onMenu}>
        <Icon name={menuOpen ? 'close' : 'menu'} size={17} />
      </button>
      <a className="top__brand" href="#home">
        <Logo />
        <span className="top__name wordmark">
          {name}
          <small>{role}</small>
        </span>
      </a>

      <form
        className={`search ${miss ? 'is-miss' : ''}`}
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setMiss(!findInPage(term));
        }}
      >
        <Icon name="search" size={16} />
        <input
          type="search"
          value={term}
          placeholder="Search skills, projects, experience…"
          aria-label="Search the dashboard"
          onChange={(e) => {
            setTerm(e.target.value);
            setMiss(false);
          }}
        />
        {miss && <span className="search__miss">No match</span>}
      </form>

      <div className="top__end">
        <div className="top__pop" ref={bellRef}>
          <button className="icon-btn top__bell" aria-label="What’s next" aria-expanded={bell} onClick={() => setBell((b) => !b)}>
            <Icon name="bell" size={19} />
            {goals.length > 0 && <span className="top__dot" />}
          </button>
          {bell && (
            <div className="popover popover--wide" role="dialog" aria-label="What’s next">
              <p className="popover__title">What’s next</p>
              {goals.length ? (
                <ul className="popover__list">
                  {goals.slice(0, 3).map((g) => (
                    <li key={g.label + g.value}>
                      <small>{g.label}</small>
                      {g.value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="popover__empty">Add a Goals section to the CV to show it here.</p>
              )}
            </div>
          )}
        </div>

        <div className="top__pop" ref={accRef}>
          <button className="top__avatar" aria-label="Dashboard options" aria-haspopup="menu" aria-expanded={account} onClick={() => setAccount((a) => !a)}>
            {isExample ? <Icon name="user" size={20} /> : initials}
          </button>
          {account && (
            <ul className="popover" role="menu">
              {actions.map((a) => (
                <li key={a.label} role="none">
                  <button
                    role="menuitem"
                    onClick={() => {
                      setAccount(false);
                      a.run();
                    }}
                  >
                    <Icon name={a.icon} size={16} /> {a.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}

export function SideBar({ active, motto, open, onNavigate }: { active: string; motto: string; open: boolean; onNavigate: () => void }) {
  return (
    <aside className={`side ${open ? 'is-open' : ''}`} aria-label="Sections">
      <nav className="side__nav">
        {NAV.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className={active === n.id ? 'is-active' : ''}
            aria-current={active === n.id ? 'location' : undefined}
            onClick={onNavigate}
          >
            <Icon name={n.icon} size={18} />
            {n.label}
          </a>
        ))}
      </nav>
      <div className="side__note">
        <Logo size={26} />
        <p>{motto}</p>
      </div>
    </aside>
  );
}
