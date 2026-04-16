# Build Task: gmail-recovery-helper

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: gmail-recovery-helper
HEADLINE: Recover locked Gmail accounts with device verification
WHAT: None
WHY: None
WHO PAYS: None
NICHE: security-tools
PRICE: $$19/mo

ARCHITECTURE SPEC:
A Next.js web app that guides users through Gmail account recovery using device verification methods. The tool provides step-by-step instructions, automated form filling assistance, and tracks recovery progress through a dashboard.

PLANNED FILES:
- app/page.tsx
- app/dashboard/page.tsx
- app/recovery/page.tsx
- app/api/auth/route.ts
- app/api/webhooks/lemonsqueezy/route.ts
- components/RecoveryWizard.tsx
- components/DeviceVerificationGuide.tsx
- components/ProgressTracker.tsx
- lib/gmail-recovery-steps.ts
- lib/lemonsqueezy.ts
- lib/auth.ts

DEPENDENCIES: next, tailwindcss, @lemonsqueezy/lemonsqueezy.js, next-auth, prisma, @prisma/client, zod, lucide-react, framer-motion

REQUIREMENTS:
- Next.js 15 with App Router (app/ directory)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components (npx shadcn@latest init, then add needed components)
- Dark theme ONLY — background #0d1117, no light mode
- Lemon Squeezy checkout overlay for payments
- Landing page that converts: hero, problem, solution, pricing, FAQ
- The actual tool/feature behind a paywall (cookie-based access after purchase)
- Mobile responsive
- SEO meta tags, Open Graph tags
- /api/health endpoint that returns {"status":"ok"}

ENVIRONMENT VARIABLES (create .env.example):
- NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET

After creating all files:
1. Run: npm install
2. Run: npm run build
3. Fix any build errors
4. Verify the build succeeds with exit code 0

Do NOT use placeholder text. Write real, helpful content for the landing page
and the tool itself. The tool should actually work and provide value.


PREVIOUS ATTEMPT FAILED WITH:
Codex exited 1: Reading additional input from stdin...
OpenAI Codex v0.121.0 (research preview)
--------
workdir: /tmp/openclaw-builds/gmail-recovery-helper
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: none
reasoning summaries: none
session id: 019d94de-438b-7a93-adc3-70097f325e13
--------
user
# Build Task: gmail-recovery-helper

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: gmail-recovery-helper
HEADLINE: Recover locked G
Please fix the above errors and regenerate.