import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CVData } from '@/types/cv';

export async function exportToPDF(elementId: string, filename = 'CV') {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    width: element.scrollWidth,
    height: element.scrollHeight,
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const marginX = 18;
  const marginY = 18;
  const contentWidth = pdfWidth - marginX * 2;
  const contentHeight = pdfHeight - marginY * 2;

  // Convert one PDF page content height back into source canvas pixels.
  const sourcePageHeight = Math.floor((contentHeight * canvas.width) / contentWidth);

  let sourceY = 0;
  let pageIndex = 0;

  while (sourceY < canvas.height) {
    if (pageIndex > 0) {
      pdf.addPage();
    }

    const sliceHeight = Math.min(sourcePageHeight, canvas.height - sourceY);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    const pageCtx = pageCanvas.getContext('2d');
    if (!pageCtx) break;

    pageCtx.fillStyle = '#ffffff';
    pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    pageCtx.drawImage(
      canvas,
      0,
      sourceY,
      canvas.width,
      sliceHeight,
      0,
      0,
      pageCanvas.width,
      pageCanvas.height,
    );

    const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
    const renderHeight = (sliceHeight * contentWidth) / canvas.width;

    pdf.addImage(pageImgData, 'JPEG', marginX, marginY, contentWidth, renderHeight);

    sourceY += sliceHeight;
    pageIndex += 1;
  }

  pdf.save(`${filename}.pdf`);
}

function pushIfValue(lines: string[], label: string, value?: string) {
  if (!value) return;
  const trimmed = value.trim();
  if (!trimmed) return;
  lines.push(`${label}: ${trimmed}`);
}

export function exportToATSTextPDF(data: CVData, filename = 'CV-ATS') {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const addLine = (line = '', options?: { bold?: boolean; size?: number; gap?: number }) => {
    const size = options?.size ?? 11;
    pdf.setFont('helvetica', options?.bold ? 'bold' : 'normal');
    pdf.setFontSize(size);

    if (!line) {
      y += options?.gap ?? 8;
      return;
    }

    const wrapped = pdf.splitTextToSize(line, maxWidth);
    for (const w of wrapped) {
      if (y > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(w, margin, y);
      y += size + 4;
    }

    y += options?.gap ?? 2;
  };

  addLine((data.name || 'Your Name').toUpperCase(), { bold: true, size: 16, gap: 4 });
  addLine(data.title, { size: 12, gap: 6 });

  const contactLines: string[] = [];
  pushIfValue(contactLines, 'Email', data.email);
  pushIfValue(contactLines, 'Phone', data.phone);
  pushIfValue(contactLines, 'Location', data.location);
  pushIfValue(contactLines, 'Website', data.website);
  pushIfValue(contactLines, 'LinkedIn', data.linkedin);
  for (const line of contactLines) addLine(line);
  addLine();

  if (data.summary) {
    addLine('PROFESSIONAL SUMMARY', { bold: true, size: 12, gap: 4 });
    addLine(data.summary, { gap: 6 });
  }

  if (data.experience.length > 0) {
    addLine('WORK EXPERIENCE', { bold: true, size: 12, gap: 4 });
    for (const exp of data.experience) {
      addLine(`${exp.position} | ${exp.company}`, { bold: true });
      addLine(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}${exp.location ? ` | ${exp.location}` : ''}`);
      if (exp.description) {
        exp.description
          .split('\n')
          .map((line) => line.replace(/^[-•]\s*/, '').trim())
          .filter(Boolean)
          .forEach((item) => addLine(`- ${item}`));
      }
      addLine('', { gap: 4 });
    }
  }

  if (data.skills) {
    addLine('SKILLS', { bold: true, size: 12, gap: 4 });
    addLine(
      data.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .join(', '),
      { gap: 6 },
    );
  }

  if (data.education.length > 0) {
    addLine('EDUCATION', { bold: true, size: 12, gap: 4 });
    for (const edu of data.education) {
      addLine(`${edu.degree} ${edu.field} | ${edu.school}`, { bold: true });
      addLine(`${edu.startDate} - ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`);
    }
    addLine('', { gap: 4 });
  }

  if (data.projects.length > 0) {
    addLine('PROJECTS', { bold: true, size: 12, gap: 4 });
    for (const project of data.projects) {
      addLine(project.name, { bold: true });
      if (project.technologies) addLine(`Technologies: ${project.technologies}`);
      if (project.url) addLine(`URL: ${project.url}`);
      if (project.description) addLine(project.description);
      addLine('', { gap: 4 });
    }
  }

  if (data.languages.length > 0) {
    addLine('LANGUAGES', { bold: true, size: 12, gap: 4 });
    addLine(data.languages.map((l) => `${l.language}${l.level ? ` (${l.level})` : ''}`).join(', '));
  }

  if (data.certifications.length > 0) {
    addLine('CERTIFICATIONS', { bold: true, size: 12, gap: 4 });
    for (const cert of data.certifications) {
      addLine(`${cert.name} | ${cert.issuer}`, { bold: true });
      addLine(`Issued: ${cert.issueDate}`);
      if (cert.credentialId) addLine(`Credential ID: ${cert.credentialId}`);
      if (cert.url) addLine(`URL: ${cert.url}`);
      addLine('', { gap: 4 });
    }
  }

  const atsLines: string[] = [];
  pushIfValue(atsLines, 'Target Role', data.targetRole);
  pushIfValue(atsLines, 'ATS Keywords', data.targetKeywords);
  pushIfValue(atsLines, 'Work Authorization', data.workAuthorization);
  if (data.expectedSalary) {
    pushIfValue(atsLines, 'Expected Salary', `${data.expectedSalary}${data.salaryCurrency ? ` ${data.salaryCurrency}` : ''}`);
  }
  pushIfValue(atsLines, 'Notice Period', data.noticePeriod);

  if (atsLines.length > 0) {
    addLine('ATS PROFILE', { bold: true, size: 12, gap: 4 });
    for (const line of atsLines) addLine(line);
  }

  pdf.save(`${filename}.pdf`);
}
