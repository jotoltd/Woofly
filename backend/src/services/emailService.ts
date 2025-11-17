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
  finderName?: string;
  finderPhone?: string;
  finderEmail?: string;
}

export const sendLocationEmail = async (params: LocationEmailParams): Promise<boolean> => {
  try {
    if (!resend) {
      console.warn('Resend client not configured. Skipping email send.');
      return false;
    }

    const { to, petName, ownerName, latitude, longitude, scanId, finderName, finderPhone, finderEmail } = params;

    if (!to.length) {
      console.warn('No recipients for location email, skipping.');
      return false;
    }

    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const subject = `Wooftrace Alert: ${petName} was just scanned`;
    const lines: string[] = [
      `Hi ${ownerName || 'there'},`,
      '',
      `Someone has just scanned ${petName}'s tag and shared their location.`,
      '',
      `Approximate location: ${mapsUrl}`,
      '',
    ];

    if (finderName || finderPhone || finderEmail) {
      lines.push('Finder contact details:', '');
      if (finderName) {
        lines.push(`• Name: ${finderName}`);
      }
      if (finderPhone) {
        lines.push(`• Phone: ${finderPhone}`);
      }
      if (finderEmail) {
        lines.push(`• Email: ${finderEmail}`);
      }
      lines.push('');
    } else {
      lines.push('No contact details were provided by the person who scanned the tag.', '');
    }

    lines.push(
      `Scan ID: ${scanId}`,
      '',
      '— Wooftrace',
    );

    const text = lines.join('\n');

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

interface PetAddedEmailParams {
  to: string;
  name: string;
  petName: string;
  petSpecies: string;
  tagCode: string;
}

export const sendPetAddedEmail = async (params: PetAddedEmailParams): Promise<boolean> => {
  try {
    if (!resend) {
      console.warn('Resend client not configured. Skipping pet added email.');
      return false;
    }

    const { to, name, petName, petSpecies, tagCode } = params;

    const subject = `🐾 Meet ${petName}!`;
    const text = [
      `Hi ${name},`,
      '',
      `✨ Congratulations! ${petName} is now protected by Wooftrace.`,
      '',
      `📋 Pet Details:`,
      `• Name: ${petName}`,
      `• Species: ${petSpecies}`,
      `• Tag Code: ${tagCode}`,
      '',
      `🎯 Next Steps:`,
      `1. Add emergency contacts`,
      `2. Upload a photo of ${petName}`,
      `3. Add medical information (allergies, medications)`,
      `4. Download your QR code for the tag`,
      '',
      `🔗 Complete Profile: ${frontendUrl}/dashboard`,
      '',
      `💡 Your pet is now protected! Anyone who scans the tag can contact you instantly.`,
      '',
      `— The Wooftrace Team`,
    ].join('\n');

    await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error('Error sending pet added email:', error);
    return false;
  }
};

interface LostModeEmailParams {
  to: string;
  name: string;
  petName: string;
  isLost: boolean;
}

export const sendLostModeEmail = async (params: LostModeEmailParams): Promise<boolean> => {
  try {
    if (!resend) {
      console.warn('Resend client not configured. Skipping lost mode email.');
      return false;
    }

    const { to, name, petName, isLost } = params;

    const subject = isLost 
      ? `🚨 Lost Mode Activated for ${petName}`
      : `✅ Lost Mode Deactivated for ${petName}`;
    
    const text = isLost ? [
      `Hi ${name},`,
      '',
      `🚨 Lost mode has been activated for ${petName}.`,
      '',
      `📍 What this means:`,
      `• Anyone who scans ${petName}'s tag will see a "LOST PET" alert`,
      `• Your contact information is prominently displayed`,
      `• You'll receive instant email alerts when the tag is scanned`,
      '',
      `💡 Tips for Finding Your Pet:`,
      `• Post on local community groups and social media`,
      `• Contact local animal shelters and veterinary clinics`,
      `• Put up flyers in your neighborhood`,
      `• Check your email for scan notifications`,
      '',
      `🙏 We hope ${petName} is home safe soon!`,
      '',
      `— The Wooftrace Team`,
    ].join('\n') : [
      `Hi ${name},`,
      '',
      `✅ Great news! Lost mode has been deactivated for ${petName}.`,
      '',
      `We're so glad ${petName} is safe! The tag will now display the normal profile information.`,
      '',
      `— The Wooftrace Team`,
    ].join('\n');

    await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error('Error sending lost mode email:', error);
    return false;
  }
};

interface MultipleScansEmailParams {
  to: string;
  name: string;
  petName: string;
  scanCount: number;
  locations: string[];
}

export const sendMultipleScansEmail = async (params: MultipleScansEmailParams): Promise<boolean> => {
  try {
    if (!resend) {
      console.warn('Resend client not configured. Skipping multiple scans email.');
      return false;
    }

    const { to, name, petName, scanCount, locations } = params;

    const subject = `📍 ${petName} has been scanned ${scanCount} times today`;
    const text = [
      `Hi ${name},`,
      '',
      `📍 ${petName}'s tag has been scanned ${scanCount} times today.`,
      '',
      `Recent Scan Locations:`,
      ...locations.map(loc => `• ${loc}`),
      '',
      `❓ Is ${petName} safe?`,
      `• If ${petName} is with you, everything is fine`,
      `• If ${petName} is missing, consider activating lost mode`,
      '',
      `🔗 View All Scans: ${frontendUrl}/dashboard`,
      '',
      `— The Wooftrace Team`,
    ].join('\n');

    await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error('Error sending multiple scans email:', error);
    return false;
  }
};

interface WeeklySummaryEmailParams {
  to: string;
  name: string;
  totalScans: number;
  petSummaries: Array<{
    petName: string;
    scans: number;
  }>;
}

export const sendWeeklySummaryEmail = async (params: WeeklySummaryEmailParams): Promise<boolean> => {
  try {
    if (!resend) {
      console.warn('Resend client not configured. Skipping weekly summary email.');
      return false;
    }

    const { to, name, totalScans, petSummaries } = params;

    const subject = `📊 Your Weekly Wooftrace Summary`;
    const text = [
      `Hi ${name},`,
      '',
      `📊 Here's your pet's activity from the past week:`,
      '',
      `Total Tag Scans: ${totalScans}`,
      '',
      `Per Pet:`,
      ...petSummaries.map(p => `• ${p.petName}: ${p.scans} scans`),
      '',
      `💡 Keep your pet's profile updated with current contact information for maximum safety.`,
      '',
      `🔗 View Dashboard: ${frontendUrl}/dashboard`,
      '',
      `— The Wooftrace Team`,
    ].join('\n');

    await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error('Error sending weekly summary email:', error);
    return false;
  }
};

interface SecurityAlertEmailParams {
  to: string;
  name: string;
  alertType: 'login' | 'password_change' | 'email_change';
  details: string;
}

export const sendSecurityAlertEmail = async (params: SecurityAlertEmailParams): Promise<boolean> => {
  try {
    if (!resend) {
      console.warn('Resend client not configured. Skipping security alert email.');
      return false;
    }

    const { to, name, alertType, details } = params;

    const subjects = {
      login: '🔐 New Login to Your Wooftrace Account',
      password_change: '🔒 Your Password Was Changed',
      email_change: '📧 Your Email Was Changed',
    };

    const subject = subjects[alertType];
    const text = [
      `Hi ${name},`,
      '',
      details,
      '',
      `If this was you, you can safely ignore this email.`,
      '',
      `If you didn't make this change, please secure your account immediately:`,
      `1. Reset your password: ${frontendUrl}/forgot-password`,
      `2. Contact support if you need help`,
      '',
      `— The Wooftrace Team`,
    ].join('\n');

    await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error('Error sending security alert email:', error);
    return false;
  }
};

interface TagTransferEmailParams {
  to: string;
  name: string;
  petName: string;
  tagCode: string;
  fromUser?: string;
  toUser?: string;
}

export const sendTagTransferEmail = async (params: TagTransferEmailParams): Promise<boolean> => {
  try {
    if (!resend) {
      console.warn('Resend client not configured. Skipping tag transfer email.');
      return false;
    }

    const { to, name, petName, tagCode, fromUser, toUser } = params;

    const subject = `🔄 Tag Ownership Transferred for ${petName}`;
    const text = [
      `Hi ${name},`,
      '',
      `🔄 The ownership of tag ${tagCode} has been transferred.`,
      '',
      `📋 Transfer Details:`,
      `• Pet: ${petName}`,
      `• Tag Code: ${tagCode}`,
      fromUser ? `• From: ${fromUser}` : '',
      toUser ? `• To: ${toUser}` : '',
      '',
      `This transfer was completed by an administrator. If you have questions, please contact support.`,
      '',
      `— The Wooftrace Team`,
    ].join('\n').split('\n').filter(line => line !== '').join('\n');

    await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error('Error sending tag transfer email:', error);
    return false;
  }
};

interface InactiveAccountEmailParams {
  to: string;
  name: string;
  daysSinceLogin: number;
}

export const sendInactiveAccountEmail = async (params: InactiveAccountEmailParams): Promise<boolean> => {
  try {
    if (!resend) {
      console.warn('Resend client not configured. Skipping inactive account email.');
      return false;
    }

    const { to, name, daysSinceLogin } = params;

    const subject = `👋 We miss you at Wooftrace!`;
    const text = [
      `Hi ${name},`,
      '',
      `👋 It's been ${daysSinceLogin} days since you last logged in to Wooftrace.`,
      '',
      `Your pet's tag is still active and protecting them! Here's a quick reminder:`,
      '',
      `✨ What's New:`,
      `• Enhanced location tracking`,
      `• Improved lost mode features`,
      `• Better scan notifications`,
      '',
      `💡 Quick Actions:`,
      `• Update your contact information`,
      `• Check recent tag scans`,
      `• Review your pet's profile`,
      '',
      `🔗 Login Now: ${frontendUrl}/login`,
      '',
      `— The Wooftrace Team`,
    ].join('\n');

    await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error('Error sending inactive account email:', error);
    return false;
  }
};
