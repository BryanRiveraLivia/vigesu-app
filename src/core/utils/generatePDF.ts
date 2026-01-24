import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { useLoadingStore } from "@/presentation/stores/useLoadinStore";

export const generatePDF = async (
  elementId: string,
  fileName = "documento.pdf",
): Promise<void> => {
  try {
    // ✅ Acceder al store global sin usar hook React
    const { setLoading } = useLoadingStore.getState();

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Elemento con id "${elementId}" no encontrado`);
    }

    setLoading(true, "Generate PDF ...");

    // ✅ Clonamos el nodo para capturar TODO el contenido sin recorte
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.height = "auto";
    clone.style.maxHeight = "none";
    clone.style.overflow = "visible";
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    document.body.appendChild(clone);

    // ✅ Capturamos imagen completa
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    // ✅ Crear PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
    } else {
      let y = 0;
      while (y < canvas.height) {
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(canvas.height - y, canvas.width * 1.414);
        const ctx = pageCanvas.getContext("2d");
        ctx?.drawImage(
          canvas,
          0,
          y,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          canvas.width,
          pageCanvas.height,
        );
        const pageData = pageCanvas.toDataURL("image/png");
        pdf.addImage(
          pageData,
          "PNG",
          0,
          0,
          pdfWidth,
          (pageCanvas.height * pdfWidth) / pageCanvas.width,
        );
        y += pageCanvas.height;
        if (y < canvas.height) pdf.addPage();
      }
    }

    pdf.save(fileName);
    document.body.removeChild(clone);
  } catch (error) {
    console.error("❌ Error generando PDF:", error);
  } finally {
    useLoadingStore.getState().setLoading(false);
  }
};
