"use client";

import emailjs from "@emailjs/browser";

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const contactTemplateId = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID;
const quoteTemplateId = process.env.NEXT_PUBLIC_EMAILJS_QUOTE_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export function sendContactEmail(templateParams: Record<string, string>) {
  if (!serviceId || !contactTemplateId || !publicKey) {
    throw new Error("Missing EmailJS contact configuration.");
  }

  return emailjs.send(serviceId, contactTemplateId, templateParams, { publicKey });
}

export function sendQuoteEmail(templateParams: Record<string, string>) {
  if (!serviceId || !quoteTemplateId || !publicKey) {
    throw new Error("Missing EmailJS quote configuration.");
  }

  return emailjs.send(serviceId, quoteTemplateId, templateParams, { publicKey });
}
