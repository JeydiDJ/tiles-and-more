"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { FormVisualPanel } from "@/components/forms/form-visual-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { sendContactEmail } from "@/lib/emailjs";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
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
    if (!form.name.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email address is required.";
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
        await sendContactEmail({
          form_type: "Contact Inquiry",
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || "Not provided",
          message: form.message.trim(),
        });

        setSuccess("Your inquiry has been sent. We'll get back to you soon.");
        setForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Something went wrong while sending your inquiry.",
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
        kicker="Contact"
        title="Start Your Inquiry"
        description="Reach out for product guidance, showroom assistance, and support in choosing the right surfaces for your project."
        imagePath="/hero-images/roca-hero-1.jpg"
        footerLabel="Showroom support and project guidance"
      />
      <div className="bg-white px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <p className="page-kicker">Contact</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Talk to the team</h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">
          Send a quick note about your space, timeline, or product questions and we&apos;ll point you in the right
          direction.
        </p>
        <div className="mt-6 grid gap-4">
          <Input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
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
          <Textarea
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Tell us about your project"
          />
          {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
          {success ? <p className="text-sm text-[#1f7a3d]">{success}</p> : null}
          <Button
            type="submit"
            disabled={isPending}
            className="mt-2 inline-flex w-full gap-2 bg-[var(--brand)] px-6 py-4 hover:bg-[#c61d1f] sm:w-auto"
          >
            {isPending ? <Loader /> : null}
            {isPending ? "Sending..." : "Send Inquiry"}
          </Button>
        </div>
      </div>
    </form>
  );
}
