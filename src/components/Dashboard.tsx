import { useEffect, useState } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import type { StoredProfile } from '../lib/types';
import { NAV, SideBar, TopBar } from './Chrome';
import { Hero, splitHeadline, StatRow } from './Hero';
import { AboutRow, ContactSection, EducationAchievements, ExperienceSection, Footer, ProjectsSection, SkillsSection } from './Sections';
import './Dashboard.css';

const IDS = NAV.map((n) => n.id);

interface Props {
  profile: StoredProfile;
  isExample: boolean;
  onUploadNew: () => void;
  onEdit: () => void;
  onReset: () => void;
  onDownloadCv: () => void;
}

export function Dashboard({ profile, isExample, onUploadNew, onEdit, onReset, onDownloadCv }: Props) {
  const { resume } = profile;
  const active = useScrollSpy(IDS, 140);
  const [menu, setMenu] = useState(false);
  const [role, focus] = splitHeadline(resume.headline);

  // lock the page behind the sidebar drawer on small screens
  useEffect(() => {
    document.body.classList.toggle('has-drawer', menu);
    return () => document.body.classList.remove('has-drawer');
  }, [menu]);

  return (
    <div className="shell">
      <TopBar
        name={resume.name}
        role={focus || role || ''}
        goals={resume.goals}
        isExample={isExample}
        menuOpen={menu}
        onMenu={() => setMenu((m) => !m)}
        onUploadNew={onUploadNew}
        onEdit={onEdit}
        onDownloadCv={onDownloadCv}
        onReset={onReset}
      />
      <SideBar active={active} motto={resume.motto || 'Understand people, build better lives.'} open={menu} onNavigate={() => setMenu(false)} />
      {menu && <button className="scrim" aria-label="Close navigation" onClick={() => setMenu(false)} />}

      <main className="main">
        <Hero resume={resume} isExample={isExample} onUpload={onUploadNew} />
        <StatRow resume={resume} />
        <div className="content">
          <AboutRow resume={resume} isExample={isExample} onDownloadCv={onDownloadCv} />
          <ExperienceSection resume={resume} />
          <ProjectsSection resume={resume} />
          <SkillsSection resume={resume} />
          <EducationAchievements resume={resume} />
          <ContactSection resume={resume} />
        </div>
      </main>
      <Footer resume={resume} />
    </div>
  );
}
