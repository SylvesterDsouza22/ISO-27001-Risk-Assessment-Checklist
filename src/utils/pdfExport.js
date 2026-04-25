import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePDFReport = async (elementId, companyName, score) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const oldScrollY = window.scrollY;
  window.scrollTo(0, 0);

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0a0e17' // Match dark mode bg
    });
    
    window.scrollTo(0, oldScrollY);

    const imgData = canvas.toDataURL('image/png');
    
    // A4 aspect ratio considerations
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Add Header text manually for better PDF SEO/Accessibility
    pdf.setFillColor(99, 102, 241); // Primary color
    pdf.rect(0, 0, pdfWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.text('ISO 27001 Compliance Assessment Report', 20, 25);

    let position = 45;
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    let heightLeft = pdfHeight - (pageHeight - position);
    
    // Add new pages if the content height exceeds one page
    while (heightLeft > 0) {
      position = position - pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }
    
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `CCNS_Report_${companyName.replace(/\s+/g, '_')}_${dateStr}.pdf`;
    
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("PDF generation failed", error);
    return false;
  }
};
