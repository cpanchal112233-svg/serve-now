import { auth } from "@/lib/auth";
import { PasswordChangeForm } from "@/components/account/PasswordChangeForm";
import { ProfileForm } from "@/components/account/ProfileForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
  const session = await auth();
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true },
  });
  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Profile</h1>
      <p className="mt-1 text-zinc-600">Contact details and password for your customer account.</p>
      <div className="mt-8 space-y-10">
        <ProfileForm
          initialName={user.name}
          initialPhone={user.phone}
          initialEmail={user.email}
        />
        <PasswordChangeForm />
      </div>
    </div>
  );
}
