'use client';

import { CVData } from '@/types/cv';
import { Lang } from '@/lib/i18n';
import translations from '@/lib/i18n';

interface Props {
  data: CVData;
  lang: Lang;
}

const fontMap: Record<CVData['fontFamily'], string> = {
  arial: 'Arial, Helvetica, sans-serif',
  georgia: 'Georgia, Times New Roman, serif',
  poppins: 'Poppins, Arial, Helvetica, sans-serif',
};

function hexToRgba(hex: string, alpha: number) {
  const safeHex = hex.replace('#', '');
  const full = safeHex.length === 3
    ? safeHex.split('').map((char) => char + char).join('')
    : safeHex;

  if (full.length !== 6) return `rgba(37,99,235,${alpha})`;

  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type SectionKey =
  | 'summary'
  | 'international'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'certifications'
  | 'references'
  | 'ats';

const formatSectionOrder: Record<CVData['cvFormat'], SectionKey[]> = {
  id: ['summary', 'international', 'experience', 'education', 'skills', 'certifications', 'projects', 'languages', 'references', 'ats'],
  us: ['summary', 'experience', 'skills', 'projects', 'certifications', 'education', 'languages', 'international', 'references', 'ats'],
  eu: ['summary', 'international', 'experience', 'skills', 'education', 'projects', 'certifications', 'languages', 'references', 'ats'],
  uk: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages', 'international', 'references', 'ats'],
};

function Section({
  title,
  children,
  titleColor,
  dividerColor,
}: {
  title: string;
  children: React.ReactNode;
  titleColor: string;
  dividerColor: string;
}) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <h2
          style={{
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: titleColor,
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </h2>
        <div style={{ flex: 1, height: '1.5px', backgroundColor: dividerColor }} />
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
    skills.length > 0 || data.languages.length > 0 || data.projects.length > 0 ||
    data.certifications.length > 0 || data.references.length > 0 ||
    data.nationality || data.desiredCountry || data.remotePreference || data.willingToRelocate ||
    data.targetRole || data.targetKeywords || data.workAuthorization || data.expectedSalary || data.noticePeriod;

  const atsKeywords = data.targetKeywords
    ? data.targetKeywords.split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  const primaryColor = data.primaryColor || '#1a365d';
  const accentColor = data.accentColor || '#2563eb';
  const selectedFont = fontMap[data.fontFamily] || fontMap.arial;
  const isClassic = data.template === 'classic';
  const isModern = data.template === 'modern';
  const sectionTheme = {
    titleColor: primaryColor,
    dividerColor: hexToRgba(accentColor, 0.35),
  };

  if (!hasContent) {
    return (
      <div
        id="cv-preview"
        style={{
          width: '794px',
          minHeight: '1123px',
          backgroundColor: 'white',
          fontFamily: selectedFont,
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
        fontFamily: selectedFont,
        fontSize: '13px',
        color: '#2d3748',
        lineHeight: '1.6',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: isClassic ? primaryColor : '#ffffff',
          color: isClassic ? 'white' : '#111827',
          padding: isModern ? '28px 44px 24px' : '36px 44px 30px',
          borderBottom: isClassic ? 'none' : `3px solid ${accentColor}`,
          boxShadow: isModern ? '0 2px 10px rgba(15,23,42,0.06)' : 'none',
        }}
      >
        <h1
          style={{
            fontSize: '26px',
            fontWeight: '700',
            margin: '0 0 4px',
            letterSpacing: '-0.3px',
            color: isClassic ? 'white' : primaryColor,
          }}
        >
          {data.name || 'Your Name'}
        </h1>

        {data.title && (
          <p style={{ fontSize: '14px', color: isClassic ? hexToRgba(accentColor, 0.95) : accentColor, margin: '0 0 16px', fontWeight: '400' }}>
            {data.title}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px 20px',
            fontSize: '11.5px',
            color: isClassic ? hexToRgba(accentColor, 0.82) : '#475569',
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
        {formatSectionOrder[data.cvFormat].map((section) => {
          if (section === 'summary' && data.summary) {
            return (
              <Section key={section} title={tr.summarySection} {...sectionTheme}>
                <p style={{ color: '#4a5568', margin: 0 }}>{data.summary}</p>
              </Section>
            );
          }

          if (section === 'international' && (data.nationality || data.desiredCountry || data.remotePreference || data.willingToRelocate)) {
            return (
              <Section key={section} title={tr.internationalSection} {...sectionTheme}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px 16px' }}>
                  {data.nationality && (
                    <div style={{ fontSize: '12.5px', color: '#4a5568' }}>
                      <strong>{tr.nationality}:</strong> {data.nationality}
                    </div>
                  )}
                  {data.desiredCountry && (
                    <div style={{ fontSize: '12.5px', color: '#4a5568' }}>
                      <strong>{tr.desiredCountry}:</strong> {data.desiredCountry}
                    </div>
                  )}
                  {data.remotePreference && (
                    <div style={{ fontSize: '12.5px', color: '#4a5568' }}>
                      <strong>{tr.remotePreference}:</strong> {data.remotePreference}
                    </div>
                  )}
                  {data.willingToRelocate && (
                    <div style={{ fontSize: '12.5px', color: '#4a5568' }}>
                      <strong>{tr.willingToRelocate}</strong>
                    </div>
                  )}
                </div>
              </Section>
            );
          }

          if (section === 'experience' && data.experience.length > 0) {
            return (
              <Section key={section} title={tr.experienceSection} {...sectionTheme}>
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
                        <div style={{ color: accentColor, fontSize: '12.5px' }}>
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
            );
          }

          if (section === 'education' && data.education.length > 0) {
            return (
              <Section key={section} title={tr.educationSection} {...sectionTheme}>
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
                        <div style={{ color: accentColor, fontSize: '12.5px' }}>
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
            );
          }

          if (section === 'skills' && skills.length > 0) {
            return (
              <Section key={section} title={tr.skillsSection} {...sectionTheme}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '4px 18px' }}>
                  {skills.map((skill, i) => (
                    <div
                      key={`${skill}-${i}`}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        color: '#334155',
                        fontSize: '12.5px',
                      }}
                    >
                      <span style={{ color: accentColor, fontWeight: '700', lineHeight: '1.4' }}>•</span>
                      <span style={{ lineHeight: '1.4' }}>{skill}</span>
                    </div>
                  ))}
                </div>
              </Section>
            );
          }

          if (section === 'languages' && data.languages.length > 0) {
            return (
              <Section key={section} title={tr.languagesSection} {...sectionTheme}>
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
            );
          }

          if (section === 'projects' && data.projects.length > 0) {
            return (
              <Section key={section} title={tr.projectsSection} {...sectionTheme}>
                {data.projects.map((proj) => (
                  <div key={proj.id} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ fontWeight: '700', fontSize: '13.5px' }}>{proj.name}</span>
                      {proj.url && (
                        <span style={{ fontSize: '11.5px', color: accentColor }}>{proj.url}</span>
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
            );
          }

          if (section === 'certifications' && data.certifications.length > 0) {
            return (
              <Section key={section} title={tr.certificationsSection} {...sectionTheme}>
                {data.certifications.map((cert) => (
                  <div key={cert.id} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '13.5px' }}>{cert.name}</div>
                        <div style={{ color: accentColor, fontSize: '12.5px' }}>{cert.issuer}</div>
                        {cert.credentialId && (
                          <div style={{ fontSize: '11.5px', color: '#718096' }}>
                            ID: {cert.credentialId}
                          </div>
                        )}
                      </div>
                      {cert.issueDate && (
                        <div style={{ fontSize: '11.5px', color: '#718096', whiteSpace: 'nowrap' }}>
                          {cert.issueDate}
                        </div>
                      )}
                    </div>
                    {cert.url && (
                      <div style={{ fontSize: '11.5px', color: accentColor, marginTop: '3px' }}>{cert.url}</div>
                    )}
                  </div>
                ))}
              </Section>
            );
          }

          if (section === 'references' && data.references.length > 0) {
            return (
              <Section key={section} title={tr.referencesSection} {...sectionTheme}>
                {data.references.map((ref) => (
                  <div key={ref.id} style={{ marginBottom: '14px' }}>
                    <div style={{ fontWeight: '700', fontSize: '13.5px' }}>{ref.name}</div>
                    <div style={{ color: accentColor, fontSize: '12.5px' }}>
                      {ref.title}{ref.company ? ` · ${ref.company}` : ''}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#4a5568', marginTop: '2px' }}>
                      {ref.email ? `✉ ${ref.email}` : ''}
                      {ref.email && ref.phone ? ' · ' : ''}
                      {ref.phone ? `📞 ${ref.phone}` : ''}
                    </div>
                    {ref.relation && (
                      <div style={{ fontSize: '11.5px', color: '#718096' }}>{ref.relation}</div>
                    )}
                  </div>
                ))}
              </Section>
            );
          }

          if (section === 'ats' && (data.targetRole || atsKeywords.length > 0 || data.workAuthorization || data.expectedSalary || data.noticePeriod)) {
            return (
              <Section key={section} title={tr.atsSection} {...sectionTheme}>
                {data.targetRole && (
                  <div style={{ fontSize: '12.5px', color: '#4a5568', marginBottom: '6px' }}>
                    <strong>{tr.targetRole}:</strong> {data.targetRole}
                  </div>
                )}
                {atsKeywords.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '4px 18px', marginBottom: '8px' }}>
                    {atsKeywords.map((keyword, idx) => (
                      <div
                        key={`${keyword}-${idx}`}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          color: '#334155',
                          fontSize: '11.5px',
                        }}
                      >
                        <span style={{ color: accentColor, fontWeight: '700', lineHeight: '1.4' }}>•</span>
                        <span style={{ lineHeight: '1.4' }}>{keyword}</span>
                      </div>
                    ))}
                  </div>
                )}
                {data.workAuthorization && (
                  <div style={{ fontSize: '12px', color: '#4a5568' }}>
                    <strong>{tr.workAuthorization}:</strong> {data.workAuthorization}
                  </div>
                )}
                {(data.expectedSalary || data.noticePeriod) && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px 12px', marginTop: '6px' }}>
                    {data.expectedSalary && (
                      <div style={{ fontSize: '12px', color: '#4a5568' }}>
                        <strong>{tr.expectedSalary}:</strong> {data.expectedSalary} {data.salaryCurrency || ''}
                      </div>
                    )}
                    {data.noticePeriod && (
                      <div style={{ fontSize: '12px', color: '#4a5568' }}>
                        <strong>{tr.noticePeriod}:</strong> {data.noticePeriod}
                      </div>
                    )}
                  </div>
                )}
              </Section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
