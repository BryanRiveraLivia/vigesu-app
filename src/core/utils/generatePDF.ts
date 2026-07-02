import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { useLoadingStore } from "@/presentation/stores/useLoadingStore";

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

    // ✅ Forzamos un ancho de 800px para que el escalado a A4 sea natural
    // (A4 es ~794px a 96dpi, 800px es el estándar ideal para formularios)
    clone.style.width = "800px";
    clone.style.minWidth = "800px";
    clone.style.maxWidth = "800px";
    clone.style.height = "auto";
    clone.style.maxHeight = "none";
    clone.style.overflow = "visible";
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.backgroundColor = "white"; // Aseguramos fondo blanco

    document.body.appendChild(clone);

    // ✅ Pequeña espera para asegurar que las imágenes se rendericen
    await new Promise((resolve) => setTimeout(resolve, 500));

    // ✅ Capturamos imagen con alta escala para nitidez
    const canvas = await html2canvas(clone, {
      scale: 3, // Incrementamos escala para mayor nitidez
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 800,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95); // Usamos JPEG para reducir peso si es muy grande

    // ✅ Crear PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // El ancho de la imagen en el PDF será el ancho total del PDF
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeight);
    } else {
      let y = 0;
      // Definimos el alto de corte basado en la proporción de la página
      const pageHeightInCanvas = (canvas.width * pdfHeight) / pdfWidth;

      while (y < canvas.height) {
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(canvas.height - y, pageHeightInCanvas);

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

        const pageData = pageCanvas.toDataURL("image/jpeg", 0.95);
        pdf.addImage(
          pageData,
          "JPEG",
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
