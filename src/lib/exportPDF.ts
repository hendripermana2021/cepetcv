import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
