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

interface WelcomeEmailParams {
  to: string;
  name: string;
}

export const sendWelcomeEmail = async (params: WelcomeEmailParams): Promise<boolean> => {
  try {
    if (!resend) {
      console.warn('Resend client not configured. Skipping welcome email.');
      return false;
    }

    const { to, name } = params;

    const subject = 'Welcome to Wooftrace! 🐾';
    const text = [
      `Hi ${name},`,
      '',
      'Welcome to Wooftrace! Your account is now verified and ready to use.',
      '',
      '🏷️ Quick Start Guide:',
      '1. Activate your pet tag using your unique activation code',
      '2. Add your pet\'s profile and photo',
      '3. Download or print your pet\'s QR code',
      '4. Attach the tag to your pet\'s collar',
      '',
      '🔗 Get Started: ' + frontendUrl + '/dashboard',
      '',
      '💡 Pro Tips:',
      '• Keep your pet\'s profile updated with current contact info',
      '• Enable lost mode if your pet goes missing',
      '• You\'ll receive instant email alerts when someone scans your pet\'s tag',
      '',
      'Need help? Reply to this email and we\'ll be happy to assist!',
      '',
      '— The Wooftrace Team',
    ].join('\n');

    await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

interface PasswordResetEmailParams {
  to: string;
  name: string;
  token: string;
}

export const sendPasswordResetEmail = async (params: PasswordResetEmailParams): Promise<boolean> => {
  try {
    if (!resend) {
      console.warn('Resend client not configured. Skipping password reset email.');
      return false;
    }

    const { to, name, token } = params;
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const subject = 'Reset your Wooftrace password';
    const text = [
      `Hi ${name},`,
      '',
      'We received a request to reset your Wooftrace password.',
      '',
      `Reset your password: ${resetUrl}`,
      '',
      'This link will expire in 1 hour.',
      '',
      "If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.",
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
    console.error('Error sending password reset email:', error);
    return false;
  }
};

interface TagActivationEmailParams {
  to: string;
  name: string;
  tagCode: string;
  activationCode: string;
}

export const sendTagActivationEmail = async (params: TagActivationEmailParams): Promise<boolean> => {
  try {
    if (!resend) {
      console.warn('Resend client not configured. Skipping tag activation email.');
      return false;
    }

    const { to, name, tagCode, activationCode } = params;

    const subject = '✓ Tag Activated Successfully!';
    const text = [
      `Hi ${name},`,
      '',
      '🎉 Great news! Your Wooftrace tag has been activated successfully.',
      '',
      '📋 Tag Details:',
      `• Tag Code: ${tagCode}`,
      `• Activation Code: ${activationCode}`,
      '',
      '🐾 Next Steps:',
      '1. Add your pet\'s profile (name, photo, medical info)',
      '2. Add emergency contacts',
      '3. Download your pet\'s QR code',
      '4. Attach the tag to your pet\'s collar',
      '',
      '🔗 Complete Setup: ' + frontendUrl + '/dashboard',
      '',
      '💡 Your pet is now protected! Anyone who finds your pet can scan the tag to contact you instantly.',
      '',
      '— The Wooftrace Team',
    ].join('\n');

    await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error('Error sending tag activation email:', error);
    return false;
  }
};
