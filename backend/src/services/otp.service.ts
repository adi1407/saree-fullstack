import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { Otp } from "../models/Otp";

/**
 * Message Central (CPaaS) OTP service.
 *
 * Runs in MOCK mode until Message Central credentials are provided, so the full
 * phone-OTP login flow works end-to-end during development. In mock mode the
 * code is generated locally, logged to the server console, and (outside
 * production) returned to the client as `devCode` for convenience.
 *
 * Codes are persisted (hashed) in MongoDB with a TTL index, so the flow
 * survives server restarts and works across multiple instances — no in-memory
 * state. To go live later, set MESSAGE_CENTRAL_AUTH_TOKEN +
 * MESSAGE_CENTRAL_CUSTOMER_ID and fill in the two fetch calls marked "LIVE".
 */
export const MSG_CENTRAL_MOCK =
  !env.MESSAGE_CENTRAL_AUTH_TOKEN || !env.MESSAGE_CENTRAL_CUSTOMER_ID;

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 30 * 1000;

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Seconds the caller must wait before another OTP can be sent (0 = allowed). */
export async function resendWaitSeconds(phone: string): Promise<number> {
  const record = await Otp.findOne({ phone }).lean();
  if (!record) return 0;
  const remaining = RESEND_COOLDOWN_MS - (Date.now() - new Date(record.lastSentAt).getTime());
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

export interface SendOtpResult {
  verificationId: string;
  mock: boolean;
  /** Only populated in mock, non-production mode to ease local testing. */
  devCode?: string;
}

export async function sendOtp(phone: string): Promise<SendOtpResult> {
  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  const verificationId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  // One active OTP per phone; resending replaces the previous one.
  await Otp.findOneAndUpdate(
    { phone },
    {
      phone,
      codeHash,
      verificationId,
      attempts: 0,
      lastSentAt: new Date(),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
    { upsert: true, new: true }
  );

  if (MSG_CENTRAL_MOCK) {
    console.log(`[MessageCentral MOCK] OTP for +${phone}: ${code}`);
    return {
      verificationId,
      mock: true,
      devCode: env.NODE_ENV === "production" ? undefined : code,
    };
  }

  // LIVE (add later):
  // const res = await fetch(
  //   `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&flowType=SMS&mobileNumber=${phone}`,
  //   { method: "POST", headers: { authToken: env.MESSAGE_CENTRAL_AUTH_TOKEN! } }
  // );
  // const data = await res.json();
  // await Otp.updateOne({ phone }, { verificationId: data.data.verificationId });
  // return { verificationId: data.data.verificationId, mock: false };
  throw new Error("Message Central live mode is not configured yet");
}

export interface VerifyOtpResult {
  ok: boolean;
  reason?: string;
}

export async function verifyOtp(phone: string, code: string): Promise<VerifyOtpResult> {
  const record = await Otp.findOne({ phone });
  if (!record) return { ok: false, reason: "No OTP was requested for this number" };

  if (Date.now() > new Date(record.expiresAt).getTime()) {
    await record.deleteOne();
    return { ok: false, reason: "OTP has expired. Please request a new one" };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await record.deleteOne();
    return { ok: false, reason: "Too many incorrect attempts. Please request a new OTP" };
  }

  // Count this attempt before comparing so brute force is bounded.
  record.attempts += 1;
  await record.save();

  if (MSG_CENTRAL_MOCK) {
    const valid = await bcrypt.compare(code, record.codeHash);
    if (!valid) return { ok: false, reason: "Incorrect OTP" };
    await record.deleteOne();
    return { ok: true };
  }

  // LIVE (add later):
  // const res = await fetch(
  //   `https://cpaas.messagecentral.com/verification/v3/validateOtp?verificationId=${record.verificationId}&code=${code}`,
  //   { method: "GET", headers: { authToken: env.MESSAGE_CENTRAL_AUTH_TOKEN! } }
  // );
  // const data = await res.json();
  // if (data?.data?.verificationStatus !== "VERIFICATION_COMPLETED") {
  //   return { ok: false, reason: "Incorrect OTP" };
  // }
  // await record.deleteOne();
  // return { ok: true };
  throw new Error("Message Central live mode is not configured yet");
}
