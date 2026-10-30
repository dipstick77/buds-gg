import { LoginForm } from "@/components/login/LoginForm";
import { discordConfigured, getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ discord?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/edit");
  const params = await searchParams;
  return (
    <LoginForm
      discordReady={discordConfigured()}
      discordQuery={params.discord ?? null}
    />
  );
}
