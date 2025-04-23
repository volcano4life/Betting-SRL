import { MailService } from '@sendgrid/mail';
import { log } from '../vite';

// Initialize the mail service
let mailService: MailService | null = null;

// Email types and interfaces
export interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
}

// Initialize SendGrid if API key is available
export function initializeEmailService() {
  try {
    if (process.env.SENDGRID_API_KEY) {
      mailService = new MailService();
      mailService.setApiKey(process.env.SENDGRID_API_KEY);
      log('SendGrid email service initialized', 'email');
      return true;
    } else {
      log('SENDGRID_API_KEY not found. Email functionality will be disabled.', 'email');
      return false;
    }
  } catch (error) {
    log(`Failed to initialize SendGrid email service: ${error}`, 'email');
    return false;
  }
}

// Send an email using SendGrid
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!mailService) {
      if (!initializeEmailService()) {
        log('Email service not initialized. Cannot send email.', 'email');
        return false;
      }
    }

    await mailService!.send(options);
    log(`Email sent to ${options.to}`, 'email');
    return true;
  } catch (error) {
    log(`Failed to send email: ${error}`, 'email');
    return false;
  }
}

// Send a welcome email to a new user
export async function sendWelcomeEmail(email: string, username: string, language: string = 'en'): Promise<boolean> {
  const isItalian = language === 'it';
  
  const subject = isItalian 
    ? 'Benvenuto su Betting SRL!' 
    : 'Welcome to Betting SRL!';
  
  const text = isItalian
    ? `Ciao ${username},\n\nGrazie per esserti registrato a Betting SRL. Siamo entusiasti di averti con noi!\n\nCordiali saluti,\nIl team di Betting SRL`
    : `Hello ${username},\n\nThank you for registering with Betting SRL. We're excited to have you on board!\n\nBest regards,\nThe Betting SRL Team`;
  
  const html = isItalian
    ? `<h1>Benvenuto su Betting SRL!</h1>
       <p>Ciao <strong>${username}</strong>,</p>
       <p>Grazie per esserti registrato a Betting SRL. Siamo entusiasti di averti con noi!</p>
       <p>Cordiali saluti,<br>Il team di Betting SRL</p>`
    : `<h1>Welcome to Betting SRL!</h1>
       <p>Hello <strong>${username}</strong>,</p>
       <p>Thank you for registering with Betting SRL. We're excited to have you on board!</p>
       <p>Best regards,<br>The Betting SRL Team</p>`;
  
  return sendEmail({
    to: email,
    from: 'notifications@bettingsrl.com', // This should be verified in SendGrid
    subject,
    text,
    html
  });
}

// Send a newsletter subscription confirmation
export async function sendSubscriptionConfirmation(email: string, language: string = 'en'): Promise<boolean> {
  const isItalian = language === 'it';
  
  const subject = isItalian 
    ? 'Conferma di iscrizione alla Newsletter di Betting SRL' 
    : 'Betting SRL Newsletter Subscription Confirmation';
  
  const text = isItalian
    ? `Grazie per esserti iscritto alla newsletter di Betting SRL. Riceverai aggiornamenti su promozioni, nuovi giochi e notizie sul mondo del betting.\n\nPer annullare l'iscrizione in qualsiasi momento, clicca sul link "annulla iscrizione" in fondo a qualsiasi email ricevuta.\n\nCordiali saluti,\nIl team di Betting SRL`
    : `Thank you for subscribing to the Betting SRL newsletter. You will receive updates on promotions, new games, and betting news.\n\nTo unsubscribe at any time, click the "unsubscribe" link at the bottom of any email you receive.\n\nBest regards,\nThe Betting SRL Team`;
  
  const html = isItalian
    ? `<h1>Conferma di iscrizione alla Newsletter</h1>
       <p>Grazie per esserti iscritto alla newsletter di Betting SRL. Riceverai aggiornamenti su promozioni, nuovi giochi e notizie sul mondo del betting.</p>
       <p>Per annullare l'iscrizione in qualsiasi momento, clicca sul link "annulla iscrizione" in fondo a qualsiasi email ricevuta.</p>
       <p>Cordiali saluti,<br>Il team di Betting SRL</p>`
    : `<h1>Newsletter Subscription Confirmation</h1>
       <p>Thank you for subscribing to the Betting SRL newsletter. You will receive updates on promotions, new games, and betting news.</p>
       <p>To unsubscribe at any time, click the "unsubscribe" link at the bottom of any email you receive.</p>
       <p>Best regards,<br>The Betting SRL Team</p>`;
  
  return sendEmail({
    to: email,
    from: 'newsletter@bettingsrl.com', // This should be verified in SendGrid
    subject,
    text,
    html
  });
}

// Send a promo code notification
export async function sendPromoCodeNotification(email: string, promoDetails: {
  code: string;
  casino: string;
  bonus: string;
  validUntil: Date;
  link: string;
}, language: string = 'en'): Promise<boolean> {
  const isItalian = language === 'it';
  const formattedDate = promoDetails.validUntil.toLocaleDateString(
    isItalian ? 'it-IT' : 'en-US', 
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  
  const subject = isItalian 
    ? `Nuovo Codice Promozionale per ${promoDetails.casino}` 
    : `New Promo Code for ${promoDetails.casino}`;
  
  const text = isItalian
    ? `Abbiamo un nuovo codice promozionale per te!\n\nCasino: ${promoDetails.casino}\nBonus: ${promoDetails.bonus}\nCodice: ${promoDetails.code}\nValido fino al: ${formattedDate}\n\nVisita il nostro sito per approfittare di questa offerta: ${promoDetails.link}\n\nCordiali saluti,\nIl team di Betting SRL`
    : `We have a new promo code for you!\n\nCasino: ${promoDetails.casino}\nBonus: ${promoDetails.bonus}\nCode: ${promoDetails.code}\nValid until: ${formattedDate}\n\nVisit our site to take advantage of this offer: ${promoDetails.link}\n\nBest regards,\nThe Betting SRL Team`;
  
  const html = isItalian
    ? `<h1>Nuovo Codice Promozionale</h1>
       <p>Abbiamo un nuovo codice promozionale per te!</p>
       <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
         <p><strong>Casino:</strong> ${promoDetails.casino}</p>
         <p><strong>Bonus:</strong> ${promoDetails.bonus}</p>
         <p><strong>Codice:</strong> <span style="background: #f3f3f3; padding: 3px 8px; font-family: monospace;">${promoDetails.code}</span></p>
         <p><strong>Valido fino al:</strong> ${formattedDate}</p>
         <p><a href="${promoDetails.link}" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #e50914; color: white; text-decoration: none; border-radius: 4px;">Approfittane ora</a></p>
       </div>
       <p>Cordiali saluti,<br>Il team di Betting SRL</p>`
    : `<h1>New Promo Code</h1>
       <p>We have a new promo code for you!</p>
       <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
         <p><strong>Casino:</strong> ${promoDetails.casino}</p>
         <p><strong>Bonus:</strong> ${promoDetails.bonus}</p>
         <p><strong>Code:</strong> <span style="background: #f3f3f3; padding: 3px 8px; font-family: monospace;">${promoDetails.code}</span></p>
         <p><strong>Valid until:</strong> ${formattedDate}</p>
         <p><a href="${promoDetails.link}" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #e50914; color: white; text-decoration: none; border-radius: 4px;">Claim Now</a></p>
       </div>
       <p>Best regards,<br>The Betting SRL Team</p>`;
  
  return sendEmail({
    to: email,
    from: 'promotions@bettingsrl.com', // This should be verified in SendGrid
    subject,
    text,
    html
  });
}

// Send a password reset email
export async function sendPasswordResetEmail(email: string, resetToken: string, language: string = 'en'): Promise<boolean> {
  const isItalian = language === 'it';
  const resetLink = `https://bettingsrl.com/reset-password?token=${resetToken}`;
  
  const subject = isItalian 
    ? 'Ripristino Password - Betting SRL' 
    : 'Password Reset - Betting SRL';
  
  const text = isItalian
    ? `Hai richiesto il ripristino della tua password. Clicca sul link seguente per impostare una nuova password:\n\n${resetLink}\n\nSe non hai richiesto questo ripristino, puoi ignorare questa email.\n\nCordiali saluti,\nIl team di Betting SRL`
    : `You requested a password reset. Click the following link to set a new password:\n\n${resetLink}\n\nIf you didn't request this reset, you can ignore this email.\n\nBest regards,\nThe Betting SRL Team`;
  
  const html = isItalian
    ? `<h1>Ripristino Password</h1>
       <p>Hai richiesto il ripristino della tua password. Clicca sul link seguente per impostare una nuova password:</p>
       <p><a href="${resetLink}" style="display: inline-block; margin: 15px 0; padding: 10px 20px; background-color: #e50914; color: white; text-decoration: none; border-radius: 4px;">Ripristina Password</a></p>
       <p>Se non hai richiesto questo ripristino, puoi ignorare questa email.</p>
       <p>Cordiali saluti,<br>Il team di Betting SRL</p>`
    : `<h1>Password Reset</h1>
       <p>You requested a password reset. Click the following link to set a new password:</p>
       <p><a href="${resetLink}" style="display: inline-block; margin: 15px 0; padding: 10px 20px; background-color: #e50914; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
       <p>If you didn't request this reset, you can ignore this email.</p>
       <p>Best regards,<br>The Betting SRL Team</p>`;
  
  return sendEmail({
    to: email,
    from: 'security@bettingsrl.com', // This should be verified in SendGrid
    subject,
    text,
    html
  });
}

// Send admin invitation email
export async function sendAdminInvitationEmail(email: string, username: string, password: string, language: string = 'en'): Promise<boolean> {
  const isItalian = language === 'it';
  const loginLink = 'https://bettingsrl.com/auth';
  
  const subject = isItalian 
    ? 'Invito ad Amministratore - Betting SRL' 
    : 'Administrator Invitation - Betting SRL';
  
  const text = isItalian
    ? `Sei stato invitato come amministratore di Betting SRL. Ecco i tuoi dati di accesso:\n\nUsername: ${username}\nPassword: ${password}\n\nPer accedere, visita: ${loginLink}\n\nTi consigliamo di cambiare la password dopo il primo accesso.\n\nCordiali saluti,\nIl team di Betting SRL`
    : `You have been invited as an administrator for Betting SRL. Here are your login credentials:\n\nUsername: ${username}\nPassword: ${password}\n\nTo log in, visit: ${loginLink}\n\nWe recommend changing your password after your first login.\n\nBest regards,\nThe Betting SRL Team`;
  
  const html = isItalian
    ? `<h1>Invito ad Amministratore</h1>
       <p>Sei stato invitato come amministratore di Betting SRL. Ecco i tuoi dati di accesso:</p>
       <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
         <p><strong>Username:</strong> ${username}</p>
         <p><strong>Password:</strong> ${password}</p>
       </div>
       <p><a href="${loginLink}" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #e50914; color: white; text-decoration: none; border-radius: 4px;">Accedi ora</a></p>
       <p>Ti consigliamo di cambiare la password dopo il primo accesso.</p>
       <p>Cordiali saluti,<br>Il team di Betting SRL</p>`
    : `<h1>Administrator Invitation</h1>
       <p>You have been invited as an administrator for Betting SRL. Here are your login credentials:</p>
       <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
         <p><strong>Username:</strong> ${username}</p>
         <p><strong>Password:</strong> ${password}</p>
       </div>
       <p><a href="${loginLink}" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #e50914; color: white; text-decoration: none; border-radius: 4px;">Login Now</a></p>
       <p>We recommend changing your password after your first login.</p>
       <p>Best regards,<br>The Betting SRL Team</p>`;
  
  return sendEmail({
    to: email,
    from: 'admin@bettingsrl.com', // This should be verified in SendGrid
    subject,
    text,
    html
  });
}

// Initialize the service on module import
initializeEmailService();