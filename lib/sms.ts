export interface SendSmsParams {
  phone: string;
  message: string;
}

export async function sendSms({ phone, message }: SendSmsParams): Promise<boolean> {
  const provider = process.env.SMS_PROVIDER || 'console';

  if (provider === 'twilio') {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_FROM_PHONE;

    if (!accountSid || !authToken || !fromPhone) {
      console.warn('[SMS Service] Twilio credentials missing. Falling back to console logger.');
      console.log(`[SMS Console Fallback] To: ${phone} | Message: ${message}`);
      return true;
    }

    try {
      const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', phone);
      params.append('From', fromPhone);
      params.append('Body', message);

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        }
      );

      return response.ok;
    } catch (err) {
      console.error('[SMS Service] Twilio send error:', err);
      return false;
    }
  }

  // Default / Console Logger mode for development & test environments
  if (process.env.NODE_ENV !== 'production' || provider === 'console') {
    console.log(`[SMS Logger] To: ${phone} | Message: ${message}`);
  }

  return true;
}
