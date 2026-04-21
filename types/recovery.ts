export type RecoveryAnswer = "yes" | "no" | "not-sure";

export type RecoveryMethodId =
  | "cached-session-recovery"
  | "recovery-email-reset"
  | "phone-prompt-approval"
  | "backup-codes-path"
  | "account-appeal-flow"
  | "workspace-admin-escalation";

export interface RecoveryInput {
  gmailAddress: string;
  lockedWhen: "today" | "this-week" | "this-month" | "longer";
  canUseTrustedDevice: RecoveryAnswer;
  hasRecoveryEmail: RecoveryAnswer;
  hasRecoveryPhone: RecoveryAnswer;
  hasBackupCodes: RecoveryAnswer;
  isWorkspaceAccount: RecoveryAnswer;
  remembersLastPassword: RecoveryAnswer;
  isTraveling: RecoveryAnswer;
  notes?: string;
}

export interface RecoveryMethod {
  id: RecoveryMethodId;
  title: string;
  description: string;
  rationale: string;
  difficulty: "Low" | "Medium" | "High";
  successWindow: string;
  requirements: string[];
  steps: string[];
  supportTemplate: string;
}

export interface RecoveryPlan {
  confidence: number;
  recommendedOrder: RecoveryMethodId[];
  methods: RecoveryMethod[];
  nextBestAction: string;
  supportChecklist: string[];
}
