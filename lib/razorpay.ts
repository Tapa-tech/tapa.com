import Razorpay from "razorpay";
import crypto from "crypto";

export function getRazorpayInstance(): Razorpay {
  const rawKeyId = process.env.RAZORPAY_KEY_ID || "";
  const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || "";

  const keyId = rawKeyId.replace(/^["']|["']$/g, '').trim();
  const keySecret = rawKeySecret.replace(/^["']|["']$/g, '').trim();

  if (!keyId || !keySecret) {
    throw new Error("Razorpay server credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are missing");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export const razorpay = new Proxy({} as Razorpay, {
  get(_target, prop, receiver) {
    const instance = getRazorpayInstance();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

export function verifyRazorpaySignature({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): boolean {
  const rawSecret = process.env.RAZORPAY_KEY_SECRET || "";
  const secret = rawSecret.replace(/^["']|["']$/g, '').trim();
  if (!secret) return false;

  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(razorpay_signature, "utf-8")
    );
  } catch {
    return false;
  }
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret?: string
): boolean {
  const rawSecret = secret || process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || "";
  const webhookSecret = rawSecret.replace(/^["']|["']$/g, '').trim();
  if (!webhookSecret || !signature || !rawBody) return false;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch {
    return false;
  }
}