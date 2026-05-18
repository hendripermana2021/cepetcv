'use client';

import { CVData } from '@/types/cv';
import { Lang } from '@/lib/i18n';
import translations from '@/lib/i18n';

interface Props {
  data: CVData;
  lang: Lang;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <h2
          style={{
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: '#1a365d',
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </h2>
        <div style={{ flex: 1, height: '1.5px', backgroundColor: '#bfdbfe' }} />
      </div>
      {children}
    </div>
  );
}

export default function CVPreview({ data, lang }: Props) {
  const tr = translations[lang];
  const skills = data.skills
    ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const hasContent =
    data.name || data.email || data.phone || data.summary ||
    data.experience.length > 0 || data.education.length > 0 ||
    skills.length > 0 || data.languages.length > 0 || data.projects.length > 0;

  if (!hasContent) {
    return (
      <div
        id="cv-preview"
        style={{
          width: '794px',
          minHeight: '1123px',
          backgroundColor: 'white',
          fontFamily: 'Arial, Helvetica, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#a0aec0',
          fontSize: '14px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
          <p>Isi form di sebelah kiri untuk melihat preview CV kamu</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="cv-preview"
      style={{
        width: '794px',
        minHeight: '1123px',
        backgroundColor: 'white',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '13px',
        color: '#2d3748',
        lineHeight: '1.6',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#1a365d', color: 'white', padding: '36px 44px 30px' }}>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: '700',
            margin: '0 0 4px',
            letterSpacing: '-0.3px',
            color: 'white',
          }}
        >
          {data.name || 'Your Name'}
        </h1>

        {data.title && (
          <p style={{ fontSize: '14px', color: '#93c5fd', margin: '0 0 16px', fontWeight: '400' }}>
            {data.title}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px 20px',
            fontSize: '11.5px',
            color: '#bfdbfe',
          }}
        >
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>📞 {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
          {data.website && <span>🔗 {data.website}</span>}
          {data.linkedin && <span>in {data.linkedin}</span>}
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div style={{ padding: '32px 44px' }}>

        {/* Summary */}
        {data.summary && (
          <Section title={tr.summarySection}>
            <p style={{ color: '#4a5568', margin: 0 }}>{data.summary}</p>
          </Section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <Section title={tr.experienceSection}>
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '18px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '13.5px' }}>{exp.position}</div>
                    <div style={{ color: '#2563eb', fontSize: '12.5px' }}>
                      {exp.company}
                      {exp.location ? ` · ${exp.location}` : ''}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '11.5px',
                      color: '#718096',
                      whiteSpace: 'nowrap',
                      marginTop: '2px',
                    }}
                  >
                    {exp.startDate} — {exp.current ? tr.present : exp.endDate}
                  </div>
                </div>
                {exp.description && (
                  <div style={{ marginTop: '6px', color: '#4a5568', whiteSpace: 'pre-line', fontSize: '12.5px' }}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <Section title={tr.educationSection}>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '14px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '13.5px' }}>{edu.school}</div>
                    <div style={{ color: '#2563eb', fontSize: '12.5px' }}>
                      {edu.degree} {edu.field}
                    </div>
                    {edu.gpa && (
                      <div style={{ fontSize: '11.5px', color: '#718096' }}>GPA: {edu.gpa}</div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '11.5px',
                      color: '#718096',
                      whiteSpace: 'nowrap',
                      marginTop: '2px',
                    }}
                  >
                    {edu.startDate} — {edu.endDate}
                  </div>
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Section title={tr.skillsSection}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <Section title={tr.languagesSection}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {data.languages.map((l) => (
                <span key={l.id} style={{ fontSize: '12.5px' }}>
                  <strong>{l.language}</strong>
                  {l.level && (
                    <span style={{ color: '#718096', marginLeft: '5px' }}>({l.level})</span>
                  )}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <Section title={tr.projectsSection}>
            {data.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontWeight: '700', fontSize: '13.5px' }}>{proj.name}</span>
                  {proj.url && (
                    <span style={{ fontSize: '11.5px', color: '#2563eb' }}>{proj.url}</span>
                  )}
                </div>
                {proj.technologies && (
                  <div style={{ fontSize: '11.5px', color: '#718096', margin: '3px 0' }}>
                    {proj.technologies}
                  </div>
                )}
                {proj.description && (
                  <div style={{ fontSize: '12.5px', color: '#4a5568' }}>{proj.description}</div>
                )}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}
