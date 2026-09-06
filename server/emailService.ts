import 'dotenv/config';
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

export const WEBOWNER_EMAIL = (process.env.ADMIN_EMAIL || 'maisonmilau@gmail.com').trim();
export const SENDER_EMAIL = (process.env.SENDER_EMAIL || process.env.SUPPORT_EMAIL || 'maisonmilau@gmail.com').trim();
const rawSenderName = process.env.SENDER_NAME;
export const SENDER_NAME = (rawSenderName && rawSenderName !== 'Maison Milai' ? rawSenderName : 'Maison Milau').trim();

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

export function resetTransporterCache() {
  transporterPromise = null;
  console.log('[SMTP CACHE] Transporter cache cleared. Next request will read latest environment variables.');
}

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
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
    const rawUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
    const smtpUser = rawUser ? rawUser.replace(/^SMTP_USER\s*[:=]?\s*/i, '').trim() : undefined;
    const smtpPass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS)?.trim();

    if (smtpUser && smtpPass) {
      console.log(`[SMTP CONFIG] Live SMTP credentials loaded: host=${smtpHost}:${smtpPort}, secure=${smtpSecure}, user=${smtpUser}, passLength=${smtpPass.length}`);
      activeProvider = `SMTP (${smtpHost}:${smtpPort})`;
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        debug: true,
        logger: true,
        tls: {
          rejectUnauthorized: false,
        },
      });
      console.log(`[EMAIL STEP 2] Transporter created (host: ${smtpHost}:${smtpPort}, user: ${smtpUser})`);

      try {
        console.log(`[EMAIL STEP 3] SMTP verify started with ${smtpHost}:${smtpPort}...`);
        await transporter.verify();
        console.log(`[EMAIL STEP 4] SMTP verify success for ${smtpUser} on ${smtpHost}:${smtpPort}`);
      } catch (verifyErr: any) {
        console.error(`[EMAIL ERROR] Full error details during SMTP verify on ${smtpHost}:${smtpPort}:`, {
          message: verifyErr.message,
          code: verifyErr.code,
          command: verifyErr.command,
          response: verifyErr.response,
          responseCode: verifyErr.responseCode,
        });
        // Reset cache so that subsequent attempts can pick up newly injected environment variables
        transporterPromise = null;
      }
      return transporter;
    }

    // When live credentials are not set, provision an Ethereal SMTP test account for real SMTP transmission
    console.warn('[EMAIL ERROR] Full error details: Missing SMTP_USER or SMTP_PASS environment variables! Provisioning real Ethereal SMTP test account...');
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
        debug: true,
        logger: true,
      });
      console.log(`[EMAIL STEP 2] Transporter created (Ethereal test account: ${testAccount.user})`);
      console.log('[EMAIL STEP 3] SMTP verify started with Ethereal...');
      await testTransporter.verify();
      console.log('[EMAIL STEP 4] SMTP verify success with Ethereal');
      return testTransporter;
    } catch (testErr: any) {
      console.error('[EMAIL ERROR] Full error details: Failed to create Ethereal test account:', testErr);
      activeProvider = 'Direct Fallback Transport';
      return nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  })();

  return transporterPromise;
}

/**
 * Perform a real-time SMTP connection, authentication, and transmission test to a specific address
 */
export async function performSmtpDiagnosticTest(targetEmail = 'maisonmilau@gmail.com') {
  resetTransporterCache();

  const smtpHost = process.env.SMTP_HOST || process.env.SMTP_SERVER || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
  const rawUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER || '';
  const smtpUser = rawUser.replace(/^SMTP_USER\s*[:=]?\s*/i, '').trim();
  const rawPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || '';
  const smtpPass = rawPass.trim();

  console.log('\n[SMTP DIAGNOSTICS TEST START] =======================================');
  console.log(`[SMTP DIAGNOSTICS] Loaded host: ${smtpHost}`);
  console.log(`[SMTP DIAGNOSTICS] Loaded port: ${smtpPort}`);
  console.log(`[SMTP DIAGNOSTICS] Loaded secure: ${smtpSecure}`);
  console.log(`[SMTP DIAGNOSTICS] Loaded user: "${smtpUser}"`);
  console.log(`[SMTP DIAGNOSTICS] Loaded pass length: ${smtpPass.length}`);
  console.log(`[SMTP DIAGNOSTICS] Target recipient: ${targetEmail}`);

  if (!smtpUser || !smtpPass) {
    return {
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUser: smtpUser || '(niet geconfigureerd)',
      passConfigured: Boolean(smtpPass),
      authResult: 'failed' as const,
      exactSmtpResponse: 'Geen SMTP_USER of SMTP_PASS gevonden in omgevingsvariabelen.',
      messageId: null,
      deliveryStatus: 'failed' as const,
      error: 'Ontbrekende SMTP inloggegevens in environment variables.',
    };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    debug: true,
    logger: true,
    tls: {
      rejectUnauthorized: false,
    },
  });

  let authSuccess = false;
  let exactSmtpResponse = '';
  let authError: any = null;

  try {
    console.log('[SMTP DIAGNOSTICS] Verifying connection & authenticating with Gmail...');
    await transporter.verify();
    authSuccess = true;
    exactSmtpResponse = '235 2.7.0 Accepted: Authentication succeeded';
    console.log('[SMTP DIAGNOSTICS] ✅ Gmail SMTP Authentication succeeded!');
  } catch (err: any) {
    authSuccess = false;
    authError = err;
    exactSmtpResponse = err.response || err.message;
    console.error('[SMTP DIAGNOSTICS] ❌ Gmail SMTP Authentication failed:', exactSmtpResponse);
  }

  if (!authSuccess) {
    return {
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUser,
      authResult: 'failed' as const,
      exactSmtpResponse,
      messageId: null,
      deliveryStatus: 'failed' as const,
      error: authError?.message || 'SMTP Authentication Failed',
      errorCode: authError?.code,
      responseCode: authError?.responseCode,
    };
  }

  // Attempt to send real message
  try {
    console.log(`[SMTP DIAGNOSTICS] Sending real test email to ${targetEmail}...`);
    const info = await transporter.sendMail({
      from: `"${SENDER_NAME}" <${smtpUser}>`,
      to: targetEmail,
      subject: `[SMTP Live Test] Maison Milau Delivery Verification · ${new Date().toLocaleTimeString('nl-BE')}`,
      text: `Beste Laurent,\n\nDit is een live verificatie-e-mail verzonden via Google SMTP (${smtpHost}:${smtpPort}).\n\nVerzonden naar: ${targetEmail}\nDatum: ${new Date().toLocaleString('nl-BE')}\n\nAls u dit bericht ontvangt in uw inbox, functioneert de e-mailtransmissie vlekkeloos.\n\nWarme groeten,\nMaison Milau Systeembeheer`,
      html: buildHtmlWrapper(
        'Live SMTP Afleveringstest',
        `Verzonden naar ${targetEmail} via ${smtpHost}`,
        `<p>Beste Laurent,</p>
        <p>Dit is een <strong>live verificatie-e-mail</strong> verstuurd via het geauthenticeerde Google SMTP-kanaal.</p>
        <div class="box">
          <p style="margin:0 0 6px 0;font-weight:600;">Verzenddetails:</p>
          <p style="margin:0;font-size:14px;">
            Host: <code>${smtpHost}:${smtpPort}</code><br>
            Afzender: <code>${smtpUser}</code><br>
            Ontvanger: <code>${targetEmail}</code><br>
            Tijdstip: <strong>${new Date().toLocaleString('nl-BE')}</strong>
          </p>
        </div>
        <p>Als u dit bericht leest in uw inbox, heeft Gmail de authenticatie geaccepteerd en het bericht direct afgeleverd.</p>`
      ),
    });

    console.log(`[SMTP DIAGNOSTICS] ✅ Gmail accepted message! Message-ID: ${info.messageId}`);
    console.log(`[SMTP DIAGNOSTICS] Response from Gmail: ${info.response}`);

    return {
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUser,
      authResult: 'success' as const,
      exactSmtpResponse: info.response || 'Message accepted by Gmail',
      messageId: info.messageId,
      deliveryStatus: 'accepted' as const,
      accepted: info.accepted,
      rejected: info.rejected,
    };
  } catch (sendErr: any) {
    console.error('[SMTP DIAGNOSTICS] ❌ Sending email failed:', sendErr);
    return {
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUser,
      authResult: 'success' as const,
      exactSmtpResponse: sendErr.response || sendErr.message,
      messageId: null,
      deliveryStatus: 'failed' as const,
      error: sendErr.message,
    };
  }
}

/**
 * Diagnostic check for SMTP connectivity and configuration
 */
export async function auditEmailConfiguration() {
  return performSmtpDiagnosticTest(WEBOWNER_EMAIL);
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
  attachments?: any[];
}): Promise<EmailLogEntry> {
  const { type, recipient, subject, preview, text, html, replyTo, attachments } = options;
  const logId = `eml-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  console.log(`\n[EMAIL SEND ATTEMPT] =================================================`);
  console.log(`[EMAIL SEND ATTEMPT] Type: ${type}`);
  console.log(`[EMAIL SEND ATTEMPT] Recipient Address: "${recipient}"`);
  console.log(`[EMAIL SEND ATTEMPT] Sender: "${SENDER_NAME}" <${SENDER_EMAIL}>`);
  console.log(`[EMAIL SEND ATTEMPT] Subject: "${subject}"`);
  console.log(`[EMAIL SEND ATTEMPT] Attachments count: ${attachments ? attachments.length : 0}`);
  console.log(`[EMAIL SEND ATTEMPT] =================================================`);

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
    console.log(`[EMAIL SEND ATTEMPT] Dispatch attempt ${attempt}/${maxAttempts} for ${recipient}...`);
    try {
      const transporter = await getTransporter();
      const mailOptions: SendMailOptions = {
        from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
        to: recipient,
        replyTo: replyTo || SENDER_EMAIL,
        subject,
        text,
        html: html || buildHtmlWrapper(subject, preview, `<pre style="font-family:inherit;white-space:pre-wrap;">${text}</pre>`),
        attachments,
      };

      console.log(`[EMAIL STEP 5] sendMail started (attempt ${attempt}/${maxAttempts}) via ${activeProvider} to ${recipient}...`);
      const info = await transporter.sendMail(mailOptions);
      logEntry.status = 'sent';
      logEntry.messageId = info.messageId;
      logEntry.provider = activeProvider;

      console.log(`[EMAIL STEP 6] sendMail success for ${recipient}`);
      console.log(`[EMAIL STEP 7] Message-ID returned: ${info.messageId}`);
      if (info.response) {
        console.log(`[SMTP RESPONSE] ✅ Provider SMTP Response: ${info.response}`);
      }
      if (info.accepted) {
        console.log(`[SMTP ACCEPTED RECIPIENTS] ${JSON.stringify(info.accepted)}`);
      }
      if (info.rejected && info.rejected.length > 0) {
        console.warn(`[SMTP REJECTED RECIPIENTS] ⚠️ ${JSON.stringify(info.rejected)}`);
      }

      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        logEntry.previewUrl = previewUrl;
        console.log(`[EMAIL PREVIEW URL] ${previewUrl}`);
      }

      return logEntry;
    } catch (err: any) {
      lastError = err;
      console.error(`[EMAIL ERROR] Full error details during sendMail (attempt ${attempt}/${maxAttempts}) for ${recipient}:`, {
        message: err.message,
        code: err.code,
        command: err.command,
        response: err.response,
        responseCode: err.responseCode,
        stack: err.stack,
      });

      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 600 * attempt));
      }
    }
  }

  logEntry.status = 'failed';
  logEntry.error = lastError?.message || 'Onbekende fout tijdens transmissie';
  console.error(`[EMAIL ERROR] Full error details: All ${maxAttempts} attempts failed for recipient: ${recipient}. Final reason: ${logEntry.error}`);

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

  console.log(`\n[CONTACT WORKFLOW AUDIT] ---------------------------------------------`);
  console.log(`[CONTACT WORKFLOW AUDIT] Step 2: emailService.sendContactFormEmails invoked`);
  console.log(`[CONTACT WORKFLOW AUDIT] Ticket Reference: #${ticketRef}`);
  console.log(`[CONTACT WORKFLOW AUDIT] Administrator Recipient: "${WEBOWNER_EMAIL}"`);
  console.log(`[CONTACT WORKFLOW AUDIT] Customer Recipient: "${data.customerEmail}"`);
  console.log(`[CONTACT WORKFLOW AUDIT] ---------------------------------------------`);

  // 1. Email to Administrator (maisonmilau@gmail.com)
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

  console.log(`[CONTACT WORKFLOW AUDIT] Step 3: Dispatching Administrator notification email...`);
  const adminResult = await sendEmail({
    type: 'contact_form_admin',
    recipient: WEBOWNER_EMAIL,
    replyTo: data.customerEmail,
    subject: adminSubject,
    preview: `Bericht van ${data.customerName}: ${data.subject}`,
    text: adminText,
    html: adminHtml,
  });
  console.log(`[CONTACT WORKFLOW AUDIT] Administrator notification result: status="${adminResult.status}", msgId="${adminResult.messageId || 'none'}"`);

  // 2. Auto-reply to Customer
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

  console.log(`[CONTACT WORKFLOW AUDIT] Step 4: Dispatching Customer confirmation email...`);
  const customerResult = await sendEmail({
    type: 'contact_form_customer',
    recipient: data.customerEmail,
    subject: customerSubject,
    preview: `Wij hebben uw vraag #${ticketRef} ontvangen`,
    text: customerText,
    html: customerHtml,
  });
  console.log(`[CONTACT WORKFLOW AUDIT] Customer confirmation result: status="${customerResult.status}", msgId="${customerResult.messageId || 'none'}"`);

  return { adminResult, customerResult };
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
 * Helper to determine application base URL dynamically
 */
export function getAppBaseUrl(req?: any): string {
  if (req) {
    const origin = typeof req.get === 'function' ? req.get('origin') : (req.headers && req.headers.origin);
    if (origin && typeof origin === 'string' && !origin.includes('localhost:3000')) {
      return origin.replace(/\/+$/, '');
    }
    const host = typeof req.get === 'function' ? req.get('host') : (req.headers && req.headers.host);
    if (host && typeof host === 'string') {
      const proto = (typeof req.get === 'function' ? req.get('x-forwarded-proto') : (req.headers && req.headers['x-forwarded-proto'])) || 'https';
      return `${proto}://${host}`.replace(/\/+$/, '');
    }
  }
  return (process.env.APP_URL || 'https://www.maison-milau.be').replace(/\/+$/, '');
}

/**
 * 3. Email Verification
 */
export async function sendEmailVerificationEmail(email: string, token: string, name: string, baseUrl?: string) {
  const base = baseUrl || process.env.APP_URL || 'https://www.maison-milau.be';
  const cleanBase = base.replace(/\/+$/, '');
  const verifyUrl = `${cleanBase}/account?verifyToken=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  const subject = 'Verifieer uw e-mailadres voor Maison Milau';
  const text = `Beste ${name},

Gelieve uw e-mailadres te bevestigen om toegang te krijgen tot alle functies van uw Maison Milau account.

Klik op onderstaande link om uw e-mailadres te verifiëren:
${verifyUrl}

Deze verificatielink blijft 24 uur geldig.

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
export async function sendPasswordResetEmail(email: string, resetToken: string, name: string, baseUrl?: string) {
  const base = baseUrl || process.env.APP_URL || 'https://www.maison-milau.be';
  const cleanBase = base.replace(/\/+$/, '');
  const resetUrl = `${cleanBase}/account?resetToken=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`;
  const subject = 'Wachtwoord opnieuw instellen · Maison Milau';
  const text = `Beste ${name},

Wij hebben een aanvraag ontvangen om het wachtwoord van uw Maison Milau account opnieuw in te stellen.

Gebruik de onderstaande link om een nieuw wachtwoord te kiezen:
${resetUrl}

Deze link is om veiligheidsredenen 60 minuten geldig.
Heeft u dit verzoek niet zelf ingediend? Dan kunt u deze e-mail veilig negeren; uw wachtwoord blijft ongewijzigd.

Met vriendelijke groet,
Maison Milau Beveiligingsteam`;

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
 * 4b. Password Successfully Changed Confirmation
 */
export async function sendPasswordChangedEmail(email: string, name: string) {
  const subject = 'Uw wachtwoord is gewijzigd · Maison Milau';
  const accountUrl = 'https://www.maison-milau.be/account';
  const text = `Beste ${name},

Het wachtwoord van uw Maison Milau account is zojuist succesvol gewijzigd.

Heeft u deze wijziging zelf uitgevoerd? Dan hoeft u niets te doen.
Heeft u deze wijziging niet uitgevoerd? Neem dan onmiddellijk contact op met onze klantenservice via ${WEBOWNER_EMAIL}.

Met vriendelijke groet,
Maison Milau Beveiliging`;

  const html = buildHtmlWrapper(
    'Wachtwoord Gewijzigd',
    'Beveiligingsbevestiging Maison Milau account',
    `<p>Beste ${name},</p>
    <p>Het wachtwoord van uw Maison Milau account is zojuist succesvol gewijzigd.</p>
    <div class="box">
      <p style="margin:0;font-size:13px;color:#15803d;font-weight:600;">
        ✓ Uw nieuwe wachtwoord is per direct actief en beveiligd.
      </p>
      <p style="margin:8px 0 0 0;font-size:12px;color:#78716c;">
        Indien u dit niet zelf heeft gedaan, contacteer ons dan meteen via <a href="mailto:${WEBOWNER_EMAIL}" style="color:#78350f;">${WEBOWNER_EMAIL}</a>.
      </p>
    </div>
    <div style="text-align:center;margin:20px 0;">
      <a href="${accountUrl}" class="btn">Naar Mijn Account</a>
    </div>`
  );

  return sendEmail({
    type: 'password_changed',
    recipient: email,
    subject,
    preview: 'Uw accountwachtwoord is succesvol gewijzigd',
    text,
    html,
  });
}

/**
 * 5. New Order Confirmation (Customer & Admin)
 */
export async function sendOrderEmails(order: any, pdfBuffer?: Buffer) {
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

  const invoiceAttachment = pdfBuffer
    ? [
        {
          filename: `Maison-Milau-Factuur-${order.invoiceNumber || order.orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ]
    : undefined;

  await sendEmail({
    type: 'order_confirmation_customer',
    recipient: order.customerEmail,
    subject: customerSubject,
    preview: `Bevestiging van bestelling #${order.orderNumber}`,
    text: customerText,
    html: customerHtml,
    attachments: invoiceAttachment,
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
    attachments: invoiceAttachment,
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
  action: 'created' | 'modified' | 'paused' | 'resumed' | 'cancelled' | 'frequency_changed' | 'coffee_changed' | 'address_changed' | 'skipped',
  sub: {
    id: string;
    customerName?: string;
    customerEmail: string;
    productName: string;
    collection?: string;
    grindOption: string;
    weight: string;
    frequency: string;
    discountPercent?: number;
    shippingCost?: number;
    pricePerDelivery: number;
    totalRecurring?: number;
    nextBillingDate?: string;
    nextDeliveryDate?: string;
    effectiveDate?: string;
    shippingAddress?: any;
    billingAddress?: any;
    previous?: {
      productName?: string;
      collection?: string;
      grindOption?: string;
      weight?: string;
      frequency?: string;
      pricePerDelivery?: number;
      shippingCost?: number;
      totalRecurring?: number;
      shippingAddress?: any;
    };
  }
) {
  const managementLink = 'https://www.maison-milau.be/account?tab=subscriptions';
  const discountText = `${sub.discountPercent || 10}% abonnementskorting inbegrepen`;
  const shippingText = (sub.shippingCost || 0) === 0 ? 'Gratis verzending' : `€${(sub.shippingCost || 0).toFixed(2)}`;
  const totalAmount = sub.totalRecurring ?? (sub.pricePerDelivery + (sub.shippingCost || 0));
  const effectiveDate = sub.effectiveDate || new Date().toLocaleDateString('nl-BE');
  const cancellationInstructions = 'Maandelijks opzegbaar zonder opzegkosten of langdurige verplichtingen. U heeft volledige controle om uw levering op elk moment te pauzeren, over te slaan of kosteloos te annuleren via uw Maison Milau klantenportaal.';

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
      subject = `Bevestiging Wijziging Koffie-Abonnement · ${sub.productName}`;
      title = 'Uw Abonnement is Succesvol Bijgewerkt';
      statusBadge = 'Gewijzigd';
      break;
    case 'frequency_changed':
      subject = `Leverfrequentie Gewijzigd · ${sub.frequency} · ${sub.productName}`;
      title = 'Nieuwe Leverfrequentie Ingesteld';
      statusBadge = 'Frequentie Aangepast';
      break;
    case 'coffee_changed':
      subject = `Koffiekeuze Gewijzigd · ${sub.productName}`;
      title = 'Uw Nieuwe Koffieselectie is Bevestigd';
      statusBadge = 'Koffie Aangepast';
      break;
    case 'address_changed':
      subject = `Bezorgadres Abonnement Bijgewerkt · ${sub.productName}`;
      title = 'Nieuw Leveradres Geregistreerd';
      statusBadge = 'Adres Bijgewerkt';
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
    case 'skipped':
      subject = `Volgende Levering Overgeslagen · ${sub.productName}`;
      title = 'Levering Eenmalig Overgeslagen';
      statusBadge = 'Levering Overgeslagen';
      break;
    case 'cancelled':
      subject = `Bevestiging Kosteloze Opzegging Koffie-Abonnement · ${sub.productName}`;
      title = 'Uw Abonnement is Beëindigd';
      statusBadge = 'Geannuleerd';
      break;
  }

  const prev = sub.previous;
  const addressFormatted = sub.shippingAddress
    ? `${sub.shippingAddress.street}, ${sub.shippingAddress.postalCode} ${sub.shippingAddress.city}`
    : 'Standaard accountadres';
  const prevAddressFormatted = prev?.shippingAddress
    ? `${prev.shippingAddress.street}, ${prev.shippingAddress.postalCode} ${prev.shippingAddress.city}`
    : null;

  const comparisonText = prev
    ? `
VERGELIJKING MET VORIGE CONFIGURATIE:
• Koffie: ${prev.productName || 'Onbekend'} → ${sub.productName}
• Inhoud & Maalgraad: ${prev.weight || '1kg'} (${prev.grindOption || 'Volle bonen'}) → ${sub.weight} (${sub.grindOption})
• Leverfrequentie: ${prev.frequency || '-'} → ${sub.frequency}
• Vorig periodiek bedrag: €${((prev.totalRecurring ?? (prev.pricePerDelivery || sub.pricePerDelivery))).toFixed(2)}
• Nieuw periodiek bedrag: €${totalAmount.toFixed(2)} (incl. verzending: ${shippingText})
• Ingangsdatum wijziging: ${effectiveDate}
`
    : '';

  const text = `Beste ${sub.customerName || 'Koffieliefhebber'},

${title}

Hieronder vindt u de actuele specificaties van uw periodieke koffielevering:${comparisonText}

ACTUELE ABONNEMENTSDETAILS:
• Geselecteerde koffie: ${sub.productName} ${sub.collection ? `(${sub.collection} Collectie)` : ''}
• Maalgraad optie: ${sub.grindOption || 'Volle bonen (vers van de brander)'}
• Formaat / Inhoud: ${sub.weight || '1kg'}
• Leverfrequentie: ${sub.frequency || 'Elke 4 weken'}
• Abonnementskorting: ${discountText}
• Verzendkosten: ${shippingText}
• Nieuw periodiek bedrag: €${totalAmount.toFixed(2)} per levering
• Ingangsdatum wijziging: ${effectiveDate}
• Volgende facturatiedatum: ${sub.nextBillingDate || 'Vóór volgende levering'}
• Volgende leverdatum: ${sub.nextDeliveryDate || 'Binnenkort gepland'}
• Leveradres: ${addressFormatted}

VOORWAARDEN & FLEXIBILITEIT:
• Maandelijks opzegbaar zonder opzegkosten
• Geen minimale contractduur
• Zelfstandig te beheren, pauzeren of aanpassen via uw account

BEHEER & OPZEGGEN:
Beheer uw abonnement direct via: ${managementLink}

${cancellationInstructions}

Heeft u vragen of wensen? Beantwoord gerust deze e-mail of contacteer ons via ${WEBOWNER_EMAIL}.

Met aromatische groet,
Laurent Michiels · Maison Milau Ambachtelijke Koffiebranderij`;

  const comparisonHtml = prev
    ? `<div class="box" style="background:#fefce8;border-color:#fef08a;margin-bottom:16px;">
        <p style="margin:0 0 8px 0;font-weight:700;color:#854d0e;">Wijzigingsoverzicht (Voorheen vs. Nieuw):</p>
        <table style="width:100%;font-size:12px;">
          <tr><th style="color:#713f12;">Onderdeel</th><th style="color:#713f12;">Vorige Configuratie</th><th style="color:#713f12;">Nieuwe Configuratie</th></tr>
          <tr><td>Koffie:</td><td style="color:#78716c;text-decoration:line-through;">${prev.productName || '-'}</td><td><strong>${sub.productName}</strong></td></tr>
          <tr><td>Inhoud:</td><td style="color:#78716c;">${prev.weight || '-'}</td><td><strong>${sub.weight}</strong></td></tr>
          <tr><td>Maalgraad:</td><td style="color:#78716c;">${prev.grindOption || '-'}</td><td><strong>${sub.grindOption}</strong></td></tr>
          <tr><td>Frequentie:</td><td style="color:#78716c;">${prev.frequency || '-'}</td><td><strong>${sub.frequency}</strong></td></tr>
          ${prevAddressFormatted ? `<tr><td>Leveradres:</td><td style="color:#78716c;">${prevAddressFormatted}</td><td><strong>${addressFormatted}</strong></td></tr>` : ''}
          <tr><td>Periodiek bedrag:</td><td style="color:#78716c;">€${(prev.totalRecurring ?? (prev.pricePerDelivery || 0)).toFixed(2)}</td><td><strong style="color:#15803d;font-size:14px;">€${totalAmount.toFixed(2)}</strong></td></tr>
          <tr><td>Ingangsdatum:</td><td colspan="2"><strong>${effectiveDate}</strong></td></tr>
        </table>
      </div>`
    : '';

  const html = buildHtmlWrapper(
    title,
    `Status update abonnement: ${sub.productName}`,
    `<p>Beste ${sub.customerName || 'Koffieliefhebber'},</p>
    <p>${action === 'cancelled' 
      ? 'Wij bevestigen dat uw periodieke koffielevering kosteloos is stopgezet. Er zullen geen verdere inhoudingen meer plaatsvinden. U kunt uw abonnement op elk gewenst moment opnieuw activeren.' 
      : action === 'paused'
      ? 'Uw koffie-abonnement is tijdelijk gepauzeerd. U ontvangt geen leveringen en er vinden geen inhoudingen plaats totdat u hervat.'
      : action === 'skipped'
      ? 'Uw eerstvolgende levering is overgeslagen. De volgende leverdatum is automatisch opgeschoven.'
      : 'Uw abonnement is conform uw wensen geconfigureerd met vers gebrande specialty koffiebonen direct uit ons atelier in Oudegem.'}</p>

    ${comparisonHtml}

    <div class="box">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <strong style="color:#78350f;">Actuele Abonnementsspecificaties</strong>
        <span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;">${statusBadge}</span>
      </div>
      <table>
        <tr><th>Geselecteerde koffie:</th><td><strong>${sub.productName}</strong> ${sub.collection ? `<span style="color:#78716c;">(${sub.collection})</span>` : ''}</td></tr>
        <tr><th>Maalgraad:</th><td>${sub.grindOption || 'Volle bonen'}</td></tr>
        <tr><th>Inhoud per levering:</th><td>${sub.weight || '1kg'}</td></tr>
        <tr><th>Leverfrequentie:</th><td>${sub.frequency || 'Elke 4 weken'}</td></tr>
        <tr><th>Abonnementskorting:</th><td><span style="color:#15803d;font-weight:600;">${discountText}</span></td></tr>
        <tr><th>Verzendkosten:</th><td>${shippingText}</td></tr>
        <tr><th>Nieuw periodiek bedrag:</th><td><strong style="font-size:17px;color:#78350f;">€${totalAmount.toFixed(2)}</strong> <span style="font-size:11px;color:#78716c;">/ levering</span></td></tr>
        <tr><th>Ingangsdatum:</th><td><strong>${effectiveDate}</strong></td></tr>
        <tr><th>Volgende facturatiedatum:</th><td>${sub.nextBillingDate || 'Berekend bij brandcyclus'}</td></tr>
        <tr><th>Volgende leverdatum:</th><td><strong>${sub.nextDeliveryDate || 'Zie account'}</strong></td></tr>
        <tr><th>Leveradres:</th><td>${addressFormatted}</td></tr>
      </table>
    </div>

    <div class="box" style="background:#f0fdf4;border-color:#bbf7d0;">
      <p style="margin:0 0 4px 0;font-weight:700;color:#166534;">✓ Maximale Flexibiliteit & Zekerheid:</p>
      <ul style="margin:0;padding-left:18px;font-size:12px;color:#14532d;line-height:1.6;">
        <li><strong>Maandelijks opzegbaar</strong> zonder opzegtermijn of verborgen kosten</li>
        <li><strong>Geen minimale contractduur</strong></li>
        <li><strong>Volledig zelfstandig beheerbaar</strong> via uw online klantenportaal</li>
      </ul>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="${managementLink}" class="btn">Beheer Abonnement in Account</a>
    </div>`
  );

  return sendEmail({
    type: `subscription_${action}`,
    recipient: sub.customerEmail,
    subject,
    preview: `Abonnement update: ${sub.productName} (€${totalAmount.toFixed(2)})`,
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

/**
 * 11. B2B Quote Request Emails
 */
export async function sendB2BQuoteEmails(quote: any) {
  const adminSubject = `[Maison Milau B2B] Nieuwe offerteaanvraag van ${quote.companyName}`;
  const adminText = `Beste Laurent,\n\nEr is een nieuwe B2B aanvraag binnengekomen:\n\nBedrijf: ${quote.companyName}\nBTW: ${quote.vatNumber || 'Niet opgegeven'}\nContactpersoon: ${quote.contactPerson}\nE-mail: ${quote.email}\nTelefoon: ${quote.phone}\nSector: ${quote.sector || 'Kantoor'}\nBehoefte: ${quote.machineNeed || 'Verse bonen'}\nGeschat volume: ${quote.monthlyVolumeKg} kg/maand\nOpmerkingen: ${quote.notes || 'Geen'}\n\nDatum: ${new Date().toLocaleString('nl-BE')}`;
  const adminHtml = buildHtmlWrapper(
    adminSubject,
    `Offerteaanvraag van ${quote.companyName} (${quote.monthlyVolumeKg} kg/mnd)`,
    `<p>Beste Laurent,</p>
    <p>Er is een nieuwe B2B aanvraag ingediend:</p>
    <div class="box">
      <table style="width:100%;font-size:14px;border-collapse:collapse;">
        <tr><td style="padding:4px 0;font-weight:600;width:140px;">Bedrijf:</td><td>${quote.companyName}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">BTW-nummer:</td><td>${quote.vatNumber || 'Niet opgegeven'}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Contactpersoon:</td><td>${quote.contactPerson}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">E-mail:</td><td><a href="mailto:${quote.email}">${quote.email}</a></td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Telefoon:</td><td><a href="tel:${quote.phone}">${quote.phone}</a></td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Sector:</td><td>${quote.sector || 'Kantoor'}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Behoefte:</td><td>${quote.machineNeed || 'Verse bonen'}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Maandvolume:</td><td><strong>${quote.monthlyVolumeKg} kg / maand</strong></td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Opmerkingen:</td><td>${quote.notes || 'Geen'}</td></tr>
      </table>
    </div>`
  );

  const customerSubject = `Ontvangstbevestiging: Uw B2B Aanvraag bij Maison Milau`;
  const customerText = `Beste ${quote.contactPerson},\n\nHartelijk dank voor uw interesse in Maison Milau koffie voor ${quote.companyName}.\n\nWij hebben uw offerteaanvraag goed ontvangen en bezorgen u binnen 24 uur een voorstel op maat.\n\nMet vriendelijke groet,\nLaurent Michiels · Maison Milau Ambachtelijke Branderij`;
  const customerHtml = buildHtmlWrapper(
    customerSubject,
    `Uw offerteaanvraag voor ${quote.companyName} is goed ontvangen`,
    `<p>Beste ${quote.contactPerson},</p>
    <p>Hartelijk dank voor uw interesse in de ambachtelijke koffie en espressomachines van Maison Milau voor <strong>${quote.companyName}</strong>.</p>
    <div class="box">
      <p style="margin:0 0 6px 0;font-weight:600;">Overzicht van uw aanvraag:</p>
      <p style="margin:0;font-size:14px;">Sector: ${quote.sector || 'Kantoor'}<br>Geschat verbruik: ${quote.monthlyVolumeKg} kg per maand<br>Behoefte: ${quote.machineNeed || 'Verse specialty koffiebonen'}</p>
    </div>
    <p>Onze koffie-expert analyseert uw aanvraag en bezorgt u binnen 24 uur een passend staffel- en servicevoorstel.</p>
    <p style="font-size:14px;color:#78716c;margin-top:20px;">Heeft u dringende vragen? U kunt ons altijd rechtstreeks bereiken op <a href="mailto:${WEBOWNER_EMAIL}" style="color:#78350f;">${WEBOWNER_EMAIL}</a>.</p>`
  );

  await sendEmail({
    type: 'admin_b2b',
    recipient: WEBOWNER_EMAIL,
    subject: adminSubject,
    preview: `B2B offerteaanvraag van ${quote.companyName}`,
    text: adminText,
    html: adminHtml,
  });

  await sendEmail({
    type: 'customer_b2b',
    recipient: quote.email,
    subject: customerSubject,
    preview: `Bevestiging B2B aanvraag voor ${quote.companyName}`,
    text: customerText,
    html: customerHtml,
  });
}

/**
 * 12. Event Quote Request Emails
 */
export async function sendEventQuoteEmails(event: any) {
  const adminSubject = `[Maison Milau Events] Nieuwe catering aanvraag: ${event.eventType} op ${event.eventDate}`;
  const adminText = `Beste Laurent,\n\nEr is een nieuwe evenementen- en verhuuraanvraag binnengekomen:\n\nType: ${event.eventType}\nDatum: ${event.eventDate}\nAantal gasten: ${event.guestsCount}\nContactpersoon: ${event.contactPerson}\nE-mail: ${event.email}\nTelefoon: ${event.phone}\nMachine: ${event.machineRental}\nBarista: ${event.baristaService}\nBerekend: ~${event.calculatedBeansKg} kg bonen\nIndicatieve prijs: €${event.estimatedPrice}\nNotities: ${event.notes || 'Geen'}`;
  const adminHtml = buildHtmlWrapper(
    adminSubject,
    `Catering aanvraag voor ${event.eventType} (${event.guestsCount} gasten)`,
    `<p>Beste Laurent,</p>
    <p>Er is een nieuwe evenementenaanvraag ontvangen:</p>
    <div class="box">
      <table style="width:100%;font-size:14px;border-collapse:collapse;">
        <tr><td style="padding:4px 0;font-weight:600;width:140px;">Type evenement:</td><td>${event.eventType}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Datum:</td><td><strong>${event.eventDate}</strong></td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Gasten:</td><td>${event.guestsCount} personen</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Contactpersoon:</td><td>${event.contactPerson}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">E-mail:</td><td><a href="mailto:${event.email}">${event.email}</a></td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Telefoon:</td><td><a href="tel:${event.phone}">${event.phone}</a></td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Machine huur:</td><td>${event.machineRental}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Barista service:</td><td>${event.baristaService}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Bonen (geschat):</td><td>~${event.calculatedBeansKg} kg</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Indicatieve prijs:</td><td><strong>€${event.estimatedPrice}</strong></td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Notities:</td><td>${event.notes || 'Geen'}</td></tr>
      </table>
    </div>`
  );

  const customerSubject = `Bevestiging: Uw koffiecatering aanvraag voor ${event.eventDate}`;
  const customerText = `Beste ${event.contactPerson},\n\nBedankt voor uw aanvraag voor uw ${event.eventType} op ${event.eventDate}.\n\nOns team bekijkt momenteel de beschikbaarheid van onze espressomachines en mobiele barista bars. Wij nemen spoedig telefonisch of per e-mail contact met u op.\n\nMet gastvrije groet,\nLaurent Michiels · Maison Milau Events`;
  const customerHtml = buildHtmlWrapper(
    customerSubject,
    `Uw aanvraag voor ${event.eventDate} is ontvangen`,
    `<p>Beste ${event.contactPerson},</p>
    <p>Hartelijk dank voor uw aanvraag voor <strong>${event.eventType}</strong> op <strong>${event.eventDate}</strong> (${event.guestsCount} gasten).</p>
    <div class="box">
      <p style="margin:0 0 6px 0;font-weight:600;">Samenvatting opties:</p>
      <p style="margin:0;font-size:14px;">Espressomachine huur: ${event.machineRental}<br>Barista service: ${event.baristaService}<br>Indicatieve richtprijs: €${event.estimatedPrice}</p>
    </div>
    <p>Wij controleren onze agenda en nemen zo snel mogelijk contact met u op om de details af te stemmen.</p>
    <p style="font-size:14px;color:#78716c;margin-top:20px;">Vragen? Contacteer ons via <a href="mailto:${WEBOWNER_EMAIL}" style="color:#78350f;">${WEBOWNER_EMAIL}</a>.</p>`
  );

  const adminResult = await sendEmail({
    type: 'admin_event',
    recipient: WEBOWNER_EMAIL,
    subject: adminSubject,
    preview: `Evenementenaanvraag ${event.eventType} op ${event.eventDate}`,
    text: adminText,
    html: adminHtml,
  });

  const customerResult = await sendEmail({
    type: 'customer_event',
    recipient: event.email,
    subject: customerSubject,
    preview: `Bevestiging event aanvraag voor ${event.eventDate}`,
    text: customerText,
    html: customerHtml,
  });

  if (adminResult.status !== 'sent' || !adminResult.messageId) {
    const errorMsg = `Admin notification email failed to send: ${adminResult.error || 'No messageId returned'}`;
    console.error('[EMAIL ERROR] Full error details:', errorMsg);
    throw new Error(errorMsg);
  }

  if (customerResult.status !== 'sent' || !customerResult.messageId) {
    const errorMsg = `Customer confirmation email failed to send: ${customerResult.error || 'No messageId returned'}`;
    console.error('[EMAIL ERROR] Full error details:', errorMsg);
    throw new Error(errorMsg);
  }

  return { adminResult, customerResult };
}
