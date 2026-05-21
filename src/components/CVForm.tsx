'use client';

import { useRef, useState } from 'react';
import {
  User, FileText, Briefcase, GraduationCap,
  Wrench, Globe, FolderOpen, Trash2, Target, Palette, ChevronLeft, ChevronRight,
} from 'lucide-react';
import {
  CVData,
  CVFormat,
  CVTemplate,
  CVFont,
  Experience,
  Education,
  Language,
  Project,
  Certification,
  Reference,
} from '@/types/cv';
import { Lang } from '@/lib/i18n';
import translations from '@/lib/i18n';

interface Props {
  data: CVData;
  onChange: (partial: Partial<CVData>) => void;
  lang: Lang;
}

type TabId =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'international'
  | 'design'
  | 'ats'
  | 'certifications'
  | 'references';

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
  'w-full px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 caret-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white';

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
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const tabScrollRef = useRef<HTMLDivElement | null>(null);
  const photoDragAreaRef = useRef<HTMLDivElement | null>(null);
  const photoDragStartRef = useRef<{ mouseX: number; mouseY: number; cropX: number; cropY: number } | null>(null);
  const photoCropRequestRef = useRef(0);
  const tr = translations[lang];

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

  const scrollTabs = (direction: 'left' | 'right') => {
    if (!tabScrollRef.current) return;
    const offset = direction === 'left' ? -240 : 240;
    tabScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const tabs: { id: TabId; Icon: React.ElementType; label: string }[] = [
    { id: 'personal', Icon: User, label: tr.personalInfo },
    { id: 'summary', Icon: FileText, label: tr.summary },
    { id: 'experience', Icon: Briefcase, label: tr.experience },
    { id: 'education', Icon: GraduationCap, label: tr.education },
    { id: 'skills', Icon: Wrench, label: tr.skills },
    { id: 'languages', Icon: Globe, label: tr.languages },
    { id: 'projects', Icon: FolderOpen, label: tr.projects },
    { id: 'international', Icon: Globe, label: tr.international },
    { id: 'design', Icon: Palette, label: tr.design },
    { id: 'ats', Icon: Target, label: tr.ats },
    { id: 'certifications', Icon: FileText, label: tr.certifications },
    { id: 'references', Icon: User, label: tr.references },
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

  // ── Certifications ─────────────────────────────────────────────────────────
  const addCert = () =>
    onChange({
      certifications: [
        ...data.certifications,
        { id: genId(), name: '', issuer: '', issueDate: '', credentialId: '', url: '' },
      ],
    });

  const updCert = (id: string, field: keyof Certification, value: string) =>
    onChange({
      certifications: data.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    });

  const delCert = (id: string) =>
    onChange({ certifications: data.certifications.filter((c) => c.id !== id) });

  // ── References ─────────────────────────────────────────────────────────────
  const addRef = () =>
    onChange({
      references: [
        ...data.references,
        { id: genId(), name: '', title: '', company: '', email: '', phone: '', relation: '' },
      ],
    });

  const updRef = (id: string, field: keyof Reference, value: string) =>
    onChange({
      references: data.references.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    });

  const delRef = (id: string) =>
    onChange({ references: data.references.filter((r) => r.id !== id) });

  const cropPhotoToSquare = (dataUrl: string, cropX = 0, cropY = 0, zoom = 1) =>
    new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const safeZoom = Math.max(1, Math.min(3, zoom));
        const cropSide = Math.max(80, Math.floor(side / safeZoom));
        const centerX = Math.floor((img.width - cropSide) / 2);
        const centerY = Math.floor((img.height - cropSide) / 2);
        const maxOffsetX = Math.floor((img.width - cropSide) / 2);
        const maxOffsetY = Math.floor((img.height - cropSide) / 2);
        const offsetX = Math.round((Math.max(-100, Math.min(100, cropX)) / 100) * maxOffsetX);
        const offsetY = Math.round((Math.max(-100, Math.min(100, cropY)) / 100) * maxOffsetY);
        const sx = Math.max(0, Math.min(img.width - cropSide, centerX + offsetX));
        const sy = Math.max(0, Math.min(img.height - cropSide, centerY + offsetY));
        const outputSize = 640;

        const canvas = document.createElement('canvas');
        canvas.width = outputSize;
        canvas.height = outputSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, sx, sy, cropSide, cropSide, 0, 0, outputSize, outputSize);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };

      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });

  const applyPhotoCrop = async ({
    source,
    cropX,
    cropY,
    zoom,
  }: {
    source: string;
    cropX: number;
    cropY: number;
    zoom: number;
  }) => {
    const requestId = ++photoCropRequestRef.current;
    const cropped = await cropPhotoToSquare(source, cropX, cropY, zoom);
    if (requestId !== photoCropRequestRef.current) return;
    onChange({
      photoSource: source,
      photo: cropped,
      photoCropX: cropX,
      photoCropY: cropY,
      photoZoom: zoom,
    });
  };

  const handlePhotoUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;
      await applyPhotoCrop({ source: result, cropX: 0, cropY: 0, zoom: 1 });
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!data.photoSource) return;
    e.preventDefault();
    photoDragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      cropX: data.photoCropX ?? 0,
      cropY: data.photoCropY ?? 0,
    };
    setIsPhotoDragging(true);
  };

  const handlePhotoDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPhotoDragging || !photoDragStartRef.current || !data.photoSource) return;
    const bounds = photoDragAreaRef.current?.getBoundingClientRect();
    if (!bounds || bounds.width === 0 || bounds.height === 0) return;

    const deltaX = e.clientX - photoDragStartRef.current.mouseX;
    const deltaY = e.clientY - photoDragStartRef.current.mouseY;
    const nextX = clamp(photoDragStartRef.current.cropX + (deltaX / bounds.width) * 200, -100, 100);
    const nextY = clamp(photoDragStartRef.current.cropY + (deltaY / bounds.height) * 200, -100, 100);

    void applyPhotoCrop({
      source: data.photoSource,
      cropX: nextX,
      cropY: nextY,
      zoom: data.photoZoom ?? 1,
    });
  };

  const stopPhotoDrag = () => {
    photoDragStartRef.current = null;
    setIsPhotoDragging(false);
  };

  const adjustPhotoZoom = (direction: 'in' | 'out') => {
    if (!data.photoSource) return;
    const current = data.photoZoom ?? 1;
    const delta = direction === 'in' ? 0.1 : -0.1;
    const next = clamp(Number((current + delta).toFixed(2)), 1, 3);
    void applyPhotoCrop({
      source: data.photoSource,
      cropX: data.photoCropX ?? 0,
      cropY: data.photoCropY ?? 0,
      zoom: next,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab nav */}
      <div className="relative border-b border-gray-100 bg-gray-50/80 shrink-0">
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          className="hidden lg:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 shadow-sm"
          aria-label="Geser menu ke kiri"
          title="Geser menu ke kiri"
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={tabScrollRef}
          onWheel={(e) => {
            if (!tabScrollRef.current) return;
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
              e.preventDefault();
              tabScrollRef.current.scrollLeft += e.deltaY;
            }
          }}
          className="flex overflow-x-auto border-gray-100 scrollbar-hide px-0 lg:px-10"
        >
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

        <button
          type="button"
          onClick={() => scrollTabs('right')}
          className="hidden lg:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 shadow-sm"
          aria-label="Geser menu ke kanan"
          title="Geser menu ke kanan"
        >
          <ChevronRight size={16} />
        </button>
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
            <Field label={tr.profilePhoto}>
              <input
                type="file"
                accept="image/*"
                aria-label={tr.profilePhoto}
                title={tr.profilePhoto}
                onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg bg-white file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-medium"
              />
            </Field>
            <p className="text-xs text-gray-400 -mt-2 mb-3">{tr.profilePhotoHint}</p>
            <p className="text-xs text-gray-400 -mt-2 mb-3">{tr.profilePhotoAutoCrop}</p>
            {data.photoSource && (
              <div className="border border-gray-200 rounded-xl p-3 mb-3 bg-gray-50">
                <p className="text-xs font-semibold text-gray-600 mb-3">{tr.photoCropTitle}</p>

                <div className="mb-3 flex justify-center">
                  <div
                    ref={photoDragAreaRef}
                    onMouseDown={handlePhotoDragStart}
                    onMouseMove={handlePhotoDragMove}
                    onMouseUp={stopPhotoDrag}
                    onMouseLeave={stopPhotoDrag}
                    className={`relative h-28 w-28 overflow-hidden rounded-lg border border-gray-200 bg-white ${isPhotoDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    title={tr.photoDragHint}
                  >
                    <img
                      src={data.photoSource}
                      alt="Crop Preview"
                      draggable={false}
                      className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
                      style={{
                        width: `${Math.round((data.photoZoom ?? 1) * 100)}%`,
                        height: `${Math.round((data.photoZoom ?? 1) * 100)}%`,
                        transform: `translate(calc(-50% + ${(data.photoCropX ?? 0) * 0.2}px), calc(-50% + ${(data.photoCropY ?? 0) * 0.2}px))`,
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-3">{tr.photoDragHint}</p>

                <Field label={tr.photoCropZoom}>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => adjustPhotoZoom('out')}
                      className="h-9 w-9 rounded-md border border-gray-300 text-lg text-gray-700 hover:bg-gray-100"
                      aria-label={`${tr.photoCropZoom} out`}
                      title={`${tr.photoCropZoom} out`}
                    >
                      -
                    </button>
                    <div className="min-w-14 text-center text-xs text-gray-600 font-medium">
                      {Math.round((data.photoZoom ?? 1) * 100)}%
                    </div>
                    <button
                      type="button"
                      onClick={() => adjustPhotoZoom('in')}
                      className="h-9 w-9 rounded-md border border-gray-300 text-lg text-gray-700 hover:bg-gray-100"
                      aria-label={`${tr.photoCropZoom} in`}
                      title={`${tr.photoCropZoom} in`}
                    >
                      +
                    </button>
                  </div>
                </Field>

                <button
                  type="button"
                  onClick={() => {
                    if (!data.photoSource) return;
                    void applyPhotoCrop({ source: data.photoSource, cropX: 0, cropY: 0, zoom: 1 });
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {tr.photoCropReset}
                </button>
              </div>
            )}
            {data.photo && (
              <button
                type="button"
                onClick={() => onChange({ photo: '', photoSource: '', photoCropX: 0, photoCropY: 0, photoZoom: 1 })}
                className="mb-4 text-xs text-red-500 hover:text-red-600"
              >
                {tr.removePhoto}
              </button>
            )}
            <TextInput label={tr.nationality} value={data.nationality ?? ''} onChange={(v) => onChange({ nationality: v })} placeholder="Indonesia" />
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

        {/* ── International ───────────────────────────────────── */}
        {activeTab === 'international' && (
          <div>
            <Field label={tr.cvFormat}>
              <select
                value={data.cvFormat}
                onChange={(e) => onChange({ cvFormat: e.target.value as CVFormat })}
                className={inputCls}
              >
                <option value="id">{tr.cvFormatLabels.id}</option>
                <option value="us">{tr.cvFormatLabels.us}</option>
                <option value="eu">{tr.cvFormatLabels.eu}</option>
                <option value="uk">{tr.cvFormatLabels.uk}</option>
              </select>
            </Field>
            <p className="text-xs text-gray-400 -mt-2 mb-3">{tr.cvFormatHint}</p>
            <TextInput
              label={tr.desiredCountry}
              value={data.desiredCountry ?? ''}
              onChange={(v) => onChange({ desiredCountry: v })}
              placeholder={lang === 'id' ? 'Contoh: Singapore, Australia, Germany' : 'e.g. Singapore, Australia, Germany'}
            />
            <Field label={tr.remotePreference}>
              <select
                value={data.remotePreference ?? ''}
                onChange={(e) => onChange({ remotePreference: e.target.value })}
                className={inputCls}
              >
                <option value="">{lang === 'id' ? 'Pilih preferensi kerja' : 'Select work preference'}</option>
                {tr.remoteOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-4 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={data.willingToRelocate}
                onChange={(e) => onChange({ willingToRelocate: e.target.checked })}
                className="rounded"
              />
              {tr.willingToRelocate}
            </label>
          </div>
        )}

        {/* ── Design ──────────────────────────────────────────── */}
        {activeTab === 'design' && (
          <div>
            <Field label={tr.template}>
              <select
                value={data.template}
                onChange={(e) => onChange({ template: e.target.value as CVTemplate })}
                className={inputCls}
              >
                <option value="classic">{tr.templateLabels.classic}</option>
                <option value="modern">{tr.templateLabels.modern}</option>
                <option value="minimal">{tr.templateLabels.minimal}</option>
                <option value="ats">{tr.templateLabels.ats}</option>
              </select>
            </Field>

            <Field label={tr.fontFamily}>
              <select
                value={data.fontFamily}
                onChange={(e) => onChange({ fontFamily: e.target.value as CVFont })}
                className={inputCls}
              >
                <option value="arial">{tr.fontLabels.arial}</option>
                <option value="georgia">{tr.fontLabels.georgia}</option>
                <option value="poppins">{tr.fontLabels.poppins}</option>
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label={tr.primaryColor}>
                <input
                  type="color"
                  value={data.primaryColor}
                  onChange={(e) => onChange({ primaryColor: e.target.value })}
                  className="w-full h-11 border border-gray-200 rounded-lg bg-white p-1"
                />
              </Field>
              <Field label={tr.accentColor}>
                <input
                  type="color"
                  value={data.accentColor}
                  onChange={(e) => onChange({ accentColor: e.target.value })}
                  className="w-full h-11 border border-gray-200 rounded-lg bg-white p-1"
                />
              </Field>
            </div>
          </div>
        )}

        {/* ── ATS ─────────────────────────────────────────────── */}
        {activeTab === 'ats' && (
          <div>
            <TextInput
              label={tr.targetRole}
              value={data.targetRole}
              onChange={(v) => onChange({ targetRole: v })}
              placeholder={lang === 'id' ? 'Contoh: Senior Frontend Engineer' : 'e.g. Senior Frontend Engineer'}
            />
            <Textarea
              label={tr.targetKeywords}
              value={data.targetKeywords}
              onChange={(v) => onChange({ targetKeywords: v })}
              placeholder={lang === 'id' ? 'React, TypeScript, Next.js, Leadership, SQL' : 'React, TypeScript, Next.js, Leadership, SQL'}
              rows={3}
            />
            <p className="text-xs text-gray-400 -mt-2 mb-3">{tr.targetKeywordsHint}</p>

            <TextInput
              label={tr.workAuthorization}
              value={data.workAuthorization ?? ''}
              onChange={(v) => onChange({ workAuthorization: v })}
              placeholder={lang === 'id' ? 'Contoh: KITAS, PR, Citizen, Visa sponsorship needed' : 'e.g. Citizen, PR, Visa sponsorship needed'}
            />

            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label={tr.expectedSalary}
                value={data.expectedSalary ?? ''}
                onChange={(v) => onChange({ expectedSalary: v })}
                placeholder={lang === 'id' ? 'Contoh: 20.000.000 / month' : 'e.g. 6500 / month'}
              />
              <Field label={tr.salaryCurrency}>
                <select
                  value={data.salaryCurrency ?? ''}
                  onChange={(e) => onChange({ salaryCurrency: e.target.value })}
                  className={inputCls}
                >
                  <option value="">{lang === 'id' ? 'Pilih mata uang' : 'Select currency'}</option>
                  {tr.salaryCurrencyOptions.map((currency) => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </Field>
            </div>

            <TextInput
              label={tr.noticePeriod}
              value={data.noticePeriod ?? ''}
              onChange={(v) => onChange({ noticePeriod: v })}
              placeholder={lang === 'id' ? 'Contoh: Immediate / 1 month / 2 weeks' : 'e.g. Immediate / 1 month / 2 weeks'}
            />
          </div>
        )}

        {/* ── Certifications ──────────────────────────────────── */}
        {activeTab === 'certifications' && (
          <div>
            {data.certifications.map((c, i) => (
              <ItemCard key={c.id} index={i} label={tr.certifications} onRemove={() => delCert(c.id)}>
                <TextInput label={tr.certName} value={c.name} onChange={(v) => updCert(c.id, 'name', v)} />
                <TextInput label={tr.certIssuer} value={c.issuer} onChange={(v) => updCert(c.id, 'issuer', v)} />
                <TextInput label={tr.certIssueDate} value={c.issueDate} onChange={(v) => updCert(c.id, 'issueDate', v)} placeholder="2025" />
                <TextInput label={tr.certCredentialId} value={c.credentialId ?? ''} onChange={(v) => updCert(c.id, 'credentialId', v)} />
                <TextInput label={tr.certUrl} value={c.url ?? ''} onChange={(v) => updCert(c.id, 'url', v)} placeholder="https://..." />
              </ItemCard>
            ))}
            <AddButton label={tr.addCertification} onClick={addCert} />
          </div>
        )}

        {/* ── References ──────────────────────────────────────── */}
        {activeTab === 'references' && (
          <div>
            {data.references.map((r, i) => (
              <ItemCard key={r.id} index={i} label={tr.references} onRemove={() => delRef(r.id)}>
                <TextInput label={tr.refName} value={r.name} onChange={(v) => updRef(r.id, 'name', v)} />
                <div className="grid grid-cols-2 gap-3">
                  <TextInput label={tr.refTitle} value={r.title} onChange={(v) => updRef(r.id, 'title', v)} />
                  <TextInput label={tr.refCompany} value={r.company} onChange={(v) => updRef(r.id, 'company', v)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <TextInput label={tr.email} value={r.email ?? ''} onChange={(v) => updRef(r.id, 'email', v)} placeholder="name@company.com" />
                  <TextInput label={tr.phone} value={r.phone ?? ''} onChange={(v) => updRef(r.id, 'phone', v)} placeholder="+62..." />
                </div>
                <TextInput label={tr.refRelation} value={r.relation ?? ''} onChange={(v) => updRef(r.id, 'relation', v)} />
              </ItemCard>
            ))}
            <AddButton label={tr.addReference} onClick={addRef} />
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
