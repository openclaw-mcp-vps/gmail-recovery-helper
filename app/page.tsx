import Link from "next/link";
import { cookies } from "next/headers";
import {
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon
} from "@heroicons/react/24/outline";

import { AccessActivationCard } from "@/components/AccessActivationCard";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCESS_COOKIE_NAME, verifyAccessToken } from "@/lib/access";

export default async function Home({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const cookieStore = await cookies();
  const hasAccess = verifyAccessToken(cookieStore.get(ACCESS_COOKIE_NAME)?.value);
  const sessionId = typeof resolvedSearchParams.session_id === "string" ? resolvedSearchParams.session_id : null;
  const showPaywallMessage = resolvedSearchParams.paywall === "1";

  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "";

  return (
    <main className="mx-auto max-w-6xl space-y-16 px-4 py-10 md:px-6 md:py-14">
      <section className="relative overflow-hidden rounded-2xl border border-[#30363d] bg-gradient-to-br from-[#111927] via-[#0d1117] to-[#121826] p-6 md:p-10">
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#3fb950]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-52 w-52 rounded-full bg-[#2563eb]/20 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full border border-[#3fb950]/40 bg-[#122017] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#6ee787]">
              Security Recovery Tool
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl leading-tight text-[#f0f6fc] md:text-5xl">
              Recover locked Gmail accounts with device verification
            </h1>
            <p className="max-w-2xl text-base text-[#c9d1d9] md:text-lg">
              Gmail Recovery Helper gives you a precise recovery path based on your real account signals: trusted device,
              backup channels, Workspace admin options, and escalation timing. Stop guessing and avoid lockout loops that make
              recovery harder.
            </p>

            <div className="flex flex-wrap gap-3">
              {hasAccess ? (
                <Button asChild size="lg">
                  <Link href="/recovery">Open Recovery Tool</Link>
                </Button>
              ) : (
                <Button asChild size="lg">
                  <a href={paymentLink} target="_blank" rel="noreferrer">
                    Unlock for $19/mo
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" size="lg">
                <Link href="/recovery">Preview Recovery Wizard</Link>
              </Button>
            </div>

            {showPaywallMessage && (
              <p className="rounded-md border border-[#f85149]/40 bg-[#2a1515] px-4 py-3 text-sm text-[#ffb4af]">
                Purchase required. Complete checkout, then return with your Stripe session to activate access on this device.
              </p>
            )}
          </div>

          <Card className="border-[#3fb950]/30 bg-[#101b14]/90">
            <CardHeader>
              <CardTitle>What You Get Immediately</CardTitle>
              <CardDescription>Actionable recovery sequence built for your exact lockout context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[#d1d5db]">
              <p>• Ranked methods with expected success windows and failure-safe waiting rules.</p>
              <p>• Prewritten support escalation template based on your account evidence.</p>
              <p>• Dedicated Workspace path for business email owners and admin teams.</p>
              <p>• Checklist to secure the account after you regain access.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {sessionId && !hasAccess && <AccessActivationCard sessionId={sessionId} />}

      <section id="problem" className="space-y-6">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl">Why Lockouts Become Permanent</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-[#161b22]/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-[#f59e0b]" />
                Recovery Loops
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#c9d1d9]">
              People retry random options too quickly. Google interprets inconsistent attempts as risk and delays recovery even
              more.
            </CardContent>
          </Card>
          <Card className="bg-[#161b22]/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldExclamationIcon className="h-5 w-5 text-[#f85149]" />
                Lost Verification Paths
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#c9d1d9]">
              Outdated recovery phone/email means the default path fails. Most users do not know the right fallback order.
            </CardContent>
          </Card>
          <Card className="bg-[#161b22]/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ArrowTrendingUpIcon className="h-5 w-5 text-[#60a5fa]" />
                Business Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#c9d1d9]">
              Lost Gmail access often means lost invoices, logins, and client communication. Every day locked out increases
              risk.
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="solution" className="space-y-6">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl">How Gmail Recovery Helper Solves It</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="bg-[#161b22]/80">
            <CardHeader>
              <CardTitle className="text-lg">1. Profile the Lockout</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#c9d1d9]">
              The wizard captures trusted-device status, backup channels, Workspace ownership, timeline, and password memory.
            </CardContent>
          </Card>
          <Card className="bg-[#161b22]/80">
            <CardHeader>
              <CardTitle className="text-lg">2. Get Ranked Recovery Paths</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#c9d1d9]">
              You get a confidence-ranked sequence with exact instructions, wait windows, and requirements for each method.
            </CardContent>
          </Card>
          <Card className="bg-[#161b22]/80">
            <CardHeader>
              <CardTitle className="text-lg">3. Escalate Cleanly</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#c9d1d9]">
              If automation fails, generate a support-ready appeal template that avoids contradictory details and speeds review.
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="pricing" className="space-y-6">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl">Simple Pricing</h2>
        <Card className="border-[#3fb950]/40 bg-[#122017]">
          <CardHeader>
            <CardTitle className="text-2xl">$19/month</CardTitle>
            <CardDescription>
              Full access to the guided recovery tool, support templates, and updates to new Google challenge flows.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[#d1d5db]">
            <p className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-[#3fb950]" />
              Unlimited recovery plans for your own accounts.
            </p>
            <p className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-[#3fb950]" />
              Workspace admin route and escalation checklist included.
            </p>
            <p className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-[#3fb950]" />
              Cookie-based access after Stripe checkout on your device.
            </p>
            <div className="pt-2">
              <Button asChild size="lg">
                <a href={paymentLink} target="_blank" rel="noreferrer">
                  Buy Now on Stripe
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="faq" className="space-y-6">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl">FAQ</h2>
        <FaqAccordion />
      </section>
    </main>
  );
}
