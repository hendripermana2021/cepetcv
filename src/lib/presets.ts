import { CVData, defaultCVData } from '@/types/cv';

export const indonesiaPreset: CVData = {
  ...defaultCVData,
  name: 'Raka Pratama',
  title: 'Senior Frontend Engineer',
  email: 'raka.pratama@email.com',
  phone: '+62 812-3456-7890',
  location: 'Jakarta, Indonesia',
  nationality: 'Indonesia',
  desiredCountry: 'Indonesia',
  cvFormat: 'id',
  willingToRelocate: false,
  remotePreference: 'Hybrid',
  targetRole: 'Senior Frontend Engineer',
  targetKeywords: 'React, TypeScript, Next.js, Performance, Leadership, REST API',
  workAuthorization: 'WNI',
  expectedSalary: '28.000.000 / month',
  salaryCurrency: 'IDR',
  noticePeriod: '1 month',
  website: 'https://raka-dev.com',
  linkedin: 'linkedin.com/in/rakapratama',
  summary:
    'Frontend engineer dengan pengalaman 6+ tahun membangun aplikasi web skala besar. Fokus pada performa, arsitektur komponen, dan kolaborasi lintas tim untuk menghasilkan produk yang cepat serta mudah dirawat.',
  experience: [
    {
      id: 'exp-id-1',
      company: 'PT Nusantara Digital',
      position: 'Senior Frontend Engineer',
      location: 'Jakarta',
      startDate: 'Jan 2022',
      endDate: '',
      current: true,
      description:
        '- Memimpin migrasi aplikasi internal ke Next.js dan TypeScript\n- Menurunkan waktu loading halaman utama 42%\n- Membimbing 4 engineer junior melalui code review mingguan',
    },
    {
      id: 'exp-id-2',
      company: 'Karya Teknologi Indonesia',
      position: 'Frontend Engineer',
      location: 'Bandung',
      startDate: 'Mar 2019',
      endDate: 'Dec 2021',
      current: false,
      description:
        '- Mengembangkan dashboard operasional untuk 10+ tim bisnis\n- Membangun design system reusable berbasis React\n- Bekerja sama dengan tim backend untuk integrasi API',
    },
  ],
  education: [
    {
      id: 'edu-id-1',
      school: 'Institut Teknologi Bandung',
      degree: 'S1',
      field: 'Teknik Informatika',
      startDate: '2014',
      endDate: '2018',
      gpa: '3.72 / 4.00',
    },
  ],
  skills: 'React, Next.js, TypeScript, JavaScript, Tailwind CSS, Web Performance, Testing Library, Git',
  languages: [
    { id: 'lang-id-1', language: 'Bahasa Indonesia', level: 'Native' },
    { id: 'lang-id-2', language: 'English', level: 'Mahir' },
  ],
  projects: [
    {
      id: 'proj-id-1',
      name: 'Analytics Dashboard Revamp',
      description: 'Redesign dashboard analytics untuk 20.000+ pengguna aktif bulanan dengan fokus pada kecepatan akses dan usability.',
      url: 'https://github.com/example/analytics-dashboard',
      technologies: 'Next.js, TypeScript, Chart.js, Tailwind CSS',
    },
  ],
  certifications: [
    {
      id: 'cert-id-1',
      name: 'Google Professional Cloud Developer',
      issuer: 'Google Cloud',
      issueDate: '2024',
      credentialId: 'GCP-DEV-2024-1234',
      url: 'https://example.com/verify/gcp-dev-2024-1234',
    },
  ],
  references: [
    {
      id: 'ref-id-1',
      name: 'Dina Kurniawati',
      title: 'Engineering Manager',
      company: 'PT Nusantara Digital',
      email: 'dina.k@email.com',
      phone: '+62 813-1111-2222',
      relation: 'Direct manager (2022-present)',
    },
  ],
};

export const globalPreset: CVData = {
  ...defaultCVData,
  name: 'Raka Pratama',
  title: 'Frontend Engineer (International Remote)',
  email: 'raka.pratama@email.com',
  phone: '+62 812-3456-7890',
  location: 'Jakarta, Indonesia',
  nationality: 'Indonesian',
  desiredCountry: 'Singapore, Australia, Germany',
  cvFormat: 'us',
  willingToRelocate: true,
  remotePreference: 'Remote',
  targetRole: 'Senior Frontend Engineer',
  targetKeywords: 'React, TypeScript, Next.js, Micro-frontend, Accessibility, Leadership, CI/CD',
  workAuthorization: 'Requires visa sponsorship outside Indonesia',
  expectedSalary: '6500 / month',
  salaryCurrency: 'USD',
  noticePeriod: '30 days',
  website: 'https://raka-dev.com',
  linkedin: 'linkedin.com/in/rakapratama',
  summary:
    'Frontend engineer with 6+ years of experience delivering scalable web applications for multi-country users. Strong in product collaboration, performance optimization, and building maintainable design systems.',
  experience: [
    {
      id: 'exp-gl-1',
      company: 'Nusantara Digital',
      position: 'Senior Frontend Engineer',
      location: 'Remote (Indonesia)',
      startDate: 'Jan 2022',
      endDate: '',
      current: true,
      description:
        '- Led migration to Next.js + TypeScript across 3 core products\n- Improved Largest Contentful Paint by 38%\n- Mentored 4 engineers and standardized review checklist',
    },
    {
      id: 'exp-gl-2',
      company: 'Tech Karya',
      position: 'Frontend Engineer',
      location: 'Bandung, Indonesia',
      startDate: 'Mar 2019',
      endDate: 'Dec 2021',
      current: false,
      description:
        '- Built operations dashboard used by APAC business teams\n- Implemented reusable component library with documentation\n- Collaborated with backend team on API contract quality',
    },
  ],
  education: [
    {
      id: 'edu-gl-1',
      school: 'Bandung Institute of Technology',
      degree: 'B.Sc.',
      field: 'Computer Science',
      startDate: '2014',
      endDate: '2018',
      gpa: '3.72 / 4.00',
    },
  ],
  skills: 'React, Next.js, TypeScript, JavaScript, Accessibility, Frontend Architecture, CI/CD, Testing',
  languages: [
    { id: 'lang-gl-1', language: 'Indonesian', level: 'Native' },
    { id: 'lang-gl-2', language: 'English', level: 'Advanced' },
  ],
  projects: [
    {
      id: 'proj-gl-1',
      name: 'Global Ops Dashboard',
      description: 'Built a global operations dashboard with role-based access and near real-time visual reporting for distributed teams.',
      url: 'https://github.com/example/global-ops-dashboard',
      technologies: 'Next.js, TypeScript, React Query, Tailwind CSS',
    },
  ],
  certifications: [
    {
      id: 'cert-gl-1',
      name: 'AWS Certified Developer - Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2025',
      credentialId: 'AWS-DEV-2025-5678',
      url: 'https://example.com/verify/aws-dev-2025-5678',
    },
  ],
  references: [
    {
      id: 'ref-gl-1',
      name: 'Dina Kurniawati',
      title: 'Engineering Manager',
      company: 'Nusantara Digital',
      email: 'dina.k@email.com',
      phone: '+62 813-1111-2222',
      relation: 'Direct manager (2022-present)',
    },
  ],
};
