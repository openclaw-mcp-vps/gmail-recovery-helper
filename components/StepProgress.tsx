"use client";

import { motion } from "framer-motion";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  label: string;
}

export function StepProgress({ currentStep, totalSteps, label }: StepProgressProps) {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-[#9ca3af]">
        <span>{label}</span>
        <span>
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#1f2733]">
        <motion.div
          className="h-full rounded-full bg-[#3fb950]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
