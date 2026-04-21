import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCESS_COOKIE_NAME, verifyAccessToken } from "@/lib/access";
import { getRecoveryMethodById } from "@/lib/recovery-logic";

export default async function RecoveryStepPage({
  params
}: {
  params: Promise<{ step: string }>;
}) {
  const cookieStore = await cookies();
  const hasAccess = verifyAccessToken(cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  if (!hasAccess) {
    redirect("/?paywall=1");
  }

  const { step } = await params;
  const method = getRecoveryMethodById(step);

  if (!method) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-2">
        <p className="text-sm text-[#9ca3af]">Recovery path</p>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl">{method.title}</h1>
        <p className="text-[#c9d1d9]">{method.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why This Path Works</CardTitle>
          <CardDescription>{method.rationale}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h2 className="font-medium">Requirements</h2>
            <ul className="space-y-1 text-sm text-[#c9d1d9]">
              {method.requirements.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium">Step-by-Step Actions</h2>
            <ol className="space-y-2 text-sm text-[#c9d1d9]">
              {method.steps.map((item, index) => (
                <li key={item}>
                  {index + 1}. {item}
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-2 rounded-md border border-[#30363d] bg-[#111827]/60 p-4">
            <h2 className="font-medium">Support Message Template</h2>
            <p className="text-sm text-[#c9d1d9]">
              {method.supportTemplate.replaceAll("{{gmailAddress}}", "[your Gmail address]")}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href="https://accounts.google.com/signin/recovery" target="_blank" rel="noreferrer">
            Open Google Recovery
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/recovery">Back to Wizard</Link>
        </Button>
      </div>
    </main>
  );
}
