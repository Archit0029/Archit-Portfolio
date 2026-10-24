import { CONTACT_EMAIL } from "../data/portfolio";

export async function sendPortfolioMessage(form: { name: string; email: string; message: string; website?: string }) {
  const name = form.name.trim();
  const email = form.email.trim().toLowerCase();
  const message = form.message.trim();
  const website = form.website?.trim() ?? "";

  if (!name || !email || !message) throw new Error("Please fill in all fields.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email address.");
  if (name.length > 80) throw new Error("Please keep your name under 80 characters.");
  if (email.length > 254) throw new Error("Please enter an email address under 255 characters.");
  if (message.length > 2000) throw new Error("Please keep your message under 2,000 characters.");
  if (website) throw new Error("Unable to send your message. Please email me directly.");

  const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      message,
      _subject: `New portfolio message from ${name}`,
      _replyto: email,
      _template: "table",
      _honey: website,
    }),
  });

  if (!response.ok) throw new Error(`Contact service returned ${response.status}`);

  const result: unknown = await response.json();
  if (typeof result !== "object" || result === null || !("success" in result)) {
    throw new Error("Contact service could not confirm delivery. Please email me directly.");
  }

  if (result.success !== "true" && result.success !== true) {
    const message = "message" in result && typeof result.message === "string" ? result.message : "";
    throw new Error(message || "Contact service could not confirm delivery. Please email me directly.");
  }
}