import puppeteer from "puppeteer";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // o usar req.nextUrl.pathname.split("/").pop()

  const type = url.searchParams.get("type") || "default"; // o 'workorder'
  const locale = "es";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  // 🧠 Construir la URL según el tipo
  let pdfUrl = "";
  let fileNamePDF = "";

  switch (type) {
    case "liftgate":
      pdfUrl = `${baseUrl}/${locale}/dashboard/documents/inspections/generate-pdf/${id}?preview=true`;
      fileNamePDF = `Inspection-${id}.pdf`;
      break;
    default:
      pdfUrl = `${baseUrl}/${locale}/dashboard/documents/work-orders/generate-pdf/${id}?preview=true`;
      fileNamePDF = `WorkOrder-${id}.pdf`;
      break;
  }

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 8000 });

  await page.goto(pdfUrl, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return new Response(Buffer.from(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileNamePDF}.pdf"`,
    },
  });
}
