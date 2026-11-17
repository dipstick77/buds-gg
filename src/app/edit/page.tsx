import { EditForm } from "@/components/edit/EditForm";
import { getCurrentUser } from "@/lib/auth";
import { getEditableProfile } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const payload = getEditableProfile(user.id);
  return <EditForm initial={payload} needsClaim={!payload} />;
}
