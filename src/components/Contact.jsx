import { useRef, useState } from "react";
import {
  Mail, MapPin, Send, Clock, Copy, CheckCircle2, AlertCircle,
  Loader2, Sparkles, MessageSquare, ShieldCheck,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

/* ─────────────────────────────────────────────────────
   🔥 Your email — FormSubmit sends everything here.
   No key. No signup. Just this address.
   ───────────────────────────────────────────────────── */
const EMAIL = "jayantisworking1@gmail.com";

/* FormSubmit AJAX endpoint — no page redirect */
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`;

const DIRECT = [
  { icon: Mail,   label: "Email",    value: EMAIL,                copy: true, href: `mailto:${EMAIL}` },
  { icon: MapPin, label: "Location", value: "Uttar Pradesh, India" },
  { icon: Clock,  label: "Response", value: "Within 24 hours" },
];

const SOCIALS = [
  { icon: FaGithub,   label: "GitHub",   href: "https://github.com/Jayantrajput09" },
  { icon: FaLinkedin, label: "LinkedIn", href: "https://linkedin.com/" },
  { icon: FaXTwitter, label: "X",        href: "https://x.com/" },
];

const TOPICS = ["Freelance", "Full-time", "Collaboration", "Just saying hi"];

/* ───────────────────────────────────────────────────── */

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
        <span>{label}</span>
        {error && (
          <span className="flex items-center gap-1 text-[10px] normal-case tracking-normal text-[color:var(--accent-third)]">
            <AlertCircle size={10} /> {error}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* ignore */ }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy email"}
      className="shrink-0 rounded-md p-1 text-[color:var(--muted)] transition hover:text-[color:var(--accent)]"
    >
      {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
    </button>
  );
}

/* ───────────────────────────────────────────────────── */

export default function Contact() {
  const formRef = useRef(null);
  const [state, setState]     = useState("idle"); // idle | sending | ok | error
  const [topic, setTopic]     = useState("Freelance");
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    if (name === "from_name" && value.trim().length < 2) return "Too short";
    if (name === "from_email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Invalid email";
    if (name === "message") {
      if (value.trim().length < 10) return "A bit more detail?";
      if (value.length > 1500) return "Too long";
    }
    return "";
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((er) => ({ ...er, [name]: validateField(name, value) }));
  };

  const onInput = (e) => {
    const { name, value } = e.target;
    if (!touched[name]) return;
    setErrors((er) => ({ ...er, [name]: validateField(name, value) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (state === "sending") return;

    const form = e.currentTarget;

    // Honeypot — invisible to users, filled only by bots
    const honeypot = form.querySelector('input[name="_honey"]');
    if (honeypot?.value) return;

    const data = {
      name:    form.from_name.value.trim(),
      email:   form.from_email.value.trim(),
      message: form.message.value.trim(),
    };

    // Validate
    const errs = {
      from_name:  validateField("from_name",  data.name),
      from_email: validateField("from_email", data.email),
      message:    validateField("message",    data.message),
    };
    setTouched({ from_name: true, from_email: true, message: true });
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setState("sending");

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // Required by FormSubmit — anything else is passed through
          name:    data.name,
          email:   data.email,
          message: data.message,

          // Your custom fields — appear in the email you receive
          Topic:   topic,

          // FormSubmit hidden controls
          _subject: `[${topic}] Portfolio message from ${data.name}`,
          _template: "table",   // nicer formatting in Gmail
          _captcha: "false",    // disable their captcha page
          _honey: "",           // their built-in bot trap
        }),
      });

      const json = await res.json();
      if (!res.ok || json.success === "false") {
        throw new Error(json.message || "Send failed");
      }

      setState("ok");
      form.reset();
      setTopic("Freelance");
      setTouched({});
      setErrors({});
      setTimeout(() => setState("idle"), 5200);
    } catch (err) {
      console.error("FormSubmit error:", err);
      setState("error");
      setTimeout(() => setState("idle"), 5200);
    }
  };

  /* ────────────────────────────── */

  return (
    <section id="contact" className="relative px-5 py-24 sm:px-8 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="glow      left-[-12%] top-[10%] h-[460px] w-[460px]" />
        <div className="glow-pink right-[-10%] bottom-[8%] h-[500px] w-[500px]" />
      </div>

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-14 max-w-3xl">
          <div className="badge-live mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium">
            <Sparkles size={12} className="text-[color:var(--accent-secondary)]" />
            <span className="text-[color:var(--accent)]">Get in touch</span>
          </div>

          <h2 className="dynamic-text text-4xl font-black leading-[1.15] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Let&apos;s build something great.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            A project, a role, or a wild idea? Send a note — I reply to
            every serious message.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">

          {/* ═══════ FORM ═══════ */}
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            className="glass card-3d relative overflow-hidden rounded-3xl p-6 sm:p-9"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
              style={{
                background: "color-mix(in oklab, var(--accent) 30%, transparent)",
                opacity: .4,
              }}
            />

            {/* Honeypot — bots fill this, humans never see it */}
            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            {/* Topic selector */}
            <div className="relative mb-7">
              <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                What&apos;s this about?
              </p>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    data-active={topic === t}
                    className="filter-pill rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-3.5 py-1.5 text-xs font-medium text-[color:var(--muted)] hover:text-[color:var(--text)]"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Name + Email */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" error={touched.from_name && errors.from_name}>
                <input
                  name="from_name"
                  type="text"
                  autoComplete="name"
                  aria-required="true"
                  placeholder="your name"
                  maxLength={80}
                  onBlur={onBlur}
                  onInput={onInput}
                  className="rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-4 py-3 text-sm text-[color:var(--text)] outline-none transition focus:border-[color:var(--accent)]/60 focus:shadow-[0_0_30px_-12px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
                />
              </Field>

              <Field label="Email" error={touched.from_email && errors.from_email}>
                <input
                  name="from_email"
                  type="email"
                  autoComplete="email"
                  aria-required="true"
                  placeholder="you@domain.com"
                  onBlur={onBlur}
                  onInput={onInput}
                  className="rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-4 py-3 text-sm text-[color:var(--text)] outline-none transition focus:border-[color:var(--accent)]/60 focus:shadow-[0_0_30px_-12px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
                />
              </Field>
            </div>

            {/* Message */}
            <div className="mt-5">
              <Field label="Message" error={touched.message && errors.message}>
                <textarea
                  name="message"
                  rows={6}
                  maxLength={1500}
                  aria-required="true"
                  placeholder="Tell me about your project, role, or idea…"
                  onBlur={onBlur}
                  onInput={onInput}
                  className="resize-none rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-4 py-3 text-sm text-[color:var(--text)] outline-none transition focus:border-[color:var(--accent)]/60 focus:shadow-[0_0_30px_-12px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
                />
              </Field>
            </div>

            {/* Actions */}
            <div className="relative mt-7 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={state === "sending"}
                className="btn-shimmer group/btn inline-flex items-center gap-2 px-6 py-3 text-sm disabled:opacity-70"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {state === "sending" && <Loader2 size={15} className="animate-spin" />}
                  {state === "ok"      && <CheckCircle2 size={15} />}
                  {state === "error"   && <AlertCircle size={15} />}
                  {state === "idle"    && <Send size={15} />}
                  {state === "sending" ? "Sending…"
                    : state === "ok"    ? "Sent!"
                    : state === "error" ? "Try again"
                    :                     "Send Message"}
                </span>
              </button>

              <p className="flex items-center gap-1.5 text-xs text-[color:var(--muted)]">
                <ShieldCheck size={12} className="text-[color:var(--accent)]" />
                Delivered straight to my inbox
              </p>
            </div>

            {/* Status banner */}
            {state !== "idle" && state !== "sending" && (
              <div
                role="status"
                className={`mt-5 rounded-xl border px-4 py-3 text-xs ${
                  state === "ok"
                    ? "border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
                    : "border-[color:var(--accent-third)]/40 bg-[color:var(--accent-third)]/10 text-[color:var(--accent-third)]"
                }`}
              >
                {state === "ok" && (
                  <>Message received — I&apos;ll reply within 24 hours.</>
                )}
                {state === "error" && (
                  <>
                    Something went wrong. Email me directly at{" "}
                    <a
                      href={`mailto:${EMAIL}`}
                      className="font-semibold underline underline-offset-2"
                    >
                      {EMAIL}
                    </a>
                    .
                  </>
                )}
              </div>
            )}
          </form>

          {/* ═══════ DIRECT PANEL ═══════ */}
          <aside className="glass card-3d rounded-3xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Direct line</h3>
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  Prefer email? Reach me directly.
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] text-[color:var(--accent)]">
                <MessageSquare size={16} />
              </span>
            </div>

            <div className="badge-live mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
              </span>
              <span className="text-[color:var(--accent)]">Available for work</span>
            </div>

            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-[color:var(--glass-border)] to-transparent" />

            <ul className="space-y-5">
              {DIRECT.map(({ icon: Icon, label, value, copy, href }) => (
                <li key={label} className="contact-direct-row group flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] text-[color:var(--accent)] transition-all duration-300 group-hover:border-[color:var(--accent)]/50 group-hover:shadow-[0_0_22px_-8px_color-mix(in_oklab,var(--accent)_70%,transparent)]">
                    <Icon size={15} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                      {label}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {href ? (
                        <a
                          href={href}
                          className="contact-direct-value truncate text-sm font-medium text-[color:var(--text)] underline-offset-4 hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="contact-direct-value truncate text-sm font-medium text-[color:var(--text)]">
                          {value}
                        </p>
                      )}
                      {copy && <CopyButton text={value} />}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-[color:var(--glass-border)] to-transparent" />

            <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
              Elsewhere
            </p>
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="tag-chip inline-flex items-center gap-2 rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-3.5 py-2 text-xs font-medium text-[color:var(--muted)] hover:text-[color:var(--text)]"
                >
                  <Icon size={14} />
                  {label}
                </a>
              ))}
            </div>

            <a
              href={`mailto:${EMAIL}`}
              className="group mt-7 flex items-center justify-between rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-4 py-3 text-xs font-semibold text-[color:var(--text)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--accent)]/50 hover:shadow-[0_0_30px_-10px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
            >
              <span className="flex items-center gap-2">
                <Mail size={13} className="text-[color:var(--accent)]" />
                Send a direct email
              </span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}