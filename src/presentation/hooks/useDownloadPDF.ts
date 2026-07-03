// hooks/useDownloadPDF.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const useDownloadPDF = () => {
  const downloadPDF = async (elementId: string, fileName = "document.pdf") => {
    const input = document.getElementById(elementId);
    if (!input) return;

    const canvas = await html2canvas(input, {
      backgroundColor: "#ffffff", // blanco puro
      scale: 2,
      useCORS: true,
      ignoreElements: (el) =>
        // evitar exportar elementos como botones, inputs invisibles, etc
        el.classList?.contains("no-export"),
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);
  };

  return { downloadPDF };
};
