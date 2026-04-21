import { z } from "zod";
import type { RecoveryInput, RecoveryMethod, RecoveryMethodId, RecoveryPlan } from "@/types/recovery";

export const recoveryInputSchema = z.object({
  gmailAddress: z.string().email("Enter the Gmail address you are trying to recover."),
  lockedWhen: z.enum(["today", "this-week", "this-month", "longer"]),
  canUseTrustedDevice: z.enum(["yes", "no", "not-sure"]),
  hasRecoveryEmail: z.enum(["yes", "no", "not-sure"]),
  hasRecoveryPhone: z.enum(["yes", "no", "not-sure"]),
  hasBackupCodes: z.enum(["yes", "no", "not-sure"]),
  isWorkspaceAccount: z.enum(["yes", "no", "not-sure"]),
  remembersLastPassword: z.enum(["yes", "no", "not-sure"]),
  isTraveling: z.enum(["yes", "no", "not-sure"]),
  notes: z.string().max(1200).optional()
});

const methodCatalog: Record<RecoveryMethodId, RecoveryMethod> = {
  "cached-session-recovery": {
    id: "cached-session-recovery",
    title: "Recover from a Trusted Device Session",
    description:
      "Use the device and network where you usually sign in so Google can match your normal login behavior.",
    rationale:
      "Google gives the highest trust score to a familiar browser profile, saved cookies, and known IP location.",
    difficulty: "Low",
    successWindow: "Usually works within 5-20 minutes",
    requirements: [
      "A device that signed into this Gmail in the past",
      "Same browser profile (do not clear cookies)",
      "Home or office Wi-Fi used before"
    ],
    steps: [
      "Open a browser where you previously accessed the account and avoid private/incognito mode.",
      "Go to https://accounts.google.com/signin/recovery and enter the Gmail address.",
      "Use the most recent password you remember, even if it no longer works.",
      "If prompted, choose device verification and approve from that same device.",
      "If denied, wait at least 6 hours before trying again to avoid risk throttling."
    ],
    supportTemplate:
      "I am trying to recover {{gmailAddress}} from a previously trusted device. I used the same browser profile and known network, supplied the last known password, and completed every available verification prompt. Please review this account lock and restore access or provide the next verification path."
  },
  "recovery-email-reset": {
    id: "recovery-email-reset",
    title: "Recover via Backup Email",
    description:
      "Send Google's verification code to your recovery email and complete the ownership challenge.",
    rationale:
      "A verified recovery email is one of the strongest direct ownership signals in consumer Gmail recovery.",
    difficulty: "Low",
    successWindow: "Usually 3-10 minutes",
    requirements: [
      "Access to your recovery inbox",
      "Ability to receive and read verification code quickly",
      "Last known password (recommended)"
    ],
    steps: [
      "Start at https://accounts.google.com/signin/recovery and enter {{gmailAddress}}.",
      "Select the recovery email option when Google offers it.",
      "Copy the code exactly and submit it immediately before expiration.",
      "When asked additional questions, provide precise answers and avoid guessing.",
      "After recovery, update recovery email and phone under Google Account security settings."
    ],
    supportTemplate:
      "I have access to the verified recovery email for {{gmailAddress}} and completed the code challenge, but the lock is still active. Please manually review and unlock the account or advise the exact additional proof required."
  },
  "phone-prompt-approval": {
    id: "phone-prompt-approval",
    title: "Recover with Recovery Phone / Google Prompt",
    description:
      "Use your linked phone number or Google prompt on a signed-in phone to prove account ownership.",
    rationale:
      "Phone prompts and SMS codes are high-confidence signals when matched with known devices and recent activity.",
    difficulty: "Medium",
    successWindow: "5-30 minutes depending on prompt availability",
    requirements: [
      "Recovery phone available and on",
      "Signal/service for SMS or data",
      "Phone time set correctly"
    ],
    steps: [
      "Use account recovery and choose phone verification or on-device prompt.",
      "If SMS fails, request a voice call fallback and keep the phone unlocked.",
      "Approve every Google prompt from the same location where you usually sign in.",
      "If prompts are delayed, stay on the challenge page for at least 10 minutes.",
      "Complete password reset and immediately enable 2-step verification backup methods."
    ],
    supportTemplate:
      "I attempted phone-based verification for {{gmailAddress}} using the registered number/device, but prompt delivery or code acceptance failed repeatedly. Please verify phone challenge logs and release the account lock."
  },
  "backup-codes-path": {
    id: "backup-codes-path",
    title: "Use Saved Backup Codes",
    description:
      "Enter one of your previously generated Google backup codes to bypass unavailable verification methods.",
    rationale:
      "Backup codes are explicit ownership credentials intended for lockout scenarios.",
    difficulty: "Low",
    successWindow: "2-8 minutes",
    requirements: [
      "Unused backup code from your original set",
      "Recovery page access",
      "Stable internet connection"
    ],
    steps: [
      "Choose Try another way until backup code is offered.",
      "Enter one unused code exactly once.",
      "If accepted, reset your password immediately and review account security alerts.",
      "Generate a fresh backup code set and store it offline.",
      "Revoke old sessions you do not recognize."
    ],
    supportTemplate:
      "I have valid backup codes for {{gmailAddress}} and used an unused code during recovery. Access remains blocked. Please verify backup-code challenge evaluation and complete unlock."
  },
  "account-appeal-flow": {
    id: "account-appeal-flow",
    title: "Manual Account Appeal",
    description:
      "Submit a structured support appeal with timeline evidence when automated checks keep failing.",
    rationale:
      "A precise timeline and ownership facts reduce back-and-forth and improve manual review outcomes.",
    difficulty: "High",
    successWindow: "24-72 hours",
    requirements: [
      "Recent login timeline",
      "Approximate account creation period",
      "Typical sender/recipient and labels you used"
    ],
    steps: [
      "Document your last successful login date, usual device, and usual location.",
      "List at least three normal mailbox activities (labels, frequent contacts, services tied to Gmail).",
      "Submit the recovery form once with complete details; avoid repeated contradictory attempts.",
      "Wait for review response before retrying automated flows.",
      "If denied, retry after 48 hours using updated evidence only."
    ],
    supportTemplate:
      "I need a manual ownership review for {{gmailAddress}} after repeated automated recovery denial. I can provide account timeline, known historical passwords, regular login device/location, and mailbox usage patterns. Please escalate this lockout for human verification."
  },
  "workspace-admin-escalation": {
    id: "workspace-admin-escalation",
    title: "Google Workspace Admin Recovery",
    description:
      "If this is a business Workspace account, route recovery through domain admin controls before user-level recovery loops.",
    rationale:
      "Workspace admins can reset credentials, review risk events, and restore access faster than consumer recovery.",
    difficulty: "Medium",
    successWindow: "15-60 minutes with admin availability",
    requirements: [
      "Workspace domain admin contact",
      "Company domain ownership",
      "User identity verification policy"
    ],
    steps: [
      "Contact Workspace admin and request account risk-event review.",
      "Admin resets password and enforces fresh sign-in with secure challenge.",
      "Admin verifies suspicious login blocks in Google Admin security center.",
      "User signs in from trusted device and updates recovery factors.",
      "Admin confirms mailbox and delegated services are restored."
    ],
    supportTemplate:
      "This locked account {{gmailAddress}} is part of Google Workspace. Please prioritize admin-mediated recovery path and release user-level lock once admin identity checks are complete."
  }
};

const baseChecklist = [
  "Pause repeated retries after two failed attempts to avoid temporary risk lock extensions.",
  "Use one trusted device and one trusted network for your next attempt.",
  "Keep a written timeline of each attempt and exact challenge result.",
  "After recovery, add at least two backup methods (email + phone + backup codes)."
];

function scoreMethods(input: RecoveryInput): Map<RecoveryMethodId, number> {
  const scores = new Map<RecoveryMethodId, number>([
    ["cached-session-recovery", 0],
    ["recovery-email-reset", 0],
    ["phone-prompt-approval", 0],
    ["backup-codes-path", 0],
    ["account-appeal-flow", 0],
    ["workspace-admin-escalation", 0]
  ]);

  if (input.canUseTrustedDevice === "yes") {
    scores.set("cached-session-recovery", (scores.get("cached-session-recovery") ?? 0) + 5);
  }

  if (input.hasRecoveryEmail === "yes") {
    scores.set("recovery-email-reset", (scores.get("recovery-email-reset") ?? 0) + 5);
  }

  if (input.hasRecoveryPhone === "yes") {
    scores.set("phone-prompt-approval", (scores.get("phone-prompt-approval") ?? 0) + 4);
  }

  if (input.hasBackupCodes === "yes") {
    scores.set("backup-codes-path", (scores.get("backup-codes-path") ?? 0) + 6);
  }

  if (input.isWorkspaceAccount === "yes") {
    scores.set("workspace-admin-escalation", (scores.get("workspace-admin-escalation") ?? 0) + 7);
  }

  if (input.remembersLastPassword === "yes") {
    scores.set("cached-session-recovery", (scores.get("cached-session-recovery") ?? 0) + 2);
    scores.set("account-appeal-flow", (scores.get("account-appeal-flow") ?? 0) + 1);
  }

  if (input.lockedWhen === "today" || input.lockedWhen === "this-week") {
    scores.set("cached-session-recovery", (scores.get("cached-session-recovery") ?? 0) + 2);
    scores.set("phone-prompt-approval", (scores.get("phone-prompt-approval") ?? 0) + 1);
  }

  if (input.isTraveling === "yes") {
    scores.set("account-appeal-flow", (scores.get("account-appeal-flow") ?? 0) + 3);
    scores.set("cached-session-recovery", (scores.get("cached-session-recovery") ?? 0) - 1);
  }

  if (
    input.hasRecoveryEmail !== "yes" &&
    input.hasRecoveryPhone !== "yes" &&
    input.hasBackupCodes !== "yes" &&
    input.canUseTrustedDevice !== "yes"
  ) {
    scores.set("account-appeal-flow", (scores.get("account-appeal-flow") ?? 0) + 6);
  }

  return scores;
}

export function evaluateRecoveryPath(input: RecoveryInput): RecoveryPlan {
  const scores = scoreMethods(input);
  const ranked = Array.from(scores.entries())
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([methodId]) => methodId);

  if (ranked.length === 0) {
    ranked.push("account-appeal-flow");
  }

  const confidenceRaw = (scores.get(ranked[0]) ?? 4) / 8;
  const confidence = Number(Math.min(0.98, Math.max(0.35, confidenceRaw)).toFixed(2));

  const methods = ranked.map((methodId) => {
    const method = methodCatalog[methodId];
    return {
      ...method,
      steps: method.steps.map((step) => step.replaceAll("{{gmailAddress}}", input.gmailAddress))
    };
  });

  const top = methods[0];
  const nextBestAction =
    top.id === "workspace-admin-escalation"
      ? "Contact your Workspace admin first. User-side retries can delay admin unlock actions."
      : `Start with ${top.title} now, then wait at least 6 hours before repeating if it fails.`;

  return {
    confidence,
    recommendedOrder: ranked,
    methods,
    nextBestAction,
    supportChecklist: baseChecklist
  };
}

export const recoveryMethods = Object.values(methodCatalog);

export function getRecoveryMethodById(methodId: string): RecoveryMethod | undefined {
  const key = methodId as RecoveryMethodId;
  return methodCatalog[key];
}

export function buildSupportTemplate(method: RecoveryMethod, input: RecoveryInput): string {
  return method.supportTemplate.replaceAll("{{gmailAddress}}", input.gmailAddress);
}
