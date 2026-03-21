import { prisma } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validations";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

const RESET_HOURS = 1;

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({
      ok: true,
      message: "If an account exists for that email, you can reset your password with the link below.",
    });
  }

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + RESET_HOURS * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetExpires: expires,
    },
  });

  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
  const resetUrl = `${baseUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`;

  const payload: {
    ok: boolean;
    message: string;
    resetUrl?: string;
  } = {
    ok: true,
    message: "Password reset link created. Use it within one hour.",
  };

  if (process.env.NODE_ENV !== "production") {
    payload.resetUrl = resetUrl;
  }

  return NextResponse.json(payload);
}
