'use client';

import { useState } from 'react';
import {
  User, FileText, Briefcase, GraduationCap,
  Wrench, Globe, FolderOpen, Trash2,
} from 'lucide-react';
import { CVData, Experience, Education, Language, Project } from '@/types/cv';
import { Lang } from '@/lib/i18n';
import translations from '@/lib/i18n';

interface Props {
  data: CVData;
  onChange: (partial: Partial<CVData>) => void;
  lang: Lang;
}

type TabId = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'languages' | 'projects';

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

// ── Reusable field helpers ────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white';

function TextInput({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <Field label={label}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
    </Field>
  );
}

function Textarea({
  label, value, onChange, placeholder, rows = 4,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <Field label={label}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${inputCls} resize-none`}
      />
    </Field>
  );
}

// ── Card wrapper for repeatable sections ─────────────────────────────────────

function ItemCard({
  index, label, onRemove, children,
}: {
  index: number; label: string; onRemove: () => void; children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50/50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {label} #{index + 1}
        </span>
        <button
          onClick={onRemove}
          className="text-gray-300 hover:text-red-500 transition-colors"
          title="Hapus"
        >
          <Trash2 size={15} />
        </button>
      </div>
      {children}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-500 rounded-xl text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-colors"
    >
      {label}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CVForm({ data, onChange, lang }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('personal');
  const tr = translations[lang];

  const tabs: { id: TabId; Icon: React.ElementType; label: string }[] = [
    { id: 'personal', Icon: User, label: tr.personalInfo },
    { id: 'summary', Icon: FileText, label: tr.summary },
    { id: 'experience', Icon: Briefcase, label: tr.experience },
    { id: 'education', Icon: GraduationCap, label: tr.education },
    { id: 'skills', Icon: Wrench, label: tr.skills },
    { id: 'languages', Icon: Globe, label: tr.languages },
    { id: 'projects', Icon: FolderOpen, label: tr.projects },
  ];

  // ── Experience ──────────────────────────────────────────────────────────────
  const addExp = () =>
    onChange({
      experience: [
        ...data.experience,
        { id: genId(), company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' },
      ],
    });

  const updExp = (id: string, field: keyof Experience, value: string | boolean) =>
    onChange({ experience: data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)) });

  const delExp = (id: string) =>
    onChange({ experience: data.experience.filter((e) => e.id !== id) });

  // ── Education ───────────────────────────────────────────────────────────────
  const addEdu = () =>
    onChange({
      education: [
        ...data.education,
        { id: genId(), school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
      ],
    });

  const updEdu = (id: string, field: keyof Education, value: string) =>
    onChange({ education: data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)) });

  const delEdu = (id: string) =>
    onChange({ education: data.education.filter((e) => e.id !== id) });

  // ── Languages ───────────────────────────────────────────────────────────────
  const addLang = () =>
    onChange({
      languages: [...data.languages, { id: genId(), language: '', level: tr.levels[1] }],
    });

  const updLang = (id: string, field: keyof Language, value: string) =>
    onChange({ languages: data.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)) });

  const delLang = (id: string) =>
    onChange({ languages: data.languages.filter((l) => l.id !== id) });

  // ── Projects ────────────────────────────────────────────────────────────────
  const addProj = () =>
    onChange({
      projects: [...data.projects, { id: genId(), name: '', description: '', url: '', technologies: '' }],
    });

  const updProj = (id: string, field: keyof Project, value: string) =>
    onChange({ projects: data.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)) });

  const delProj = (id: string) =>
    onChange({ projects: data.projects.filter((p) => p.id !== id) });

  return (
    <div className="flex flex-col h-full">
      {/* Tab nav */}
      <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50/80 scrollbar-hide shrink-0">
        {tabs.map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors ${
              activeTab === id
                ? 'text-blue-600 border-blue-600 bg-white'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Form body */}
      <div className="flex-1 overflow-y-auto p-5">

        {/* ── Personal ─────────────────────────────────────────── */}
        {activeTab === 'personal' && (
          <div>
            <TextInput label={tr.fullName} value={data.name} onChange={(v) => onChange({ name: v })} placeholder="Budi Santoso" />
            <TextInput label={tr.jobTitle} value={data.title} onChange={(v) => onChange({ title: v })} placeholder="Software Engineer" />
            <div className="grid grid-cols-2 gap-3">
              <TextInput label={tr.email} value={data.email} onChange={(v) => onChange({ email: v })} type="email" placeholder="budi@email.com" />
              <TextInput label={tr.phone} value={data.phone} onChange={(v) => onChange({ phone: v })} placeholder="+62 812-3456-7890" />
            </div>
            <TextInput label={tr.location} value={data.location} onChange={(v) => onChange({ location: v })} placeholder="Jakarta, Indonesia" />
            <TextInput label={tr.website} value={data.website ?? ''} onChange={(v) => onChange({ website: v })} placeholder="https://budisantoso.dev" />
            <TextInput label={tr.linkedin} value={data.linkedin ?? ''} onChange={(v) => onChange({ linkedin: v })} placeholder="linkedin.com/in/budisantoso" />
          </div>
        )}

        {/* ── Summary ──────────────────────────────────────────── */}
        {activeTab === 'summary' && (
          <Textarea label={tr.summary} value={data.summary} onChange={(v) => onChange({ summary: v })} placeholder={tr.summaryPlaceholder} rows={7} />
        )}

        {/* ── Experience ───────────────────────────────────────── */}
        {activeTab === 'experience' && (
          <div>
            {data.experience.map((exp, i) => (
              <ItemCard key={exp.id} index={i} label={tr.experience} onRemove={() => delExp(exp.id)}>
                <TextInput label={tr.company} value={exp.company} onChange={(v) => updExp(exp.id, 'company', v)} />
                <TextInput label={tr.position} value={exp.position} onChange={(v) => updExp(exp.id, 'position', v)} />
                <TextInput label={tr.location} value={exp.location} onChange={(v) => updExp(exp.id, 'location', v)} />
                <div className="grid grid-cols-2 gap-3">
                  <TextInput label={tr.startDate} value={exp.startDate} onChange={(v) => updExp(exp.id, 'startDate', v)} placeholder="Jan 2022" />
                  {!exp.current && (
                    <TextInput label={tr.endDate} value={exp.endDate} onChange={(v) => updExp(exp.id, 'endDate', v)} placeholder="Des 2023" />
                  )}
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-500 mb-4 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updExp(exp.id, 'current', e.target.checked)}
                    className="rounded"
                  />
                  {tr.currentlyWorking}
                </label>
                <Textarea label={tr.description} value={exp.description} onChange={(v) => updExp(exp.id, 'description', v)} placeholder="• Memimpin tim 5 engineer..." rows={4} />
              </ItemCard>
            ))}
            <AddButton label={tr.addExperience} onClick={addExp} />
          </div>
        )}

        {/* ── Education ────────────────────────────────────────── */}
        {activeTab === 'education' && (
          <div>
            {data.education.map((edu, i) => (
              <ItemCard key={edu.id} index={i} label={tr.education} onRemove={() => delEdu(edu.id)}>
                <TextInput label={tr.school} value={edu.school} onChange={(v) => updEdu(edu.id, 'school', v)} placeholder="Universitas Indonesia" />
                <div className="grid grid-cols-2 gap-3">
                  <TextInput label={tr.degree} value={edu.degree} onChange={(v) => updEdu(edu.id, 'degree', v)} placeholder="S1" />
                  <TextInput label={tr.field} value={edu.field} onChange={(v) => updEdu(edu.id, 'field', v)} placeholder="Teknik Informatika" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <TextInput label={tr.startDate} value={edu.startDate} onChange={(v) => updEdu(edu.id, 'startDate', v)} placeholder="2019" />
                  <TextInput label={tr.endDate} value={edu.endDate} onChange={(v) => updEdu(edu.id, 'endDate', v)} placeholder="2023" />
                </div>
                <TextInput label={tr.gpa} value={edu.gpa ?? ''} onChange={(v) => updEdu(edu.id, 'gpa', v)} placeholder="3.80 / 4.00" />
              </ItemCard>
            ))}
            <AddButton label={tr.addEducation} onClick={addEdu} />
          </div>
        )}

        {/* ── Skills ───────────────────────────────────────────── */}
        {activeTab === 'skills' && (
          <div>
            <Textarea
              label={tr.skills}
              value={data.skills}
              onChange={(v) => onChange({ skills: v })}
              placeholder={tr.skillsPlaceholder}
              rows={5}
            />
            <p className="text-xs text-gray-400 -mt-2">{tr.skillsHint}</p>
          </div>
        )}

        {/* ── Languages ────────────────────────────────────────── */}
        {activeTab === 'languages' && (
          <div>
            {data.languages.map((l, i) => (
              <ItemCard key={l.id} index={i} label={tr.language} onRemove={() => delLang(l.id)}>
                <div className="grid grid-cols-2 gap-3">
                  <TextInput label={tr.language} value={l.language} onChange={(v) => updLang(l.id, 'language', v)} placeholder="Bahasa Indonesia" />
                  <Field label={tr.level}>
                    <select
                      aria-label={tr.level}
                      value={l.level}
                      onChange={(e) => updLang(l.id, 'level', e.target.value)}
                      className={inputCls}
                    >
                      {tr.levels.map((lv) => (
                        <option key={lv} value={lv}>{lv}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </ItemCard>
            ))}
            <AddButton label={tr.addLanguage} onClick={addLang} />
          </div>
        )}

        {/* ── Projects ─────────────────────────────────────────── */}
        {activeTab === 'projects' && (
          <div>
            {data.projects.map((p, i) => (
              <ItemCard key={p.id} index={i} label={tr.projects} onRemove={() => delProj(p.id)}>
                <TextInput label={tr.projectName} value={p.name} onChange={(v) => updProj(p.id, 'name', v)} />
                <TextInput label={tr.projectUrl} value={p.url ?? ''} onChange={(v) => updProj(p.id, 'url', v)} placeholder="https://github.com/..." />
                <TextInput label={tr.technologies} value={p.technologies} onChange={(v) => updProj(p.id, 'technologies', v)} placeholder="React, Node.js, PostgreSQL" />
                <Textarea label={tr.projectDesc} value={p.description} onChange={(v) => updProj(p.id, 'description', v)} rows={3} />
              </ItemCard>
            ))}
            <AddButton label={tr.addProject} onClick={addProj} />
          </div>
        )}
      </div>

      {/* Auto-save badge */}
      <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center gap-2 shrink-0">
        <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
        <span className="text-xs text-gray-400">{tr.save}</span>
      </div>
    </div>
  );
}
