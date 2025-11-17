import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.EMAIL_FROM || 'Wooftrace Alerts <no-reply@wooftrace.com>';
const frontendUrl = process.env.FRONTEND_URL || 'https://woofly.vercel.app';

if (!resendApiKey) {
  console.warn('RESEND_API_KEY is not set. Email notifications will be disabled.');
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface LocationEmailParams {
  to: string[];
  petName: string;
  ownerName: string;
  latitude: number;
  longitude: number;
  scanId: string;
}

export const sendLocationEmail = async (params: LocationEmailParams): Promise<boolean> => {
  try {
    if (!resend) {
      console.warn('Resend client not configured. Skipping email send.');
      return false;
    }

    const { to, petName, ownerName, latitude, longitude, scanId } = params;

    if (!to.length) {
      console.warn('No recipients for location email, skipping.');
      return false;
    }

    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const subject = `Wooftrace Alert: ${petName} was just scanned`;
    const text = [
      `Hi ${ownerName || 'there'},`,
      '',
      `Someone has just scanned ${petName}'s tag and shared their location.`,
      '',
      `Approximate location: ${mapsUrl}`,
      '',
      'If you are nearby, you may want to contact them using the details shown on the public pet page.',
      '',
      `Scan ID: ${scanId}`,
      '',
      '— Wooftrace',
    ].join('\n');

    await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error('Error sending location email:', error);
    return false;
  }
};

interface VerificationEmailParams {
  to: string;
  name: string;
  token: string;
}

export const sendVerificationEmail = async (params: VerificationEmailParams): Promise<boolean> => {
  try {
    if (!resend) {
      console.warn('Resend client not configured. Skipping verification email.');
      return false;
    }

    const { to, name, token } = params;
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

    const subject = 'Verify your Wooftrace account';
    const text = [
      `Hi ${name},`,
      '',
      'Welcome to Wooftrace! Please verify your email address to complete your registration.',
      '',
      `Verification link: ${verifyUrl}`,
      '',
      'This link will expire in 24 hours.',
      '',
      "If you didn't create a Wooftrace account, you can safely ignore this email.",
      '',
      '— Wooftrace',
    ].join('\n');

    await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};
