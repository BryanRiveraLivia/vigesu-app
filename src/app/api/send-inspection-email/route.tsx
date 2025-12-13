import { EmailTemplate } from "@/features/orders/inspections/components/emailTemplates/EmailTemplate";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("❌ RESEND_API_KEY no está configurada x");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // 👇 creas la instancia DENTRO del handler
    const resend = new Resend(apiKey);

    const { email, name } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "Inspections <onboarding@resend.dev>",
      to: [email],
      subject: "Confirmación de Inspección",
      react: <EmailTemplate recipientName={name || "Usuario"} />,
    });

    if (error) {
      console.error("Error Resend:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error general:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
