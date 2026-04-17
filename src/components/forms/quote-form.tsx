"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { FormVisualPanel } from "@/components/forms/form-visual-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { sendQuoteEmail } from "@/lib/emailjs";

export function QuoteForm() {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    projectName: "",
    projectType: "residential",
    squareFootage: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function validateForm() {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email address is required.";
    if (!form.projectName.trim()) return "Project name is required.";
    if (!form.message.trim()) return "Project details are required.";
    return "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    startTransition(async () => {
      try {
        await sendQuoteEmail({
          form_type: "Quote Request",
          full_name: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || "Not provided",
          project_name: form.projectName.trim(),
          project_type: form.projectType,
          square_footage: form.squareFootage.trim() || "Not provided",
          message: form.message.trim(),
        });

        setSuccess("Your quote request has been sent. We'll follow up with you soon.");
        setForm({
          fullName: "",
          email: "",
          phone: "",
          projectName: "",
          projectType: "residential",
          squareFootage: "",
          message: "",
        });
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Something went wrong while sending your quote request.",
        );
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid overflow-hidden border border-[var(--border)] bg-white shadow-[0_24px_60px_rgba(35,31,32,0.12)] lg:grid-cols-[0.95fr_1.05fr]"
    >
      <FormVisualPanel
        kicker="Quote"
        title="Request a Quote"
        description="Share project type, approximate quantity, and timeline so we can prepare a tailored recommendation."
        imagePath="/hero-images/catalog-hero.png"
      />
      <div className="bg-white px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <p className="page-kicker">Project Details</p>
        <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Tell us what you need</h3>
        <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">
          Include quantities, finish preferences, and delivery timing so we can respond with a sharper estimate.
        </p>
        <div className="mt-6 grid gap-4">
          <Input
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Full name"
            autoComplete="name"
          />
          <Input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="Email address"
            autoComplete="email"
          />
          <Input
            type="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="Phone number"
            autoComplete="tel"
          />
          <Input
            value={form.projectName}
            onChange={(event) => updateField("projectName", event.target.value)}
            placeholder="Project name"
          />
          <Select value={form.projectType} onChange={(event) => updateField("projectType", event.target.value)}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </Select>
          <Input
            value={form.squareFootage}
            onChange={(event) => updateField("squareFootage", event.target.value)}
            placeholder="Estimated square footage"
          />
          <Textarea
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Share tile styles, quantities, and delivery timeline"
          />
          {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
          {success ? <p className="text-sm text-[#1f7a3d]">{success}</p> : null}
          <Button
            type="submit"
            disabled={isPending}
            className="mt-2 inline-flex w-full gap-2 bg-[var(--brand)] px-6 py-4 hover:bg-[#c61d1f] sm:w-auto"
          >
            {isPending ? <Loader /> : null}
            {isPending ? "Sending..." : "Submit Quote Request"}
          </Button>
        </div>
      </div>
    </form>
  );
}
