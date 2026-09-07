const contactRecipient = "architbishnoi31@gmail.com";

export async function sendPortfolioMessage(form: { name: string; email: string; message: string }) {
  const name = form.name.trim();
  const email = form.email.trim().toLowerCase();
  const message = form.message.trim();

  if (!name || !email || !message) throw new Error("Please fill in all fields.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email address.");

  const response = await fetch(`https://formsubmit.co/ajax/${contactRecipient}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      message,
      _subject: `New portfolio message from ${name}`,
      _replyto: email,
      _template: "table",
      _honey: "",
    }),
  });

  if (!response.ok) throw new Error(`Contact service returned ${response.status}`);
}