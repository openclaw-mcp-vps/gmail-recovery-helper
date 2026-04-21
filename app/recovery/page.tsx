import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { RecoveryWizard } from "@/components/RecoveryWizard";
import { Button } from "@/components/ui/button";
import { ACCESS_COOKIE_NAME, verifyAccessToken } from "@/lib/access";

export default async function RecoveryPage() {
  const cookieStore = await cookies();
  const hasAccess = verifyAccessToken(cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  if (!hasAccess) {
    redirect("/?paywall=1");
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl">Recovery Tool</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <p className="text-sm text-[#9ca3af]">
        Complete the wizard below. The plan is optimized for minimizing failed attempts and maximizing successful identity
        verification.
      </p>
      <RecoveryWizard />
    </main>
  );
}
