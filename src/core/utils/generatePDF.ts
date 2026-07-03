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

    // ✅ Remover clases que restrinjan max-width o añadan márgenes excesivos en el PDF (.container, my-5, etc.)
    clone.classList.remove("container", "min-h-screen", "my-5", "my-4", "my-6", "mx-auto");

    // ✅ Usamos 1024px para que todos los breakpoints responsivos de escritorio (md: y lg:) estén activos
    // y para que la tabla ocupe el 100% del ancho sin márgenes en blanco en los extremos
    clone.style.width = "1024px";
    clone.style.minWidth = "1024px";
    clone.style.maxWidth = "1024px";
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

    // ✅ Capturamos imagen con escala 2 (excelente nitidez y menos peso que 3)
    const canvas = await html2canvas(clone, {
      scale: 2, // 2 da nitidez impecable sin saturar memoria ni achicar fuentes por sub-pixel scaling
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1024,
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
