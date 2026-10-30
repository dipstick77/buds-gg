import { LandingPage } from "@/components/landing/LandingPage";
import { listExampleHandles } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const examples = listExampleHandles();
  return <LandingPage examples={examples} />;
}
