import puppeteer from "puppeteer";
import { NextRequest } from "next/server";
import { z } from "zod";

const idSchema = z.coerce.number().int().positive();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const rawId = url.pathname.split("/").pop();

  const parsed = idSchema.safeParse(rawId);
  if (!parsed.success) {
    return new Response("Invalid ID", { status: 400 });
  }

  const id = parsed.data;
  const type = url.searchParams.get("type") ?? "default";
  const locale = "es";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
  const previewSecret = process.env.PREVIEW_SECRET ?? "";

  let pdfUrl = "";
  let fileNamePDF = "";

  switch (type) {
    case "liftgate":
      pdfUrl = `${baseUrl}/${locale}/dashboard/documents/inspections/generate-pdf/${id}?preview=${previewSecret}`;
      fileNamePDF = `Inspection-${id}.pdf`;
      break;
    default:
      pdfUrl = `${baseUrl}/${locale}/dashboard/documents/work-orders/generate-pdf/${id}?preview=${previewSecret}`;
      fileNamePDF = `WorkOrder-${id}.pdf`;
      break;
  }

  let browser;
  try {
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 8000 });
    await page.goto(pdfUrl, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileNamePDF}"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response("Error generating PDF", { status: 500 });
  } finally {
    await browser?.close();
  }
}
