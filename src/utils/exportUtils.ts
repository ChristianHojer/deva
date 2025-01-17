import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

type ExportData = {
  tokenUsage: Array<{ date: string; tokens: number }>;
  projectStats: Array<{ name: string; files: number; messages: number }>;
  errorStats: Array<{
    type: string;
    description: string;
    solution: string;
    errorType: string;
  }>;
};

export const exportToCSV = (data: ExportData) => {
  const csvContent: string[] = [];

  // Add Token Usage section
  csvContent.push('Token Usage');
  csvContent.push('Date,Tokens');
  data.tokenUsage.forEach(({ date, tokens }) => {
    csvContent.push(`${date},${tokens}`);
  });
  csvContent.push(''); // Empty line for separation

  // Add Project Stats section
  csvContent.push('Project Statistics');
  csvContent.push('Project Name,Files,Messages');
  data.projectStats.forEach(({ name, files, messages }) => {
    csvContent.push(`${name},${files},${messages}`);
  });
  csvContent.push('');

  // Add Error Stats section
  csvContent.push('Error Statistics');
  csvContent.push('Type,Error Type,Description,Solution');
  data.errorStats.forEach(({ type, errorType, description, solution }) => {
    csvContent.push(`${type},${errorType},"${description}","${solution}"`);
  });

  const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `analytics_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
};

export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Title
  doc.setFontSize(16);
  doc.text('Analytics Report', pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Generated on ${format(new Date(), 'PPP')}`, pageWidth / 2, 22, { align: 'center' });

  // Token Usage section
  doc.setFontSize(14);
  doc.text('Token Usage', 14, 35);
  autoTable(doc, {
    startY: 40,
    head: [['Date', 'Tokens Used']],
    body: data.tokenUsage.map(row => [row.date, row.tokens.toString()]),
  });

  // Project Stats section
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Project Statistics', 14, 15);
  autoTable(doc, {
    startY: 20,
    head: [['Project Name', 'Files', 'Messages']],
    body: data.projectStats.map(row => [
      row.name,
      row.files.toString(),
      row.messages.toString(),
    ]),
  });

  // Error Stats section
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Error Statistics', 14, 15);
  autoTable(doc, {
    startY: 20,
    head: [['Type', 'Error Type', 'Description', 'Solution']],
    body: data.errorStats.map(row => [
      row.type,
      row.errorType,
      row.description,
      row.solution,
    ]),
  });

  doc.save(`analytics_export_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};