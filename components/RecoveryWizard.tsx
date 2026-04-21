"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { ArrowPathIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

import { StepProgress } from "@/components/StepProgress";
import { RecoveryMethodCard } from "@/components/RecoveryMethodCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buildSupportTemplate, recoveryInputSchema } from "@/lib/recovery-logic";
import type { RecoveryInput, RecoveryPlan } from "@/types/recovery";

type FormValues = RecoveryInput;

const yesNoOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not-sure", label: "Not sure" }
] as const;

function SelectField({
  id,
  label,
  value,
  onChange
}: {
  id: keyof FormValues;
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-sm text-[#f0f6fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3fb950]/70"
      >
        {yesNoOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function RecoveryWizard() {
  const [uiStep, setUiStep] = useState(1);
  const [plan, setPlan] = useState<RecoveryPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(recoveryInputSchema),
    defaultValues: {
      gmailAddress: "",
      lockedWhen: "today",
      canUseTrustedDevice: "not-sure",
      hasRecoveryEmail: "not-sure",
      hasRecoveryPhone: "not-sure",
      hasBackupCodes: "not-sure",
      isWorkspaceAccount: "no",
      remembersLastPassword: "not-sure",
      isTraveling: "no",
      notes: ""
    },
    mode: "onBlur"
  });

  const values = watch();

  const selectedTemplate = useMemo(() => {
    if (!plan?.methods.length) {
      return "";
    }

    return buildSupportTemplate(plan.methods[0], values);
  }, [plan, values]);

  const onSubmit = async (input: FormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/recovery-steps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Unable to generate recovery plan right now.");
      }

      const payload = (await response.json()) as { plan: RecoveryPlan };
      setPlan(payload.plan);
      setUiStep(4);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyTemplate = async () => {
    if (!selectedTemplate) {
      return;
    }

    await navigator.clipboard.writeText(selectedTemplate);
    setCopyNotice("Support template copied. Paste it into Google's account appeal form.");
    window.setTimeout(() => setCopyNotice(null), 2500);
  };

  return (
    <Card className="border-[#30363d] bg-[#161b22]/90">
      <CardHeader className="space-y-4">
        <CardTitle className="text-2xl">Guided Recovery Wizard</CardTitle>
        <CardDescription>
          Answer a few questions about your lockout and get a ranked recovery plan with exact steps to follow.
        </CardDescription>
        <StepProgress currentStep={uiStep > 3 ? 3 : uiStep} totalSteps={3} label="Recovery profile" />
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {uiStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="gmailAddress">Locked Gmail Address</Label>
                <Input id="gmailAddress" placeholder="name@gmail.com" {...register("gmailAddress")} />
                {errors.gmailAddress && <p className="text-sm text-[#f85149]">{errors.gmailAddress.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lockedWhen">When did the lockout start?</Label>
                <select
                  id="lockedWhen"
                  {...register("lockedWhen")}
                  className="h-10 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-sm text-[#f0f6fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3fb950]/70"
                >
                  <option value="today">Today</option>
                  <option value="this-week">Within the last 7 days</option>
                  <option value="this-month">Within the last 30 days</option>
                  <option value="longer">More than 30 days ago</option>
                </select>
              </div>

              <SelectField
                id="canUseTrustedDevice"
                label="Can you access a device previously used for this Gmail?"
                value={values.canUseTrustedDevice}
                onChange={(nextValue) => setValue("canUseTrustedDevice", nextValue as FormValues["canUseTrustedDevice"])}
              />

              <SelectField
                id="remembersLastPassword"
                label="Do you remember your most recent password?"
                value={values.remembersLastPassword}
                onChange={(nextValue) => setValue("remembersLastPassword", nextValue as FormValues["remembersLastPassword"])}
              />

              <SelectField
                id="isTraveling"
                label="Are you trying recovery while traveling or on a new network?"
                value={values.isTraveling}
                onChange={(nextValue) => setValue("isTraveling", nextValue as FormValues["isTraveling"])}
              />

              <div className="md:col-span-2">
                <Button type="button" onClick={() => setUiStep(2)}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {uiStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2">
              <SelectField
                id="hasRecoveryEmail"
                label="Do you still have access to your recovery email?"
                value={values.hasRecoveryEmail}
                onChange={(nextValue) => setValue("hasRecoveryEmail", nextValue as FormValues["hasRecoveryEmail"])}
              />

              <SelectField
                id="hasRecoveryPhone"
                label="Do you still have your recovery phone or Google prompt device?"
                value={values.hasRecoveryPhone}
                onChange={(nextValue) => setValue("hasRecoveryPhone", nextValue as FormValues["hasRecoveryPhone"])}
              />

              <SelectField
                id="hasBackupCodes"
                label="Do you have Google backup codes saved?"
                value={values.hasBackupCodes}
                onChange={(nextValue) => setValue("hasBackupCodes", nextValue as FormValues["hasBackupCodes"])}
              />

              <SelectField
                id="isWorkspaceAccount"
                label="Is this a Google Workspace business account?"
                value={values.isWorkspaceAccount}
                onChange={(nextValue) => setValue("isWorkspaceAccount", nextValue as FormValues["isWorkspaceAccount"])}
              />

              <div className="md:col-span-2 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setUiStep(1)}>
                  Back
                </Button>
                <Button type="button" onClick={() => setUiStep(3)}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {uiStep === 3 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Any details that can help recovery planning?</Label>
                <Textarea
                  id="notes"
                  rows={5}
                  placeholder="Example: I still have my old Android phone signed into YouTube, account was locked after I changed country last week, and billing emails still arrive to backup inbox."
                  {...register("notes")}
                />
                <p className="text-xs text-[#9ca3af]">
                  Include timeline clues: last successful login date, usual login city, and services tied to this Gmail.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={() => setUiStep(2)}>
                  Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      Building Your Plan...
                    </>
                  ) : (
                    "Generate Recovery Plan"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </form>

        {errorMessage && <p className="rounded-md border border-[#f85149]/40 bg-[#2a1515] p-3 text-sm text-[#ffb4af]">{errorMessage}</p>}

        {plan && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 border-t border-[#30363d] pt-6">
            <div className="space-y-2">
              <h3 className="font-[family-name:var(--font-heading)] text-xl">Your Recovery Priority Plan</h3>
              <p className="text-sm text-[#9ca3af]">Confidence score: {Math.round(plan.confidence * 100)}%</p>
              <p className="text-sm text-[#d1d5db]">{plan.nextBestAction}</p>
            </div>

            <div className="grid gap-4">
              {plan.methods.map((method, index) => (
                <RecoveryMethodCard key={method.id} method={method} rank={index + 1} />
              ))}
            </div>

            <div className="space-y-3 rounded-lg border border-[#30363d] bg-[#111827]/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-medium">Support Escalation Template</h4>
                <Button variant="secondary" size="sm" onClick={copyTemplate}>
                  <ClipboardDocumentCheckIcon className="h-4 w-4" />
                  Copy Template
                </Button>
              </div>
              <Textarea value={selectedTemplate} readOnly rows={6} className="text-sm" />
              {copyNotice && <p className="text-xs text-[#3fb950]">{copyNotice}</p>}
            </div>

            <div className="space-y-2 rounded-lg border border-[#30363d] bg-[#111827]/70 p-4">
              <h4 className="font-medium">Do These Before Your Next Attempt</h4>
              <ul className="space-y-1 text-sm text-[#d1d5db]">
                {plan.supportChecklist.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
