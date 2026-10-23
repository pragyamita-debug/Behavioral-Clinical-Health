import { useEffect, useRef, useState } from 'react';
import books from '../assets/photos/books.jpg';
import p1 from '../assets/photos/project-1.jpg';
import p2 from '../assets/photos/project-2.jpg';
import p3 from '../assets/photos/project-3.jpg';
import p4 from '../assets/photos/project-4.jpg';
import { useCountUp } from '../hooks/useCountUp';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Resume } from '../lib/types';
import { NAV } from './Chrome';
import { GlowCard } from './GlowCard';
import { splitHeadline } from './Hero';
import { Icon, type IconName } from './Icon';
import { Logo } from './Logo';
import { Reveal } from './Reveal';

const PHOTOS = [p1, p2, p3, p4];
const PROJECT_ICONS: IconName[] = ['brain', 'lotus', 'heartPulse', 'chart'];
const SKILL_ICONS: IconName[] = ['brain', 'file', 'mail', 'target', 'users', 'chart', 'book', 'bulb', 'chat', 'layers'];

function Heading({ label, title, id, children }: { label: string; title: React.ReactNode; id: string; children?: React.ReactNode }) {
  return (
    <div className="heading">
      <div>
        <span className="eyebrow">{label}</span>
        <h2 id={id} className="title">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

/* ================= About · Current focus · Quick links ================= */

export function AboutRow({ resume, isExample, onDownloadCv }: { resume: Resume; isExample: boolean; onDownloadCv: () => void }) {
  const current = resume.experience[0];
  const focus: { icon: IconName; title: string; text: string }[] = [
    current && { icon: 'brain' as IconName, title: current.role, text: [current.company, current.period].filter(Boolean).join(' · ') },
    ...resume.goals.slice(0, 2).map((g, i) => ({ icon: (i ? 'heart' : 'sprout') as IconName, title: g.label === 'Goal' ? 'Future Goals' : g.label, text: g.value })),
  ]
    .filter(Boolean)
    .slice(0, 3) as { icon: IconName; title: string; text: string }[];

  const links: { icon: IconName; label: string; href?: string; run?: () => void }[] = [
    { icon: 'download', label: isExample ? 'View Sample CV' : 'View Resume', run: onDownloadCv },
    { icon: 'calendar', label: 'Experience', href: '#experience' },
    { icon: 'pin', label: 'My Projects', href: '#projects' },
    { icon: 'mail', label: 'Contact Me', href: resume.email ? `mailto:${resume.email}` : '#contact' },
  ];

  return (
    <section id="about" className="row3" aria-label="About">
      <Reveal className="panel about">
        <h2 className="panel__title panel__title--rule" data-search>
          About Me
        </h2>
        <p data-search>{resume.summary || resume.tagline}</p>
        <a className="pill pill--sm about__btn" href="#projects">
          View My Projects <Icon name="arrowRight" size={15} />
        </a>
      </Reveal>

      <Reveal className="panel" delay={100}>
        <h2 className="panel__title">
          <Icon name="target" size={20} /> Current Focus
        </h2>
        <ul className="focus">
          {focus.map((f, i) => (
            <li key={f.title + i} data-search>
              <span className="focus__icon">
                <Icon name={f.icon} size={18} />
              </span>
              <span>
                <b>{f.title}</b>
                <small>{f.text}</small>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="panel" delay={200}>
        <h2 className="panel__title">
          <Icon name="link" size={19} /> Quick Links
        </h2>
        <ul className="links">
          {links.map((l) => (
            <li key={l.label}>
              {l.run ? (
                <button onClick={l.run}>
                  <Icon name={l.icon} size={17} /> {l.label} <Icon name="chevronRight" size={15} className="links__chev" />
                </button>
              ) : (
                <a href={l.href}>
                  <Icon name={l.icon} size={17} /> {l.label} <Icon name="chevronRight" size={15} className="links__chev" />
                </a>
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

/* ================= Experience ================= */

function Years({ value, plus }: { value: number; plus: boolean }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.5);
  const n = useCountUp(value, inView, { duration: 2200 });
  return (
    <span ref={ref} className="years" aria-label={`${value}${plus ? '+' : ''} years of experience`}>
      <b aria-hidden>
        {Math.round(n)}
        {plus && <i className={n >= value * 0.98 ? 'is-on' : ''}>+</i>}
      </b>
      <small>
        years of
        <br />
        experience
      </small>
    </span>
  );
}

export function ExperienceSection({ resume }: { resume: Resume }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const roles = resume.experience.slice(0, 4);

  useEffect(() => {
    if (reduced || paused || roles.length < 2) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % roles.length), 3000);
    return () => clearInterval(t);
  }, [reduced, paused, roles.length]);

  return (
    <section id="experience" className="panel block" aria-labelledby="experience-title">
      <Heading label="Experience" id="experience-title" title="Where I’ve Learned & Contributed">
        <Years value={resume.stats.years} plus={resume.stats.yearsPlus} />
      </Heading>
      {roles.length ? (
        <ol className="timeline" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
          {roles.map((e, i) => (
            <Reveal as="li" key={e.role + i} delay={i * 110} onPointerEnter={() => setActive(i)}>
              <span className={`timeline__dot ${i === active ? 'is-on' : ''}`} aria-hidden />
              <GlowCard className={`role ${i === active ? 'is-current' : ''}`} accent={i === active ? 'amber' : 'green'} active={i === active} phase={i * 0.3} speed={7} tilt={false}>
                <div className="role__head" data-search>
                  <div>
                    <h3>{e.role}</h3>
                    <p>{[e.company, e.location].filter(Boolean).join(' · ')}</p>
                  </div>
                  {e.period && <span className={`role__period ${e.current ? 'is-now' : ''}`}>{e.period}</span>}
                </div>
                {e.bullets.length > 0 && (
                  <ul data-search>
                    {e.bullets.slice(0, 3).map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </GlowCard>
            </Reveal>
          ))}
        </ol>
      ) : (
        <p className="empty">No experience section was found in the CV.</p>
      )}
    </section>
  );
}

/* ================= Projects carousel ================= */

export function ProjectsSection({ resume }: { resume: Resume }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const projects = resume.projects.length ? resume.projects : resume.skills.slice(0, 4).map((s) => ({ title: s, description: '', tags: [], meta: 'Skill' }));

  const update = () => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(update, [projects.length]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.project');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 240) + 16), behavior: 'smooth' });
  };

  return (
    <section id="projects" className="panel block" aria-labelledby="projects-title">
      <Heading label="My Projects" id="projects-title" title="Research. Analyse. Create Impact.">
        <div className="arrows">
          <button className="arrow" aria-label="Previous projects" disabled={edges.start} onClick={() => go(-1)}>
            <Icon name="chevronLeft" size={17} />
          </button>
          <button className="arrow" aria-label="Next projects" disabled={edges.end} onClick={() => go(1)}>
            <Icon name="chevronRight" size={17} />
          </button>
        </div>
      </Heading>
      <p className="block__intro">{resume.tagline || 'A few pieces of work I’m proud of.'}</p>

      <div className="carousel" ref={track} onScroll={update}>
        {projects.map((p, i) => (
          <Reveal key={p.title + i} delay={(i % 4) * 100} className="carousel__cell">
            <GlowCard className="project" accent={i % 2 ? 'amber' : 'green'} phase={i * 0.22} speed={7 + (i % 3)}>
              <div className="project__photo">
                <img src={PHOTOS[i % PHOTOS.length]} alt="" loading="lazy" />
              </div>
              <span className="project__icon" aria-hidden>
                <Icon name={PROJECT_ICONS[i % PROJECT_ICONS.length]} size={19} />
              </span>
              <div className="project__body" data-search>
                <h3>{p.title}</h3>
                <p className="project__meta">
                  <Icon name="pin" size={13} /> {p.meta?.split(' · ')[0] || 'Project'}
                </p>
                {p.description && <p className="project__text">{p.description}</p>}
                {p.tags.length > 0 && (
                  <p className="project__tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </p>
                )}
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= Skills & tools + the books photo ================= */

export function SkillsSection({ resume }: { resume: Resume }) {
  const [all, setAll] = useState(false);
  const shown = all ? resume.skills : resume.skills.slice(0, 8);
  return (
    <section id="skills" className="skills-row" aria-labelledby="skills-title">
      <div className="panel skills">
        <Heading label="Skills" id="skills-title" title="Skills & Tools I Use" />
        <p className="block__intro">A blend of research, analytical and interpersonal skills to create meaningful insights.</p>
        <ul className="skills__grid">
          {shown.map((s, i) => (
            <Reveal as="li" key={s} delay={(i % 8) * 60}>
              <GlowCard className="skill" accent={i % 3 === 1 ? 'amber' : 'green'} phase={i * 0.13} speed={5 + (i % 4)} data-search>
                <span className="skill__icon">
                  <Icon name={SKILL_ICONS[i % SKILL_ICONS.length]} size={19} />
                </span>
                <span className="skill__name">{s}</span>
              </GlowCard>
            </Reveal>
          ))}
        </ul>
        {resume.skills.length > 8 && (
          <button className="text-link skills__more" onClick={() => setAll((a) => !a)}>
            {all ? 'Show fewer' : `View all ${resume.skills.length} skills`} <Icon name="arrowRight" size={14} />
          </button>
        )}
      </div>

      <div className="skills__photo" aria-hidden>
        <img src={books} alt="" loading="lazy" />
        <p className="skills__note">
          <span>Small</span>
          <span>steps lead to</span>
          <span>big changes.</span>
          <Icon name="heart" size={15} />
        </p>
      </div>
    </section>
  );
}

/* ================= Education + Achievements ================= */

export function EducationAchievements({ resume }: { resume: Resume }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const wins = [...resume.achievements.map((a) => ({ text: a, kind: 'Achievement' })), ...resume.certifications.map((c) => ({ text: c, kind: 'Certification' }))].slice(0, 5);
  return (
    <div className="row2" ref={ref}>
      <section id="education" className="panel block" aria-labelledby="education-title">
        <Heading label="Education" id="education-title" title="Learning Path" />
        <ol className="edu">
          {resume.education.map((e, i) => (
            <Reveal as="li" key={e.degree + i} delay={i * 120} data-search>
              <span className="edu__badge">{e.short || '—'}</span>
              <span>
                <b>{e.degree}</b>
                <small>{[e.institution, e.year].filter(Boolean).join(' · ')}</small>
              </span>
            </Reveal>
          ))}
          {!resume.education.length && <li className="empty">No education section was found in the CV.</li>}
        </ol>
      </section>

      <section id="achievements" className="panel block" aria-labelledby="achievements-title">
        <Heading label="Achievements" id="achievements-title" title="Milestones & Credentials" />
        <ul className={`wins ${inView ? 'is-on' : ''}`}>
          {wins.map((w, i) => (
            <li key={w.text} style={{ ['--i' as string]: i }} data-search>
              <span className="wins__icon">
                <Icon name={w.kind === 'Achievement' ? 'trophy' : 'award'} size={17} />
              </span>
              <span>
                {w.text}
                <small>{w.kind}</small>
              </span>
            </li>
          ))}
          {!wins.length && <li className="empty">No achievements or certifications were found in the CV.</li>}
        </ul>
      </section>
    </div>
  );
}

/* ================= Contact ================= */

export function ContactSection({ resume }: { resume: Resume }) {
  const goal = resume.goals[0];
  return (
    <section id="contact" className="panel contact" aria-labelledby="contact-title">
      <Reveal className="contact__copy">
        <span className="eyebrow">Contact</span>
        <h2 id="contact-title" className="title">
          {goal ? goal.value : 'Let’s create meaningful change together'}
        </h2>
        <p>{goal?.note ? `Goal: ${goal.note}. ` : ''}Open to research collaborations, roles and conversations about behaviour and well-being.</p>
        <a className="pill" href={resume.email ? `mailto:${resume.email}` : '#home'}>
          Get in touch <Icon name="arrowRight" size={15} />
        </a>
      </Reveal>
      <ul className="contact__list">
        {resume.email && (
          <li>
            <Icon name="mail" size={17} /> <a href={`mailto:${resume.email}`}>{resume.email}</a>
          </li>
        )}
        {resume.phone && (
          <li>
            <Icon name="phone" size={17} /> <a href={`tel:${resume.phone.replace(/[^\d+]/g, '')}`}>{resume.phone}</a>
          </li>
        )}
        {resume.location && (
          <li>
            <Icon name="pin" size={17} /> {resume.location}
          </li>
        )}
        {resume.links.linkedin && (
          <li>
            <Icon name="linkedin" size={17} />{' '}
            <a href={resume.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn profile
            </a>
          </li>
        )}
      </ul>
    </section>
  );
}

/* ================= Footer ================= */

export function Footer({ resume }: { resume: Resume }) {
  const [role, focus] = splitHeadline(resume.headline);
  const words = resume.skills.slice(0, 3);
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__brand">
          <Logo size={34} light />
          <b>{focus || role || resume.name}</b>
        </span>
        <span className="footer__words">
          {words.map((w, i) => (
            <span key={w}>
              {i > 0 && <i>|</i>}
              {w}
            </span>
          ))}
        </span>
        <nav className="footer__nav" aria-label="Footer">
          {NAV.filter((n) => ['home', 'about', 'projects', 'contact'].includes(n.id)).map((n) => (
            <a key={n.id} href={`#${n.id}`}>
              {n.label}
            </a>
          ))}
        </nav>
        <nav className="footer__social" aria-label="Profiles">
          {resume.links.linkedin && (
            <a href={resume.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Icon name="linkedin" size={17} />
            </a>
          )}
          {resume.links.github && (
            <a href={resume.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Icon name="github" size={17} />
            </a>
          )}
          {resume.email && (
            <a href={`mailto:${resume.email}`} aria-label="Email">
              <Icon name="mail" size={17} />
            </a>
          )}
        </nav>
      </div>
      <p className="footer__base">
        © {new Date().getFullYear()} {resume.name}. Built from a CV.
      </p>
    </footer>
  );
}
