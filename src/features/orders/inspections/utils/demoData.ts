import { IInspectionItem } from "../models/inspection.types";
import { IInspectionDetail, IInspection } from "@/presentation/components/shared/InspectionsPdf/LiftgateInspectionCheckList";
import { LiftgateInspection } from "@/core/types/order/ITypes";

/**
 * 🔹 CONSTANTE DE CONTROL DEMO
 * Cambia a `false` para depender exclusivamente de las APIs en el funcionamiento normal en producción.
 * Si está en `true`, inyecta 1 inspección simulada por cada uno de los 12 tipos de plantilla.
 */
export const CARGAR_DEMO: boolean = false

export const DEMO_TEMPLATES: Record<number, string> = {
  1: "McKinney Federal Inspection",
  2: "Chassis Annual Inspection Report",
  3: "Chassis - PM Inspection Report (90-180)",
  4: "Inspection TTN",
  5: "Premier FHWA",
  6: "Liftgate Inspection Check List",
  7: "Xtra Lease DOT",
  8: "California BIT Inspection",
  9: "Lift Gate Maintenance Checklist",
  10: "Annual Vehicle Inspection Report (90 Days BIT)",
  11: "Chassis 1 Year PM Service",
  12: "Periodic Chassis and Trailer Inspection",
};

/**
 * Genera el listado de 12 inspecciones demo (una por cada plantilla del 1 al 12).
 * Utiliza IDs negativos para diferenciarse instantáneamente de los IDs reales de BD (> 0).
 */
export const getDemoInspectionsList = (): IInspectionItem[] => {
  return Object.entries(DEMO_TEMPLATES).map(([idStr, name]) => {
    const id = Number(idStr);
    return {
      inspectionId: -1000 - id, // Ejemplo: -1001 para la plantilla 1, -1012 para la plantilla 12
      inspectionNumber: `DEMO-${id.toString().padStart(3, "0")}`,
      customerName: `Demo Client (${name})`,
      employeeName: "Demo Inspector AI",
      dateOfInspection: new Date().toISOString(),
      status: 1, // Create
      statusInspection: 1, // Create
      templateInspectionId: id,
    };
  });
};

/**
 * Genera el objeto de plantilla simulada para previsualización.
 */
export const getDemoTemplateData = (templateId: number): LiftgateInspection => ({
  templateInspectionId: templateId,
  name: DEMO_TEMPLATES[templateId] ?? `Template #${templateId}`,
  filePath: "",
  templateInspectionQuestions: [],
});

/**
 * Genera detalles de inspección simulados para llenar todos los campos de texto y checkboxes
 * de cualquiera de las 12 plantillas sin dejar campos vacíos.
 */
export const getDemoInspectionDetails = (templateId: number): IInspectionDetail[] => {
  const details: IInspectionDetail[] = [];
  const currentDateStr = new Date().toLocaleDateString();

  for (let id = 1; id <= 1000; id++) {
    // Para preguntas de estado/checkbox (1 = Satisfactory/OK, 2 = Defective/Needs Repair)
    const stateVal = id % 7 === 0 ? "2" : "1";
    let responseText = `Demo text #${id}`;

    // Datos simulados realistas para los IDs utilizados en nuestras plantillas
    if (id >= 367 && id <= 375) {
      responseText =
        id === 367 ? "1XYZ982348" :
          id === 368 ? "53ft Box" :
            id === 369 ? "TR-102" :
              id === 370 ? "98,230" :
                id === 371 ? "CA" :
                  id === 372 ? "LA-01" :
                    id === 373 ? "West Coast Logistics" :
                      id === 374 ? "Port of LA" : "BIT Inspection 90 days passed.";
    } else if (id >= 501 && id <= 509) {
      responseText =
        id === 501 ? "TR-9920" :
          id === 502 ? "1M8GDM9A_KP042" :
            id === 503 ? "CA-88392" :
              id === 504 ? "CA / 2026" : "Demo Value";
    } else if (id >= 601 && id <= 610) {
      responseText =
        id === 601 ? "DCLI Chassis" :
          id === 602 ? "53FT Tandem" :
            id === 603 ? currentDateStr :
              id === 604 ? "DCLI-8821" :
                id === 605 ? "CA-99123" :
                  id === 606 ? "38492019" :
                    id === 607 ? "John Doe (ID: 442)" :
                      id === 608 ? "San Francisco Depot" :
                        id === 609 ? "120 psi" : "Standard 90-Day BIT Inspection completed satisfactorily without issues.";
    } else if (id >= 701 && id <= 707) {
      responseText =
        id === 701 ? "Chassis Logistics Inc" :
          id === 702 ? "CH-2024-99" :
            id === 703 ? "DCLI" :
              id === 704 ? currentDateStr :
                id === 705 ? "108,492 mi" :
                  id === 706 ? "Oakland Port Facility" : "Inspector AI Signature";
    } else if (id >= 801 && id <= 812) {
      responseText =
        id === 801 ? "TR-5542" :
          id === 802 ? "53ft Reefer" :
            id === 803 ? "1FUJ9823901" :
              id === 804 ? "CA-44910" :
                id === 805 ? "105,200" :
                  id === 806 ? "CA" :
                    id === 807 ? "Hub 4 - West" :
                      id === 808 ? "Pacific Transport" :
                        id === 809 ? "LA Terminal" :
                          id === 810 ? "No mechanical defects noted during annual inspection." :
                            id === 811 ? "Signed Inspector" : currentDateStr;
    } else if (id >= 901 && id <= 910) {
      responseText = `Maxon / Palfinger Unit #${id}`;
    }

    details.push({
      inspectionDetailId: id,
      typeInspectionDetailId: 1,
      templateInspectionQuestionId: id,
      typeInspectionDetailAnswerId: 1,
      finalResponse: responseText,
      inspectionDetailAnswers: [
        {
          inspectionDetailAnswerId: id,
          typeInspectionDetailAnswerId: 1,
          response: stateVal,
          items: [],
        },
      ],
    });
  }

  return details;
};
