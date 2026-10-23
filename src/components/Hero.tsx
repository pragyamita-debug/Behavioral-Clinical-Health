import hero from '../assets/photos/hero.jpg';
import { useCountUp } from '../hooks/useCountUp';
import { useInView } from '../hooks/useInView';
import { useScramble } from '../hooks/useScramble';
import type { Resume } from '../lib/types';
import { GlowCard, type Accent } from './GlowCard';
import { Icon, type IconName } from './Icon';
import './Hero.css';

/** "Behavioural Psychologist | Health & Well-being Research" → ["Behavioural Psychologist", "Health & Well-being Research"] */
export const splitHeadline = (h: string) => h.split(/\s*[|•·–—]\s*/).filter(Boolean);

const THEME_ICONS: IconName[] = ['brain', 'heartPulse', 'sprout'];

/** The photo banner: desk by a sunny window, the motto written on the laptop screen. */
export function Hero({ resume }: { resume: Resume }) {
  const [role, focus] = splitHeadline(resume.headline);
  const themes = (resume.interests.length ? resume.interests : resume.skills).slice(0, 3);
  const motto = (resume.motto || 'Better choices. Brighter futures.').replace(/[.!]/g, '').split(/\s+/).slice(0, 5);

  return (
    <section id="home" className="banner" aria-label="Introduction">
      <div className="banner__art" aria-hidden>
        <img src={hero} alt="" />
        <span className="banner__sun" />
        <span className="banner__rays" />
        <span className="banner__beam" />
        <p className="banner__note">
          {motto.map((w, i) => (
            <span key={i} style={{ ['--i' as string]: i }}>
              {w}
            </span>
          ))}
          <Icon name="heart" size={14} className="banner__heart" />
        </p>
      </div>

      <div className="banner__copy">
        <p className="label banner__label">{focus || role || 'Portfolio'}</p>
        <h1 className="display banner__title" data-search>
          {resume.name}
          {role && <span>{role}</span>}
        </h1>
        {resume.tagline && <p className="banner__intro">{resume.tagline}</p>}
        {themes.length > 0 && (
          <ul className="banner__themes">
            {themes.map((t, i) => (
              <li key={t} style={{ ['--i' as string]: i }}>
                <Icon name={THEME_ICONS[i]} size={18} />
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ---------- the four stat cards under the banner ---------- */

function Stat({ icon, value, suffix = '', label, sub, index, run, accent }: { icon: IconName; value: number | string; suffix?: string; label: string; sub: string; index: number; run: boolean; accent: Accent }) {
  const numeric = typeof value === 'number';
  const n = useCountUp(numeric ? value : 0, run, { duration: 1900 + index * 200, delay: index * 140 });
  const text = useScramble(numeric ? '' : value, run && !numeric, { delay: index * 140 });
  const done = numeric ? n >= value * 0.98 : text === value;
  return (
    <GlowCard className="stat" accent={accent} phase={index * 0.25} speed={7 + index * 0.6}>
      <span className="stat__icon">
        <Icon name={icon} size={21} />
      </span>
      <b className="stat__value" aria-label={`${value}${suffix}`}>
        <span aria-hidden>
          {numeric ? Math.round(n) : text || ' '}
          {suffix && <i className={done ? 'is-on' : ''}>{suffix}</i>}
        </span>
      </b>
      <span className="stat__label">{label}</span>
      {sub && <small className="stat__sub">{sub}</small>}
    </GlowCard>
  );
}

export function StatRow({ resume }: { resume: Resume }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const { stats, skills, experience, projects } = resume;
  const edu = resume.education[0];
  const kinds = Array.from(new Set(projects.map((p) => p.meta?.split(' · ')[0]).filter(Boolean))).slice(0, 2);
  return (
    <div className="stats" ref={ref} aria-label="At a glance">
      <Stat index={0} run={inView} accent="green" icon="graduation" value={stats.years} suffix={stats.yearsPlus ? '+' : ''} label="Years of Experience" sub={experience[0]?.company || resume.location || ''} />
      <Stat index={1} run={inView} accent="amber" icon="brain" value={edu?.short || '—'} label="Education" sub={[edu?.field, edu?.year].filter(Boolean).join('  |  ')} />
      <Stat index={2} run={inView} accent="green" icon="file" value={stats.projects} suffix={stats.projectsPlus ? '+' : ''} label="Projects Completed" sub={kinds.join(' & ') || skills.slice(0, 2).join(' & ')} />
      <Stat index={3} run={inView} accent="amber" icon="star" value={stats.skills} label="Key Skills" sub={skills.slice(0, 2).join('  |  ')} />
    </div>
  );
}
