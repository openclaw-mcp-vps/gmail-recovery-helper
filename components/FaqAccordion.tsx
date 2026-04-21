"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const faqs = [
  {
    question: "Will this unlock my Gmail instantly?",
    answer:
      "No tool can bypass Google's security controls. This app improves your odds by telling you exactly which recovery path to run first, in what order, and what to say when escalation is needed."
  },
  {
    question: "Do I need technical knowledge?",
    answer:
      "No. Every path is plain language and includes what to click, what to avoid, and how long to wait between attempts so you do not trigger extra lockouts."
  },
  {
    question: "What if I no longer have my recovery phone and email?",
    answer:
      "The wizard switches to evidence-based manual appeal mode, including a timeline template that improves support review quality and avoids contradictory submissions."
  },
  {
    question: "Does this work for Google Workspace accounts?",
    answer:
      "Yes. Workspace accounts get a dedicated admin-first route so you can recover faster through domain controls instead of repeating consumer recovery loops."
  }
];

export function FaqAccordion() {
  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <Disclosure key={faq.question}>
          {({ open }) => (
            <div className="rounded-xl border border-[#30363d] bg-[#161b22]/80 px-4 py-3">
              <DisclosureButton className="flex w-full items-center justify-between text-left">
                <span className="font-medium text-[#f0f6fc]">{faq.question}</span>
                <ChevronDownIcon className={`h-5 w-5 text-[#9ca3af] transition-transform ${open ? "rotate-180" : ""}`} />
              </DisclosureButton>
              <DisclosurePanel className="pt-3 text-sm text-[#c9d1d9]">{faq.answer}</DisclosurePanel>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
