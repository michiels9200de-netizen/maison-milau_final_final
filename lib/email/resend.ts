// ==============================================================================
// MAISON MILAU · RESEND TRANSACTIONAL EMAIL SERVICE
// ==============================================================================

import { Resend } from 'resend';

let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('re_xxxx')) {
    return null;
  }
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export interface AdminB2BNotificationPayload {
  companyName: string;
  email: string;
  vatNumber: string;
  createdAt?: string;
}

export interface B2BApprovalEmailPayload {
  email: string;
  customerName?: string;
  companyName?: string;
}

/**
 * 7. ADMIN NOTIFICATIE MAIL
 * Wordt verzonden naar process.env.ADMIN_EMAIL wanneer een B2B-klant zich registreert.
 */
export async function sendAdminB2BNotification(
  payload: AdminB2BNotificationPayload
): Promise<{ success: boolean; id?: string; simulated?: boolean; error?: string }> {
  const adminEmail = process.env.ADMIN_EMAIL || 'maisonmilau@gmail.com';
  const fromEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
  const siteUrl = process.env.SITE_URL || process.env.APP_URL || 'https://www.maison-milau.be';
  const formattedDate = payload.createdAt
    ? new Date(payload.createdAt).toLocaleDateString('nl-BE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('nl-BE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  const htmlContent = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nieuwe B2B aanvraag</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f6f4; color: #1c1917;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f7f6f4; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td style="background-color: #1c1917; padding: 32px 36px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">Maison Milau</h1>
              <p style="color: #d6d3d1; margin: 6px 0 0 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Artisanaal Koffiebranderij · Administratie</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 36px 24px 36px;">
              <div style="display: inline-block; padding: 4px 12px; background-color: #fef3c7; color: #92400e; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
                Actie Vereist · B2B Verificatie
              </div>
              <h2 style="font-size: 20px; font-weight: 700; color: #1c1917; margin: 0 0 16px 0;">
                Nieuwe B2B aanvraag
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #44403c; margin: 0 0 24px 0;">
                Er is zojuist een nieuwe B2B-registratie ingediend op de webshop. De account staat momenteel in <strong>wachtrij (pending)</strong> en heeft nog geen toegang tot zakelijke prijzen.
              </p>

              <!-- Gegevens Tabel -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #fafaf9; border-radius: 12px; border: 1px solid #e7e5e4; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #e7e5e4; font-size: 13px; color: #78716c; width: 140px; font-weight: 600;">Bedrijf:</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #e7e5e4; font-size: 14px; color: #1c1917; font-weight: 600;">${payload.companyName || 'Niet opgegeven'}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #e7e5e4; font-size: 13px; color: #78716c; font-weight: 600;">Email:</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #e7e5e4; font-size: 14px; color: #1c1917;">
                    <a href="mailto:${payload.email}" style="color: #854d0e; text-decoration: none;">${payload.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #e7e5e4; font-size: 13px; color: #78716c; font-weight: 600;">BTW Nummer:</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #e7e5e4; font-size: 14px; color: #1c1917; font-family: monospace;">${payload.vatNumber || 'Niet opgegeven'}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; font-size: 13px; color: #78716c; font-weight: 600;">Registratiedatum:</td>
                  <td style="padding: 14px 18px; font-size: 13px; color: #1c1917;">${formattedDate}</td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a href="${siteUrl}/admin/b2b-requests" style="display: inline-block; background-color: #1c1917; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                      B2B aanvragen bekijken
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #a8a29e; line-height: 1.5; margin: 0; text-align: center;">
                U kunt deze aanvraag goedkeuren of afwijzen in het beheerpaneel.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafaf9; border-top: 1px solid #e7e5e4; padding: 20px 36px; text-align: center;">
              <p style="font-size: 11px; color: #a8a29e; margin: 0;">
                © ${new Date().getFullYear()} Maison Milau · Automatische Systeemnotificatie
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const resend = getResend();
  if (!resend) {
    console.log(
      `[RESEND SIMULATION] Geen actieve RESEND_API_KEY. Notificatie voor admin gelogd:`,
      { to: adminEmail, subject: 'Nieuwe B2B aanvraag', company: payload.companyName, email: payload.email, vat: payload.vatNumber }
    );
    return { success: true, simulated: true };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: 'Nieuwe B2B aanvraag',
      html: htmlContent,
    });
    return { success: true, id: data.data?.id };
  } catch (error: any) {
    console.error('[RESEND ERROR] Verzenden admin B2B notificatie mislukt:', error);
    return { success: false, error: error?.message || String(error) };
  }
}

/**
 * 11. GOEDKEURINGSMAIL VOOR DE KLANT
 * Wordt verzonden naar het e-mailadres van de klant na goedkeuring van de B2B status.
 */
export async function sendB2BApprovalEmail(
  payload: B2BApprovalEmailPayload
): Promise<{ success: boolean; id?: string; simulated?: boolean; error?: string }> {
  const fromEmail = process.env.SENDER_EMAIL || 'info@maison-milau.be';
  const siteUrl = process.env.SITE_URL || process.env.APP_URL || 'https://www.maison-milau.be';
  const loginUrl = `${siteUrl}/account/login`;

  const customerGreeting = payload.customerName || (payload.companyName ? `vertegenwoordiger van ${payload.companyName}` : 'klant');

  const htmlContent = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Je B2B-account is goedgekeurd</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f6f4; color: #1c1917;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f7f6f4; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td style="background-color: #1c1917; padding: 36px 36px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">Maison Milau</h1>
              <p style="color: #d6d3d1; margin: 6px 0 0 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Artisanale Koffiebranderij · B2B Partner Portaal</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 36px 24px 36px;">
              <div style="display: inline-block; padding: 4px 12px; background-color: #dcfce7; color: #15803d; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
                ✓ B2B Goedgekeurd
              </div>

              <h2 style="font-size: 22px; font-weight: 700; color: #1c1917; margin: 0 0 16px 0;">
                Je B2B-account is goedgekeurd
              </h2>

              <p style="font-size: 15px; line-height: 1.6; color: #44403c; margin: 0 0 16px 0;">
                Beste ${customerGreeting},
              </p>

              <p style="font-size: 15px; line-height: 1.6; color: #44403c; margin: 0 0 24px 0;">
                Je aanvraag voor een professioneel B2B-account werd met succes geverifieerd en goedgekeurd door ons team.
              </p>

              <!-- Voordelen Box -->
              <div style="background-color: #fafaf9; border-left: 4px solid #854d0e; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
                <p style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 0 0 12px 0;">
                  Je hebt nu onmiddellijk toegang tot:
                </p>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #44403c; line-height: 1.8;">
                  <li><strong>Zakelijke prijzen</strong> (excl. BTW tarieven op vers gebrande blends en single origins)</li>
                  <li><strong>Staffelkortingen</strong> bij grotere volumes voor horeca en kantoren</li>
                  <li><strong>Exclusieve aanbiedingen</strong> en prioritaire brandplanning</li>
                </ul>
              </div>

              <!-- Call to Action Button -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="display: inline-block; background-color: #854d0e; color: #ffffff; text-decoration: none; padding: 15px 36px; border-radius: 10px; font-size: 15px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(133, 77, 14, 0.25);">
                      Inloggen
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #78716c; line-height: 1.6; margin: 0;">
                Heb je specifieke wensen of wil je advies over maalgraad en zetmethoden voor jouw horecazaak of onderneming? Beantwoord gerust deze e-mail of neem rechtstreeks contact op met onze branderij.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafaf9; border-top: 1px solid #e7e5e4; padding: 24px 36px; text-align: center;">
              <p style="font-size: 12px; font-weight: 600; color: #1c1917; margin: 0 0 4px 0;">Maison Milau Artisan Roastery</p>
              <p style="font-size: 11px; color: #a8a29e; margin: 0;">
                Grote Markt · 9200 Dendermonde · België · info@maison-milau.be
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const resend = getResend();
  if (!resend) {
    console.log(
      `[RESEND SIMULATION] Geen actieve RESEND_API_KEY. Goedkeuringsmail naar klant gelogd:`,
      { to: payload.email, subject: 'Je B2B-account is goedgekeurd', customer: customerGreeting }
    );
    return { success: true, simulated: true };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: payload.email,
      subject: 'Je B2B-account is goedgekeurd',
      html: htmlContent,
    });
    return { success: true, id: data.data?.id };
  } catch (error: any) {
    console.error('[RESEND ERROR] Verzenden B2B goedkeuringsmail mislukt:', error);
    return { success: false, error: error?.message || String(error) };
  }
}
