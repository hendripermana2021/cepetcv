export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Language {
  id: string;
  language: string;
  level: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  url?: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
  relation?: string;
}

export type CVFormat = 'id' | 'us' | 'eu' | 'uk';
export type CVTemplate = 'classic' | 'modern' | 'minimal' | 'ats';
export type CVFont = 'arial' | 'georgia' | 'poppins';

export interface CVData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  photo?: string;
  photoSource?: string;
  photoCropX?: number;
  photoCropY?: number;
  photoZoom?: number;
  nationality?: string;
  desiredCountry?: string;
  cvFormat: CVFormat;
  template: CVTemplate;
  fontFamily: CVFont;
  primaryColor: string;
  accentColor: string;
  willingToRelocate: boolean;
  remotePreference?: string;
  targetRole: string;
  targetKeywords: string;
  workAuthorization?: string;
  expectedSalary?: string;
  salaryCurrency?: string;
  noticePeriod?: string;
  website?: string;
  linkedin?: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
  languages: Language[];
  projects: Project[];
  certifications: Certification[];
  references: Reference[];
}

export const defaultCVData: CVData = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  photo: '',
  photoSource: '',
  photoCropX: 0,
  photoCropY: 0,
  photoZoom: 1,
  nationality: '',
  desiredCountry: '',
  cvFormat: 'id',
  template: 'classic',
  fontFamily: 'arial',
  primaryColor: '#1a365d',
  accentColor: '#2563eb',
  willingToRelocate: false,
  remotePreference: '',
  targetRole: '',
  targetKeywords: '',
  workAuthorization: '',
  expectedSalary: '',
  salaryCurrency: '',
  noticePeriod: '',
  website: '',
  linkedin: '',
  summary: '',
  experience: [],
  education: [],
  skills: '',
  languages: [],
  projects: [],
  certifications: [],
  references: [],
};
