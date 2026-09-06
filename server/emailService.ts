import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

export interface EmailLogEntry {
  id: string;
  type: string;
  recipient: string;
  sender: string;
  subject: string;
  preview: string;
  body: string;
  html?: string;
  status: 'sent' | 'failed' | 'queued';
  messageId?: string;
  provider: string;
  previewUrl?: string;
  error?: string;
  attempts: number;
  sentAt: string;
}

export const WEBOWNER_EMAIL = 'maisonmilau@gmail.com';
export const SENDER_EMAIL = process.env.SENDER_EMAIL || process.env.SUPPORT_EMAIL || 'maisonmilau@gmail.com';
export const SENDER_NAME = process.env.SENDER_NAME || 'Maison Milau Ambachtelijke Koffiebranderij';

// In-memory log of all dispatched and attempted emails
export const emailNotificationLogs: EmailLogEntry[] = [
  {
    id: 'eml-init-1',
    type: 'admin_registration',
    recipient: WEBOWNER_EMAIL,
    sender: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
    subject: '[Maison Milau] Nieuwe klantregistratie: Laurent Michiels',
    preview: 'Nieuwe particulier account aangemaakt: klant@voorbeeld.be',
    body: 'Beste Laurent,\n\nEr is zojuist een nieuwe klant geregistreerd op Maison Milau:\n\nNaam: Laurent Michiels\nE-mail: klant@voorbeeld.be\nType: Particulier\nTelefoon: +32 467 77 37 66\nDatum: 2026-09-02 10:14',
    status: 'sent',
    messageId: '<init-reg-1@maisonmilau.be>',
    provider: 'system_bootstrap',
    attempts: 1,
    sentAt: '2026-09-02T10:14:05.000Z',
  },
  {
    id: 'eml-init-2',
    type: 'customer_welcome',
    recipient: 'klant@voorbeeld.be',
    sender: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
    subject: 'Welkom bij Maison Milau · Uw account is gereed',
    preview: 'Bedankt voor uw registratie bij Maison Milau ambachtelijke branderij.',
    body: 'Beste Laurent,\n\nHartelijk dank voor uw registratie bij Maison Milau! U kunt nu eenvoudig vers gebrande specialty koffies bestellen, uw leveringen volgen en reviews plaatsen.\n\nWarme groeten,\nLaurent Michiels · Maison Milau',
    status: 'sent',
    messageId: '<init-reg-2@maisonmilau.be>',
    provider: 'system_bootstrap',
    attempts: 1,
    sentAt: '2026-09-02T10:14:06.000Z',
  },
];

let transporterPromise: Promise<Transporter> | null = null;
let activeProvider = 'uninitialized';

/**
 * Initializes and caches the nodemailer transporter.
 * Supports:
 * 1. Live SMTP credentials (Google Workspace / Gmail or custom host)
 * 2. Ethereal SMTP sandbox when credentials are not yet set, enabling real network transmission & preview URLs
 */
export async function getTransporter(): Promise<Transporter> {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    const smtpHost = process.env.SMTP_HOST || process.env.SMTP_SERVER || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS;

    if (smtpUser && smtpPass) {
      console.log(`[EMAIL] Initializing live SMTP with host: ${smtpHost}:${smtpPort} (user: ${smtpUser})`);
      activeProvider = `SMTP (${smtpHost}:${smtpPort})`;
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      try {
        await transporter.verify();
        console.log(`[EMAIL] SMTP connection to ${smtpHost}:${smtpPort} verified successfully.`);
      } catch (verifyErr: any) {
        console.error(`[EMAIL] Warning: SMTP verification failed: ${verifyErr.message}`);
      }
      return transporter;
    }

    // When live credentials are not set, provision an Ethereal SMTP test account for real SMTP transmission
    console.log('[EMAIL] No SMTP_USER/SMTP_PASS in environment. Provisioning real Ethereal SMTP test account for live delivery testing...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      activeProvider = `Ethereal Test SMTP (${testAccount.user})`;
      console.log(`[EMAIL] Test account provisioned: ${testAccount.user}`);
      const testTransporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      await testTransporter.verify();
      console.log('[EMAIL] Ethereal SMTP connection verified successfully.');
      return testTransporter;
    } catch (testErr: any) {
      console.error('[EMAIL] Failed to create Ethereal test account:', testErr.message);
      activeProvider = 'Direct Fallback Transport';
      // Final fallback to JSON direct transport if ethereal fails
      return nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  })();

  return transporterPromise;
}

/**
 * Diagnostic check for SMTP connectivity and configuration
 */
export async function auditEmailConfiguration() {
  const smtpHost = process.env.SMTP_HOST || process.env.SMTP_SERVER || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const hasPass = Boolean(process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD);

  let connectionOk = false;
  let testMessageId: string | undefined;
  let previewUrl: string | undefined;
  let errorMessage: string | undefined;

  try {
    const transporter = await getTransporter();
    connectionOk = true;

    // Send a dry diagnostic test ping to verify acceptance
    const ping = await transporter.sendMail({
      from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
      to: WEBOWNER_EMAIL,
      subject: `[Diagnostic Ping] Maison Milau Email Engine · ${new Date().toLocaleTimeString('nl-BE')}`,
      text: 'Dit is een automatische validatie-ping om de SMTP-verbinding en e-mailtransmissie te testen.',
    });
    testMessageId = ping.messageId;
    const testUrl = nodemailer.getTestMessageUrl(ping);
    if (testUrl) previewUrl = testUrl;
  } catch (err: any) {
    errorMessage = err.message;
  }

  return {
    provider: activeProvider,
    connectionOk,
    smtpHost,
    smtpPort,
    smtpSecure,
    authenticated: Boolean(smtpUser && hasPass),
    configuredUser: smtpUser || '(geen SMTP_USER opgegeven; actieve testaccount in gebruik)',
    adminEmail: WEBOWNER_EMAIL,
    senderEmail: SENDER_EMAIL,
    testMessageId,
    previewUrl,
    error: errorMessage,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Common HTML email wrapper with high-contrast Maison Milau design
 */
function buildHtmlWrapper(title: string, preheader: string, contentHtml: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f7f5f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 24px auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e5e4; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04); }
    .header { background: #1c1917; color: #fef3c7; padding: 32px 28px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #d6d3d1; text-transform: uppercase; letter-spacing: 1.5px; }
    .body { padding: 32px 28px; font-size: 15px; line-height: 1.65; color: #292524; }
    .box { background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .btn { display: inline-block; background: #78350f; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; margin: 16px 0; text-align: center; }
    .footer { background: #f5f5f4; border-top: 1px solid #e7e5e4; padding: 24px 28px; font-size: 12px; color: #78716c; text-align: center; line-height: 1.5; }
    .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; background: #fef3c7; color: #92400e; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th { text-align: left; font-size: 12px; color: #78716c; text-transform: uppercase; padding: 8px 4px; border-bottom: 1px solid #e7e5e4; }
    td { padding: 10px 4px; font-size: 14px; border-bottom: 1px solid #f5f5f4; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#f7f5f2;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>
  <div class="container">
    <div class="header">
      <div class="badge">Maison Milau · Ambachtelijke Branderij</div>
      <h1>${title}</h1>
      <p>Artisanale Specialty Coffee · Oudegem / Dendermonde</p>
    </div>
    <div class="body">
      ${contentHtml}
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0; font-weight: 600; color: #44403c;">Maison Milau Koffiebranderij</p>
      <p style="margin: 0 0 8px 0;">Jef Scheirsstraat 29, 9200 Oudegem · BTW BE 1041.542.844</p>
      <p style="margin: 0 0 8px 0;">Klantenservice: <a href="mailto:${WEBOWNER_EMAIL}" style="color: #78350f; text-decoration: none;">${WEBOWNER_EMAIL}</a> · Tel: +32 467 77 37 66</p>
      <p style="margin: 12px 0 0 0; font-size: 11px; color: #a8a29e;">U ontvangt deze servicemail als bevestiging van uw interactie op maison-milau.be.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Core send routine with retries, status logging, and delivery tracking
 */
export async function sendEmail(options: {
  type: string;
  recipient: string;
  subject: string;
  preview: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<EmailLogEntry> {
  const { type, recipient, subject, preview, text, html, replyTo } = options;
  const logId = `eml-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const logEntry: EmailLogEntry = {
    id: logId,
    type,
    recipient,
    sender: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
    subject,
    preview,
    body: text,
    html,
    status: 'queued',
    provider: activeProvider,
    attempts: 0,
    sentAt: new Date().toISOString(),
  };

  emailNotificationLogs.unshift(logEntry);

  let lastError: any = null;
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    logEntry.attempts = attempt;
    try {
      const transporter = await getTransporter();
      const mailOptions: SendMailOptions = {
        from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
        to: recipient,
        replyTo: replyTo || SENDER_EMAIL,
        subject,
        text,
        html: html || buildHtmlWrapper(subject, preview, `<pre style="font-family:inherit;white-space:pre-wrap;">${text}</pre>`),
      };

      const info = await transporter.sendMail(mailOptions);
      logEntry.status = 'sent';
      logEntry.messageId = info.messageId;
      logEntry.provider = activeProvider;

      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        logEntry.previewUrl = previewUrl;
      }

      console.log(`[EMAIL SENT] Type: ${type} | To: ${recipient} | MsgId: ${info.messageId} | Provider: ${activeProvider}`);
      if (previewUrl) {
        console.log(`[EMAIL PREVIEW URL] ${previewUrl}`);
      }

      return logEntry;
    } catch (err: any) {
      lastError = err;
      console.error(`[EMAIL ERROR] Attempt ${attempt}/${maxAttempts} failed for ${recipient}: ${err.message}`);
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 600 * attempt));
      }
    }
  }

  logEntry.status = 'failed';
  logEntry.error = lastError?.message || 'Onbekende fout tijdens transmissie';
  console.error(`[EMAIL FATAL] Failed to send email to ${recipient} after ${maxAttempts} attempts: ${logEntry.error}`);

  return logEntry;
}

/* ==============================================================================
   WORKFLOW IMPLEMENTATIONS
   ============================================================================== */

/**
 * 1. Contact Form Submission (Support Tickets & Direct Inquiries)
 */
export async function sendContactFormEmails(data: {
  customerName: string;
  customerEmail: string;
  phone?: string;
  category?: string;
  orderNumber?: string;
  subject: string;
  message: string;
  ticketNumber?: string;
}) {
  const ticketRef = data.ticketNumber || `ML-${Math.floor(1000 + Math.random() * 9000)}`;

  // Email to Administrator (maisonmilau@gmail.com)
  const adminSubject = `[Nieuw Contactbericht #${ticketRef}] ${data.subject} · ${data.customerName}`;
  const adminText = `Beste Laurent,

Er is een nieuw contactbericht binnengekomen via het contactformulier op de website:

Referentie: #${ticketRef}
Van: ${data.customerName}
E-mail: ${data.customerEmail}
Telefoon: ${data.phone || 'Niet opgegeven'}
Categorie: ${data.category || 'Algemeen'}
Order#: ${data.orderNumber || 'Geen gekoppelde bestelling'}
Onderwerp: ${data.subject}

Bericht:
${data.message}

Datum: ${new Date().toLocaleString('nl-BE')}
U kunt rechtstreeks op deze e-mail antwoorden om contact op te nemen met de klant.`;

  const adminHtml = buildHtmlWrapper(
    'Nieuw Contactbericht',
    `Nieuw bericht van ${data.customerName} (#${ticketRef})`,
    `<p>Er is zojuist een nieuw bericht binnengekomen via het contactformulier:</p>
    <div class="box">
      <table>
        <tr><th>Ticket#:</th><td><strong>#${ticketRef}</strong></td></tr>
        <tr><th>Naam:</th><td>${data.customerName}</td></tr>
        <tr><th>E-mail:</th><td><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></td></tr>
        <tr><th>Telefoon:</th><td>${data.phone || 'Niet opgegeven'}</td></tr>
        <tr><th>Categorie:</th><td>${data.category || 'Algemeen'}</td></tr>
        <tr><th>Ordernummer:</th><td>${data.orderNumber || 'Geen'}</td></tr>
        <tr><th>Onderwerp:</th><td><strong>${data.subject}</strong></td></tr>
      </table>
      <p style="margin-top:16px;font-weight:600;">Bericht van klant:</p>
      <div style="background:#fff;padding:16px;border-radius:8px;border:1px solid #e7e5e4;white-space:pre-wrap;color:#1c1917;">${data.message}</div>
    </div>
    <a href="mailto:${data.customerEmail}?subject=Re: [${ticketRef}] ${encodeURIComponent(data.subject)}" class="btn">Beantwoord ${data.customerName}</a>`
  );

  await sendEmail({
    type: 'contact_form_admin',
    recipient: WEBOWNER_EMAIL,
    replyTo: data.customerEmail,
    subject: adminSubject,
    preview: `Bericht van ${data.customerName}: ${data.subject}`,
    text: adminText,
    html: adminHtml,
  });

  // Auto-reply to Customer
  const customerSubject = `Ontvangstbevestiging vraag [#${ticketRef}]: ${data.subject}`;
  const customerText = `Beste ${data.customerName},

Hartelijk dank voor uw bericht aan Maison Milau. Wij hebben uw vraag in goede orde ontvangen onder referentienummer #${ticketRef}.

Ons team in de branderij te Oudegem bekijkt uw vraag zorgvuldig en beantwoordt deze doorgaans binnen 1 werkdag.

Overzicht van uw ingezonden bericht:
• Categorie: ${data.category || 'Algemene vraag'}
• Onderwerp: ${data.subject}
• Bericht:
${data.message}

Met vriendelijke groet,
Laurent Michiels & het Maison Milau Team
Ambachtelijke Koffiebranderij · Jef Scheirsstraat 29, 9200 Oudegem
Tel: +32 467 77 37 66 · E-mail: ${WEBOWNER_EMAIL}`;

  const customerHtml = buildHtmlWrapper(
    'Ontvangstbevestiging Contactbericht',
    `Wij hebben uw vraag goed ontvangen (#${ticketRef})`,
    `<p>Beste ${data.customerName},</p>
    <p>Hartelijk dank voor uw bericht aan Maison Milau. Wij hebben uw vraag in goede orde ontvangen onder referentienummer <strong>#${ticketRef}</strong>.</p>
    <div class="box">
      <p style="margin-top:0;font-weight:600;color:#78350f;">Wat gebeurt er nu?</p>
      <p style="margin-bottom:0;">Onze meesterbrander bekijkt uw vraag persoonlijk. Wij nemen doorgaans <strong>binnen 1 werkdag</strong> contact met u op via e-mail of telefoon.</p>
    </div>
    <div class="box">
      <p style="margin-top:0;font-size:13px;color:#78716c;text-transform:uppercase;font-weight:bold;">Kopie van uw bericht:</p>
      <p><strong>Onderwerp:</strong> ${data.subject}</p>
      <div style="background:#fff;padding:12px;border-radius:8px;border:1px solid #e7e5e4;white-space:pre-wrap;">${data.message}</div>
    </div>
    <p>Heeft u intussen een dringende vraag? U kunt ons altijd bereiken via <a href="mailto:${WEBOWNER_EMAIL}">${WEBOWNER_EMAIL}</a> of bellen naar +32 467 77 37 66.</p>
    <p>Met vriendelijke groet,<br><strong>Laurent Michiels</strong><br>Maison Milau Ambachtelijke Branderij</p>`
  );

  await sendEmail({
    type: 'contact_form_customer',
    recipient: data.customerEmail,
    subject: customerSubject,
    preview: `Wij hebben uw vraag #${ticketRef} ontvangen`,
    text: customerText,
    html: customerHtml,
  });
}

/**
 * 2. Customer Registration & Confirmation
 */
export async function sendRegistrationEmails(user: {
  name: string;
  email: string;
  phone?: string;
  accountType?: string;
  companyName?: string;
  vatNumber?: string;
}) {
  const loginUrl = 'https://www.maison-milau.be/account';

  // Customer Welcome Email
  const customerSubject = 'Welkom bij Maison Milau · Uw account is geactiveerd';
  const customerText = `Beste ${user.name},

Welkom bij Maison Milau! Uw account is succesvol aangemaakt.

Vanaf nu kunt u genieten van al onze voordelen:
• Vers gebrande specialty koffies bestellen met directe herkomsttracering
• Eenvoudig herhaalbestellingen plaatsen en uw bestelgeschiedenis inzien
• Punten sparen in ons loyaliteitsprogramma bij elke bestelling
• Uw koffie-abonnement beheren, pauzeren of aanpassen met 1 klik

Accountgegevens:
• Naam: ${user.name}
• E-mailadres: ${user.email}
• Accounttype: ${user.accountType === 'professioneel' ? `Zakelijk (${user.companyName || ''} - ${user.vatNumber || ''})` : 'Particulier'}

Log direct in via: ${loginUrl}

Warme koffiegroeten,
Laurent Michiels · Maison Milau Ambachtelijke Branderij`;

  const customerHtml = buildHtmlWrapper(
    'Welkom bij Maison Milau',
    'Uw account is gereed voor gebruik',
    `<p>Beste ${user.name},</p>
    <p>Van harte welkom bij de Maison Milau familie! Uw account is succesvol geactiveerd.</p>
    <div class="box">
      <p style="margin-top:0;font-weight:600;">Uw Accountoverzicht:</p>
      <table>
        <tr><th>Naam:</th><td>${user.name}</td></tr>
        <tr><th>E-mail:</th><td>${user.email}</td></tr>
        <tr><th>Type:</th><td>${user.accountType === 'professioneel' ? `Zakelijk (${user.companyName})` : 'Particulier'}</td></tr>
        <tr><th>Startbonus:</th><td><strong style="color:#78350f;">+50 Loyalty Punten</strong></td></tr>
      </table>
    </div>
    <div style="text-align:center;">
      <a href="${loginUrl}" class="btn">Naar Mijn Account & Webshop</a>
    </div>
    <p>Heeft u vragen over onze brandprofielen of zetmethodes? Ons atelier staat voor u klaar via <a href="mailto:${WEBOWNER_EMAIL}">${WEBOWNER_EMAIL}</a>.</p>`
  );

  await sendEmail({
    type: 'customer_welcome',
    recipient: user.email,
    subject: customerSubject,
    preview: 'Uw account is succesvol geactiveerd',
    text: customerText,
    html: customerHtml,
  });

  // Admin Notification
  const adminSubject = `[Nieuwe Klant] Registratie: ${user.name} (${user.accountType || 'particulier'})`;
  const adminText = `Beste Laurent,

Er heeft zich zojuist een nieuwe klant geregistreerd op maison-milau.be:

Naam: ${user.name}
E-mail: ${user.email}
Telefoon: ${user.phone || 'Niet opgegeven'}
Type: ${user.accountType || 'particulier'}
${user.companyName ? `Bedrijf: ${user.companyName}\nBTW: ${user.vatNumber || 'Niet opgegeven'}` : ''}
Datum: ${new Date().toLocaleString('nl-BE')}`;

  await sendEmail({
    type: 'admin_registration',
    recipient: WEBOWNER_EMAIL,
    subject: adminSubject,
    preview: `Nieuwe klant geregistreerd: ${user.name}`,
    text: adminText,
  });
}

/**
 * 3. Email Verification
 */
export async function sendEmailVerificationEmail(email: string, token: string, name: string) {
  const verifyUrl = `https://www.maison-milau.be/account?verifyToken=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  const subject = 'Verifieer uw e-mailadres voor Maison Milau';
  const text = `Beste ${name},

Gelieve uw e-mailadres te bevestigen om toegang te krijgen tot alle functies van uw Maison Milau account.

Klik op onderstaande link om uw e-mailadres te verifiëren:
${verifyUrl}

Deze verificatielink blijft 48 uur geldig.

Met vriendelijke groet,
Maison Milau Klantenservice`;

  const html = buildHtmlWrapper(
    'E-mailadres Verifiëren',
    'Bevestig uw e-mailadres voor Maison Milau',
    `<p>Beste ${name},</p>
    <p>Bedankt voor uw registratie. Klik op onderstaande knop om uw e-mailadres te bevestigen en uw registratie te voltooien:</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${verifyUrl}" class="btn">E-mailadres Verifiëren</a>
    </div>
    <p style="font-size:13px;color:#78716c;">Werkt de knop niet? Kopieer en plak dan deze link in uw browser:<br><a href="${verifyUrl}" style="color:#78350f;word-break:break-all;">${verifyUrl}</a></p>`
  );

  return sendEmail({
    type: 'email_verification',
    recipient: email,
    subject,
    preview: 'Bevestig uw e-mailadres voor Maison Milau',
    text,
    html,
  });
}

/**
 * 4. Password Reset
 */
export async function sendPasswordResetEmail(email: string, resetToken: string, name: string) {
  const resetUrl = `https://www.maison-milau.be/account?resetToken=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`;
  const subject = 'Wachtwoord opnieuw instellen · Maison Milau';
  const text = `Beste ${name},

Wij hebben een aanvraag ontvangen om het wachtwoord van uw Maison Milau account opnieuw in te stellen.

Gebruik de onderstaande link om een nieuw wachtwoord te kiezen:
${resetUrl}

Deze link is om veiligheidsredenen 60 minuten geldig.
Heeft u dit verzoek niet zelf ingediend? Dan kunt u deze e-mail veilig negeren; uw wachtwoord blijft ongewijzigd.

Met vriendelijke groet,
Maison Milau Beveiligingsteams`;

  const html = buildHtmlWrapper(
    'Wachtwoord Herstellen',
    'Instructies om uw wachtwoord opnieuw in te stellen',
    `<p>Beste ${name},</p>
    <p>U ontvangt deze e-mail omdat er een aanvraag is gedaan om uw wachtwoord opnieuw in te stellen.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${resetUrl}" class="btn">Nieuw Wachtwoord Instellen</a>
    </div>
    <div class="box">
      <p style="margin:0;font-size:13px;color:#78716c;">
        <strong>Let op:</strong> Deze link vervalt na 60 minuten. Indien u geen wachtwoordreset heeft aangevraagd, hoeft u niets te doen.
      </p>
    </div>`
  );

  return sendEmail({
    type: 'password_reset',
    recipient: email,
    subject,
    preview: 'Instructies om uw wachtwoord opnieuw in te stellen',
    text,
    html,
  });
}

/**
 * 5. New Order Confirmation (Customer & Admin)
 */
export async function sendOrderEmails(order: any) {
  const itemsListText = (order.items || []).map((it: any) => {
    const details = it.selectedColor ? `Kleur: ${it.selectedColor}, Maat: ${it.selectedSize || 'L'}` : `${it.variantWeight || ''} · ${it.grindOption || ''}`;
    const beanSelection = it.selectedBeans && it.selectedBeans.length > 0 ? ` (Bonen: ${it.selectedBeans.join(', ')})` : '';
    return `• ${it.quantity}x ${it.productName} (${details}${beanSelection}) - €${((it.unitPrice || 0) * (it.quantity || 1)).toFixed(2)}`;
  }).join('\n');

  const itemsTableHtml = `
    <table>
      <thead>
        <tr>
          <th>Artikel</th>
          <th>Aantal</th>
          <th>Specificaties</th>
          <th style="text-align:right;">Prijs</th>
        </tr>
      </thead>
      <tbody>
        ${(order.items || []).map((it: any) => `
          <tr>
            <td><strong>${it.productName}</strong></td>
            <td>${it.quantity}x</td>
            <td>${it.variantWeight || ''} ${it.grindOption ? `· ${it.grindOption}` : ''} ${it.selectedBeans?.length ? `<br><small style="color:#78350f;">(${it.selectedBeans.join(', ')})</small>` : ''}</td>
            <td style="text-align:right;">€${((it.unitPrice || 0) * (it.quantity || 1)).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  const invoiceUrl = `https://www.maison-milau.be/api/invoices/${order.invoiceNumber || order.orderNumber}/pdf`;

  // Customer Confirmation
  const customerSubject = `Bestelbevestiging ${order.orderNumber} · Maison Milau`;
  const customerText = `Beste ${order.customerName},

Hartelijk dank voor uw bestelling bij Maison Milau! Wij hebben uw order ${order.orderNumber} in goede orde ontvangen. Onze meesterbrander selecteert de bonen voor uw bestelling om maximale versheid te garanderen.

BESTELOVERZICHT:
Ordernummer: ${order.orderNumber}
Factuurnummer: ${order.invoiceNumber || 'Gegenereerd'}
Datum: ${new Date(order.createdAt || Date.now()).toLocaleDateString('nl-BE')}
Status: ${order.status === 'payment_successful' ? 'Betaald via Bancontact/Mollie' : 'In behandeling'}

ARTIKELEN:
${itemsListText}

FINANCIEEL OVERZICHT:
Subtotaal: €${(order.subtotal || 0).toFixed(2)}
Verzendkosten: €${(order.shippingCost || 0).toFixed(2)}
Inclusief BTW: €${(order.vatAmount || 0).toFixed(2)}
TOTAAL: €${(order.total || 0).toFixed(2)}

LEVERING:
Methode: ${order.deliveryMethod || 'Bpost Thuislevering'}
Adres: ${order.shippingAddress?.street || ''}, ${order.shippingAddress?.postalCode || ''} ${order.shippingAddress?.city || ''}
Tracking code: ${order.trackingCode || 'Wordt toegekend bij verzending'}

Download uw factuur via: ${invoiceUrl}

Met vriendelijke groet,
Laurent Michiels · Maison Milau Ambachtelijke Koffiebranderij`;

  const customerHtml = buildHtmlWrapper(
    `Bestelbevestiging #${order.orderNumber}`,
    `Bedankt voor uw bestelling van €${(order.total || 0).toFixed(2)}`,
    `<p>Beste ${order.customerName},</p>
    <p>Hartelijk dank voor uw aankoop bij Maison Milau. Wij gaan onmiddellijk aan de slag in onze branderij te Oudegem om uw specialty koffiebonen met de hoogste zorg klaar te maken.</p>
    
    <div class="box">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <span><strong>Order:</strong> #${order.orderNumber}</span>
        <span><strong>Factuur:</strong> ${order.invoiceNumber || 'Volgt'}</span>
      </div>
      ${itemsTableHtml}
      <div style="border-top:2px solid #e7e5e4;margin-top:12px;padding-top:12px;text-align:right;">
        <p style="margin:2px 0;">Subtotaal: €${(order.subtotal || 0).toFixed(2)}</p>
        <p style="margin:2px 0;">Verzending: €${(order.shippingCost || 0).toFixed(2)}</p>
        <p style="margin:2px 0;font-size:12px;color:#78716c;">Inbegrepen BTW: €${(order.vatAmount || 0).toFixed(2)}</p>
        <p style="margin:6px 0 0 0;font-size:18px;font-weight:700;color:#78350f;">Totaalbedrag: €${(order.total || 0).toFixed(2)}</p>
      </div>
    </div>

    <div class="box">
      <p style="margin-top:0;font-weight:600;">Leveringsinformatie:</p>
      <p style="margin:4px 0;"><strong>Methode:</strong> ${order.deliveryMethod || 'Bpost Thuislevering'}</p>
      ${order.shippingAddress?.street ? `<p style="margin:4px 0;"><strong>Adres:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.postalCode} ${order.shippingAddress.city}</p>` : ''}
      <p style="margin:4px 0;"><strong>Tracking:</strong> ${order.trackingCode || 'Ontvangt u per e-mail zodra uw pakket is aangemeld bij bpost'}</p>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="${invoiceUrl}" class="btn">Factuur Downloaden (PDF)</a>
    </div>`
  );

  await sendEmail({
    type: 'order_confirmation_customer',
    recipient: order.customerEmail,
    subject: customerSubject,
    preview: `Bevestiging van bestelling #${order.orderNumber}`,
    text: customerText,
    html: customerHtml,
  });

  // Admin Notification
  const adminSubject = `[Nieuwe Bestelling #${order.orderNumber}] €${(order.total || 0).toFixed(2)} door ${order.customerName}`;
  const adminText = `Beste Laurent,

Er is zojuist een nieuwe bestelling geplaatst op maison-milau.be:

Ordernummer: ${order.orderNumber}
Klant: ${order.customerName} (${order.customerEmail})
Telefoon: ${order.customerPhone || 'Niet opgegeven'}
Totaalbedrag: €${(order.total || 0).toFixed(2)}
Betaalstatus: ${order.status}
Leveringsmethode: ${order.deliveryMethod}

Bestelde artikelen:
${itemsListText}

Leveradres:
${order.shippingAddress?.street || 'N/A'}
${order.shippingAddress?.postalCode || ''} ${order.shippingAddress?.city || ''}
${order.shippingAddress?.country || 'België'}

Controleer de bestelling in het admin panel: https://www.maison-milau.be/admin`;

  await sendEmail({
    type: 'order_notification_admin',
    recipient: WEBOWNER_EMAIL,
    subject: adminSubject,
    preview: `Nieuwe bestelling #${order.orderNumber} (€${(order.total || 0).toFixed(2)})`,
    text: adminText,
  });
}

/**
 * 6. Subscription Emails (Creation, Modification, Pause, Resume, Cancellation)
 * Strictly fulfills all required fields:
 * - Selected coffee
 * - Grind option
 * - Size
 * - Delivery frequency
 * - Subscription discount
 * - Shipping cost
 * - Recurring amount
 * - Next billing date
 * - Next delivery date
 * - Subscription management link
 * - Cancellation instructions
 */
export async function sendSubscriptionEmail(
  action: 'created' | 'modified' | 'paused' | 'resumed' | 'cancelled',
  sub: {
    id: string;
    customerName?: string;
    customerEmail: string;
    productName: string;
    grindOption: string;
    weight: string;
    frequency: string;
    discountPercent?: number;
    shippingCost?: number;
    pricePerDelivery: number;
    nextBillingDate?: string;
    nextDeliveryDate?: string;
  }
) {
  const managementLink = 'https://www.maison-milau.be/account?tab=subscriptions';
  const discountText = `${sub.discountPercent || 10}% abonnementskorting inbegrepen`;
  const shippingText = (sub.shippingCost || 0) === 0 ? 'Gratis verzending' : `€${(sub.shippingCost || 0).toFixed(2)}`;
  const cancellationInstructions = 'U heeft volledige flexibiliteit. U kunt uw abonnement op elk moment pauzeren, wijzigen of kosteloos annuleren via uw Maison Milau account dashboard, zonder opzegtermijn.';

  let subject = '';
  let title = '';
  let statusBadge = '';

  switch (action) {
    case 'created':
      subject = `Bevestiging Koffie-Abonnement · ${sub.productName} (${sub.weight})`;
      title = 'Uw Koffie-Abonnement is Actief!';
      statusBadge = 'Actief';
      break;
    case 'modified':
      subject = `Wijziging Koffie-Abonnement · ${sub.productName}`;
      title = 'Uw Abonnement is Bijgewerkt';
      statusBadge = 'Gewijzigd';
      break;
    case 'paused':
      subject = `Abonnement Gepauzeerd · ${sub.productName}`;
      title = 'Uw Abonnement is Tijdelijk Gepauzeerd';
      statusBadge = 'Gepauzeerd';
      break;
    case 'resumed':
      subject = `Abonnement Hervat · ${sub.productName}`;
      title = 'Welkom terug! Uw Abonnement is Hervat';
      statusBadge = 'Actief';
      break;
    case 'cancelled':
      subject = `Bevestiging Opzegging Koffie-Abonnement · ${sub.productName}`;
      title = 'Uw Abonnement is Beëindigd';
      statusBadge = 'Geannuleerd';
      break;
  }

  const text = `Beste ${sub.customerName || 'Koffieliefhebber'},

${title}

Hieronder vindt u alle details van uw periodieke levering:

ABONNEMENTSDETAILS:
• Geselecteerde koffie: ${sub.productName}
• Maalgraad optie: ${sub.grindOption || 'Volle bonen (vers van de brander)'}
• Formaat / Inhoud: ${sub.weight || '1kg'}
• Leverfrequentie: ${sub.frequency || 'Elke 4 weken'}
• Abonnementskorting: ${discountText}
• Verzendkosten: ${shippingText}
• Terugkerend bedrag: €${sub.pricePerDelivery.toFixed(2)} per levering
• Volgende facturatiedatum: ${sub.nextBillingDate || 'Vóór volgende levering'}
• Volgende leverdatum: ${sub.nextDeliveryDate || 'Binnenkort gepland'}

BEHEER & OPZEGGEN:
Beheer uw abonnement: ${managementLink}

OPZEGINSTRUCTIES:
${cancellationInstructions}

Heeft u vragen of wilt u een andere maalgraad proberen? Beantwoord gerust deze e-mail of contacteer ons via ${WEBOWNER_EMAIL}.

Met aromatische groet,
Laurent Michiels · Maison Milau Ambachtelijke Koffiebranderij`;

  const html = buildHtmlWrapper(
    title,
    `Status update abonnement: ${sub.productName}`,
    `<p>Beste ${sub.customerName || 'Koffieliefhebber'},</p>
    <p>${action === 'cancelled' 
      ? 'Wij bevestigen dat uw periodieke koffielevering is beëindigd. Er zullen geen verdere inhoudingen meer plaatsvinden.' 
      : 'Geniet zorgeloos van continu vers gebrande specialty koffiebonen direct uit ons atelier in Oudegem.'}</p>

    <div class="box">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <strong style="color:#78350f;">Abonnementsspecificaties</strong>
        <span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;">${statusBadge}</span>
      </div>
      <table>
        <tr><th>Geselecteerde koffie:</th><td><strong>${sub.productName}</strong></td></tr>
        <tr><th>Maalgraad:</th><td>${sub.grindOption || 'Volle bonen'}</td></tr>
        <tr><th>Inhoud per pak:</th><td>${sub.weight || '1kg'}</td></tr>
        <tr><th>Leverfrequentie:</th><td>${sub.frequency || 'Elke 4 weken'}</td></tr>
        <tr><th>Korting:</th><td><span style="color:#15803d;font-weight:600;">${discountText}</span></td></tr>
        <tr><th>Verzendkosten:</th><td>${shippingText}</td></tr>
        <tr><th>Periodiek bedrag:</th><td><strong style="font-size:16px;color:#78350f;">€${sub.pricePerDelivery.toFixed(2)}</strong></td></tr>
        <tr><th>Volgende facturatiedatum:</th><td>${sub.nextBillingDate || 'Berekend bij brandcyclus'}</td></tr>
        <tr><th>Volgende leverdatum:</th><td><strong>${sub.nextDeliveryDate || 'Zie account'}</strong></td></tr>
      </table>
    </div>

    <div class="box" style="background:#fffbeb;border-color:#fde68a;">
      <p style="margin:0 0 6px 0;font-weight:700;color:#92400e;">Flexibiliteit & Opzegging:</p>
      <p style="margin:0;font-size:13px;color:#78350f;line-height:1.5;">${cancellationInstructions}</p>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="${managementLink}" class="btn">Beheer Abonnement in Account</a>
    </div>`
  );

  return sendEmail({
    type: `subscription_${action}`,
    recipient: sub.customerEmail,
    subject,
    preview: `Abonnement update: ${sub.productName} (€${sub.pricePerDelivery.toFixed(2)})`,
    text,
    html,
  });
}

/**
 * 7. Appointment Booking (Atelier & Cupping Consultations)
 */
export async function sendAppointmentEmails(apt: {
  customerName: string;
  email: string;
  phone?: string;
  type: string;
  date: string;
  timeSlot: string;
  notes?: string;
}) {
  const typeMap: Record<string, string> = {
    cupping_sessie: 'Artisanale Cupping & Proeverij',
    white_label_overleg: 'White Label & Huisblend Bespreking',
    barista_training: 'Barista & Extractie Workshop',
    apparatuur_advies: 'Espressomachine & Molen Consultatie',
  };
  const typeLabel = typeMap[apt.type] || apt.type;

  // Customer Confirmation
  const customerSubject = `Afspraakbevestiging: ${typeLabel} op ${apt.date}`;
  const customerText = `Beste ${apt.customerName},

Uw afspraak bij Maison Milau is bevestigd!

AFSPRAAKGEGEVENS:
Type: ${typeLabel}
Datum: ${apt.date}
Tijdslot: ${apt.timeSlot}
Locatie: Maison Milau Koffiebranderij, Jef Scheirsstraat 29, 9200 Oudegem
Opmerkingen: ${apt.notes || 'Geen'}

Wij kijken ernaar uit u te verwelkomen in ons atelier. Mocht u verhinderd zijn, gelieve ons minstens 24u op voorhand te verwittigen via ${WEBOWNER_EMAIL} of +32 467 77 37 66.

Met vriendelijke groet,
Laurent Michiels · Maison Milau`;

  const customerHtml = buildHtmlWrapper(
    'Afspraak Bevestigd',
    `Uw afspraak voor ${typeLabel} op ${apt.date}`,
    `<p>Beste ${apt.customerName},</p>
    <p>Uw afspraak in onze micro-branderij te Oudegem is succesvol vastgelegd.</p>
    <div class="box">
      <table>
        <tr><th>Activiteit:</th><td><strong>${typeLabel}</strong></td></tr>
        <tr><th>Datum:</th><td>${apt.date}</td></tr>
        <tr><th>Tijd:</th><td>${apt.timeSlot}</td></tr>
        <tr><th>Locatie:</th><td>Maison Milau Atelier<br>Jef Scheirsstraat 29, 9200 Oudegem</td></tr>
      </table>
    </div>
    <p style="font-size:13px;color:#78716c;">Gratis parkeergelegenheid aan de branderij. Koffie staat vers gebrand klaar!</p>`
  );

  await sendEmail({
    type: 'appointment_confirmation_customer',
    recipient: apt.email,
    subject: customerSubject,
    preview: `Afspraakbevestiging voor ${apt.date} om ${apt.timeSlot}`,
    text: customerText,
    html: customerHtml,
  });

  // Admin Notification
  const adminSubject = `[Nieuwe Afspraak] ${typeLabel} met ${apt.customerName} (${apt.date})`;
  const adminText = `Beste Laurent,

Er is een nieuwe afspraak geboekt in het atelier:

Klant: ${apt.customerName}
E-mail: ${apt.email}
Telefoon: ${apt.phone || 'Niet opgegeven'}
Type: ${typeLabel}
Datum: ${apt.date}
Tijdslot: ${apt.timeSlot}
Notities: ${apt.notes || 'Geen'}`;

  await sendEmail({
    type: 'appointment_notification_admin',
    recipient: WEBOWNER_EMAIL,
    subject: adminSubject,
    preview: `Afspraak geboekt: ${apt.customerName} op ${apt.date}`,
    text: adminText,
  });
}

/**
 * 8. Newsletter Subscription (Welcome & Admin Alert)
 */
export async function sendNewsletterEmails(email: string) {
  const discountCode = 'WELKOM10';
  const unsubscribeUrl = `https://www.maison-milau.be/account?unsubscribe=${encodeURIComponent(email)}`;

  const customerSubject = 'Welkom bij de Maison Milau Koffiefamilie · 10% Kortingscode';
  const customerText = `Beste koffieliefhebber,

Bedankt voor uw inschrijving op de Maison Milau nieuwsbrief!

Als dank ontvangt u 10% korting op uw eerstvolgende bestelling met de code:
KORTINGSCODE: ${discountCode}

Wat kunt u van ons verwachten?
• Primeurs over exclusieve micro-lots en seasonal roasts
• Tips van de meesterbrander over maling en zetmethodes
• Uitnodigingen voor cupping sessies in ons atelier

U kunt zich op elk moment uitschrijven via: ${unsubscribeUrl}

Warme groeten,
Laurent Michiels · Maison Milau`;

  const customerHtml = buildHtmlWrapper(
    'Welkom bij de Koffiefamilie',
    'Uw 10% welkomstkorting voor specialty koffie',
    `<p>Beste koffieliefhebber,</p>
    <p>Fijn dat u deel uitmaakt van de Maison Milau koffiegemeenschap. Voortaan bent u als eerste op de hoogte van onze vers gebrande micro-lots.</p>
    <div class="box" style="text-align:center;background:#fef3c7;border-color:#fde68a;">
      <p style="margin:0 0 6px 0;font-size:12px;text-transform:uppercase;color:#92400e;font-weight:700;">Uw Persoonlijke Welkomstcode</p>
      <p style="margin:0;font-size:28px;font-weight:800;letter-spacing:2px;color:#78350f;">${discountCode}</p>
      <p style="margin:6px 0 0 0;font-size:12px;color:#b45309;">Geldig voor 10% korting op al onze gebrande bonen in de webshop.</p>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://www.maison-milau.be/webshop" class="btn">Ontdek de Collectie</a>
    </div>
    <p style="font-size:11px;color:#a8a29e;text-align:center;">Uitschrijven kan via <a href="${unsubscribeUrl}" style="color:#78716c;">deze link</a>.</p>`
  );

  await sendEmail({
    type: 'newsletter_welcome',
    recipient: email,
    subject: customerSubject,
    preview: 'Uw 10% welkomstkorting bij Maison Milau',
    text: customerText,
    html: customerHtml,
  });

  await sendEmail({
    type: 'newsletter_admin',
    recipient: WEBOWNER_EMAIL,
    subject: `[Nieuwsbrief] Nieuwe aanmelding: ${email}`,
    preview: `Nieuwe nieuwsbriefaanmelding: ${email}`,
    text: `Beste Laurent,\n\nEr is zojuist een nieuwe inschrijving ontvangen voor de nieuwsbrief:\nE-mail: ${email}\nDatum: ${new Date().toLocaleString('nl-BE')}`,
  });
}

/**
 * 9. Failed Payment Notification
 */
export async function sendFailedPaymentEmail(order: any, reason?: string) {
  const retryUrl = order.molliePaymentUrl || `https://www.maison-milau.be/checkout?retryOrderId=${order.id}`;

  const customerSubject = `Betaling niet gelukt voor bestelling ${order.orderNumber} · Maison Milau`;
  const customerText = `Beste ${order.customerName},

Helaas konden we uw betaling van €${(order.total || 0).toFixed(2)} voor bestelling #${order.orderNumber} niet voltooien (${reason || 'transactie geannuleerd of verlopen'}).

Geen zorgen: uw geselecteerde specialty koffies zijn tijdelijk voor u gereserveerd.
U kunt de betaling eenvoudig opnieuw proberen via deze beveiligde link:
${retryUrl}

Heeft u vragen of wenst u een overschrijving te doen? Neem contact op met ons via ${WEBOWNER_EMAIL}.

Met vriendelijke groet,
Maison Milau Support`;

  const customerHtml = buildHtmlWrapper(
    'Betaling Niet Afgerond',
    `Opnieuw betalen voor bestelling #${order.orderNumber}`,
    `<p>Beste ${order.customerName},</p>
    <p>Helaas is de betaling voor uw bestelling <strong>#${order.orderNumber}</strong> (€${(order.total || 0).toFixed(2)}) niet succesvol afgerond (${reason || 'geannuleerd of sessie verlopen'}).</p>
    <div class="box">
      <p style="margin:0 0 8px 0;font-weight:600;">Geen zorgen:</p>
      <p style="margin:0;font-size:14px;">Uw bestelling is tijdelijk bewaard in ons systeem. U kunt de betaling met één klik opnieuw uitvoeren via Bancontact, iDEAL of Creditcard.</p>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="${retryUrl}" class="btn">Betaling Nu Voltooien</a>
    </div>`
  );

  await sendEmail({
    type: 'payment_failed',
    recipient: order.customerEmail,
    subject: customerSubject,
    preview: `Betaling niet voltooid voor bestelling #${order.orderNumber}`,
    text: customerText,
    html: customerHtml,
  });

  await sendEmail({
    type: 'admin_payment_failed',
    recipient: WEBOWNER_EMAIL,
    subject: `[Betaling Mislukt] Order #${order.orderNumber} (€${(order.total || 0).toFixed(2)})`,
    preview: `Betaling mislukt voor order #${order.orderNumber}`,
    text: `Beste Laurent,\n\nDe betaling voor order #${order.orderNumber} van klant ${order.customerName} (${order.customerEmail}) is niet geslaagd.\nBedrag: €${(order.total || 0).toFixed(2)}\nReden: ${reason || 'Geannuleerd / Time-out'}`,
  });
}

/**
 * 10. Coffee Review Request
 */
export async function sendReviewRequestEmail(order: any) {
  const reviewUrl = 'https://www.maison-milau.be/webshop';
  const coffeeNames = (order.items || []).map((i: any) => i.productName).join(', ');

  const customerSubject = `Hoe smaakt uw vers gebrande Maison Milau koffie?`;
  const customerText = `Beste ${order.customerName},

Onlangs ontving u uw vers gebrande bonen (${coffeeNames}). Wij zijn ontzettend benieuwd naar uw smaakervaring en crema!

Deel uw cupping score en proefnotities via onze webshop:
${reviewUrl}

Uw feedback helpt ons brandprofiel continu te verfijnen.

Met aromatische groet,
Laurent Michiels · Maison Milau`;

  return sendEmail({
    type: 'review_request',
    recipient: order.customerEmail,
    subject: customerSubject,
    preview: `Deel uw ervaring over uw koffie (${coffeeNames})`,
    text: customerText,
  });
}
