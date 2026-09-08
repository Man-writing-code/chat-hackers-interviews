"use client";

import { FormEvent, useRef, useState } from "react";
import { googleForm } from "@/lib/google-form";

const platforms = [
  "WhatsApp",
  "Signal",
  "Telegram",
  "Slack",
  "Discord",
  "Microsoft Teams",
  "Facebook Groups / Messenger",
  "Email groups",
  "Matrix / Element",
];

const timeActivities = [
  "Approving and onboarding members",
  "Moderation and conflict management",
  "Answering questions",
  "Creating and scheduling content",
  "Moving information between channels",
  "Managing permissions and access",
  "Troubleshooting and member support",
  "Reporting and analytics",
];

const objectives = [
  "Coordinate staff and volunteers",
  "Mobilise people for events and actions",
  "Broadcast news and campaign updates",
  "Build relationships between members",
  "Onboard and retain supporters",
  "Share resources and organisational knowledge",
  "Provide peer or member support",
  "Coordinate securely across organisations",
];

const challenges = [
  "Too many disconnected platforms or groups",
  "Moderation, abuse or conflict",
  "Spam, scams or misinformation",
  "Onboarding and offboarding people",
  "Permissions and access control",
  "Safeguarding and data protection",
  "Finding important information later",
  "Low participation or noisy channels",
  "Limited analytics or oversight",
  "Admin workload and burnout",
  "Accessibility or language barriers",
];

const sections = [
  ["context", "Organisation"],
  ["setup", "Current setup"],
  ["workload", "Workload"],
  ["objectives", "Objectives"],
  ["challenges", "Challenges"],
  ["matrix", "Matrix"],
  ["pilot", "Pilot"],
] as const;

type Status = "idle" | "submitting" | "success";

function Required() {
  return <span className="required">Required</span>;
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <div className="field-label">
        <span>{label}</span>
        {required && <Required />}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
      {children}
    </div>
  );
}

function TextInput({ entry, label, placeholder, type = "text", required = false }: { entry: keyof typeof googleForm.entries; label: string; placeholder: string; type?: string; required?: boolean }) {
  return (
    <Field label={label} required={required}>
      <input name={googleForm.entries[entry]} type={type} placeholder={placeholder} required={required} />
    </Field>
  );
}

function TextArea({ entry, label, placeholder, required = false, hint }: { entry: keyof typeof googleForm.entries; label: string; placeholder: string; required?: boolean; hint?: string }) {
  return (
    <Field label={label} required={required} hint={hint}>
      <textarea name={googleForm.entries[entry]} placeholder={placeholder} required={required} rows={4} />
    </Field>
  );
}

function ChoiceGroup({ entry, label, options, required = false, kind = "radio", hint }: { entry: keyof typeof googleForm.entries; label: string; options: readonly string[]; required?: boolean; kind?: "radio" | "checkbox"; hint?: string }) {
  const name = googleForm.entries[entry];

  function syncCheckboxValidity(target: HTMLInputElement) {
    if (kind !== "checkbox" || !required || !target.form) return;
    const group = Array.from(target.form.elements).filter(
      (control): control is HTMLInputElement => control instanceof HTMLInputElement && control.name === name,
    );
    const hasSelection = group.some((control) => control.checked);
    group[0]?.setCustomValidity(hasSelection ? "" : "Choose at least one option.");
  }

  return (
    <Field label={label} required={required} hint={hint}>
      <div className={`choices ${kind === "radio" ? "choices-radio" : ""}`}>
        {options.map((option, index) => (
          <label className="choice" key={option}>
            <input
              name={name}
              type={kind}
              value={option}
              required={required && (kind === "radio" || index === 0)}
              onChange={(event) => syncCheckboxValidity(event.currentTarget)}
              onInvalid={(event) => syncCheckboxValidity(event.currentTarget)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </Field>
  );
}

function Section({ number, id, title, intro, children }: { number: string; id: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <section className="form-section" id={id}>
      <div className="section-heading">
        <span className="section-number">{number}</span>
        <div>
          <h2>{title}</h2>
          <p>{intro}</p>
        </div>
      </div>
      <div className="section-fields">{children}</div>
    </section>
  );
}

function GuideBlock({ number, title, children }: { number?: string; title: string; children: React.ReactNode }) {
  return (
    <section className="guide-block">
      <div className="guide-heading">
        {number && <span>{number}</span>}
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const attempted = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (status === "submitting") {
      event.preventDefault();
      return;
    }
    attempted.current = true;
    setStatus("submitting");
  }

  function handleFrameLoad() {
    if (!attempted.current) return;
    attempted.current = false;
    setStatus("success");
  }

  function resetInterview() {
    formRef.current?.reset();
    setStatus("idle");
    document.querySelector(".form-panel")?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <span>CH</span>
            <i />
          </div>
          <div>
            <p className="eyebrow">CHAT HACKERS · RESEARCH</p>
            <h1>Community chat discovery interview</h1>
          </div>
        </div>
        <div className="header-meta">
          <div className="duration"><span className="status-dot" /> 25–30 minutes</div>
          <a className="outline-button" href={googleForm.viewUrl} target="_blank" rel="noreferrer">
            Open Google Form <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <div className="workspace">
        <aside className="guide-panel" aria-labelledby="guide-title">
          <div className="panel-header">
            <div>
              <p className="eyebrow">INTERVIEWER GUIDE</p>
              <h2 id="guide-title">Conversation script</h2>
            </div>
            <span className="panel-badge">Read & discuss</span>
          </div>
          <div className="guide-content">
            <GuideBlock title="Opening">
              <p>Thanks for making time. Chat Hackers is exploring how open, interoperable technology built on the Matrix protocol could make community chat easier to run for progressive organisations.</p>
              <p>We are here to understand how your organisation works today: what helps, what creates work, and where the real problems are. This is a conversation about your experience, not a test of you or a pitch for a finished product.</p>
              <div className="callout"><strong>Interviewer note</strong><span>Ask for concrete examples. Avoid presenting Matrix as the answer before the participant has described the problem.</span></div>
            </GuideBlock>

            <GuideBlock number="01" title="Organisation context">
              <ul><li>What kind of community are they responsible for?</li><li>Who participates, and roughly how large is it?</li><li>What does their own role involve?</li></ul>
            </GuideBlock>
            <GuideBlock number="02" title="Current setup">
              <ul><li>Which chat and communication tools are actually in use?</li><li>What is each platform used for?</li><li>How are groups, channels and audiences divided?</li></ul>
              <p className="probe"><strong>Probe:</strong> What information gets copied manually from one place to another?</p>
            </GuideBlock>
            <GuideBlock number="03" title="Ownership and workload">
              <ul><li>Is channel administration an explicit responsibility?</li><li>How much time does it take in a normal week?</li><li>Which tasks create the most work or stress?</li></ul>
              <p className="probe"><strong>Probe:</strong> Does the work change sharply during elections, actions or crises?</p>
            </GuideBlock>
            <GuideBlock number="04" title="Objectives">
              <ul><li>What are the channels meant to achieve?</li><li>Which two outcomes matter most?</li><li>How would they recognise a healthy, successful community?</li></ul>
            </GuideBlock>
            <GuideBlock number="05" title="Challenges">
              <ul><li>Ask for the biggest problem before showing the list.</li><li>Explore a recent incident in detail.</li><li>What was the human or organisational cost?</li></ul>
            </GuideBlock>
            <GuideBlock number="06" title="Reaction to Matrix">
              <p>After showing the relevant Matrix concepts or prototypes, ask what felt genuinely useful and what did not.</p>
              <ul><li>Which capability would change their day-to-day work?</li><li>What would stop their organisation adopting it?</li><li>What is missing from what they saw?</li></ul>
            </GuideBlock>
            <GuideBlock number="07" title="Pilot potential">
              <p>Only move into recruitment after the discovery questions are complete.</p>
              <ul><li>Would a small, supported pilot be useful?</li><li>Which community or workflow would be safest to test?</li><li>Who else would need to agree?</li></ul>
            </GuideBlock>
            <GuideBlock title="Close">
              <p>Thank them, confirm any follow-up they have invited, and note anything important that did not fit the structured questions.</p>
            </GuideBlock>
          </div>
        </aside>

        <section className="form-panel" aria-labelledby="form-title">
          <div className="panel-header form-panel-header">
            <div>
              <p className="eyebrow">LIVE RESPONSE FORM</p>
              <h2 id="form-title">Record the interview</h2>
            </div>
            <span className="panel-badge connected"><span className="status-dot" /> Google Form</span>
          </div>

          <nav className="section-nav" aria-label="Interview form sections">
            {sections.map(([id, label], index) => <a href={`#${id}`} key={id}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a>)}
          </nav>

          <form ref={formRef} action={googleForm.actionUrl} method="POST" target="google-form-response" onSubmit={handleSubmit}>
            <div className="form-content">
              <Section number="01" id="context" title="Organisation context" intro="Enough context to interpret the interview without requiring personal details.">
                <div className="field-grid two-col">
                  <TextInput entry="participantName" label="Participant name" placeholder="Optional" />
                  <TextInput entry="organisation" label="Organisation" placeholder="Optional" />
                  <TextInput entry="role" label="Role" placeholder="Optional" />
                  <ChoiceGroup entry="organisationType" label="Organisation type" required options={["Political party or local branch", "Election campaign", "Elected representative's office", "Trade union", "Campaigning NGO", "Community or mutual-aid group", "Other"]} />
                  <ChoiceGroup entry="communitySize" label="Approximate community size" options={["Under 50", "50–199", "200–999", "1,000–4,999", "5,000+", "Not sure"]} />
                  <TextInput entry="followUpEmail" label="Follow-up email" placeholder="Optional" type="email" />
                </div>
              </Section>

              <Section number="02" id="setup" title="Current setup" intro="Map the tools and structure people work with today.">
                <ChoiceGroup entry="platforms" label="Which chat or communication programs does the organisation use?" required kind="checkbox" options={platforms} />
                <TextInput entry="otherPlatform" label="Other platform" placeholder="Add any tool not listed above" />
                <TextInput entry="primaryPlatform" label="Which is the primary platform, and why?" placeholder="Platform and reason it became the main space" required />
                <TextArea entry="channelStructure" label="How are the organisation's chats and channels organised?" placeholder="For example: national and local groups, staff and volunteer spaces, announcements and discussion" />
                <ChoiceGroup entry="activeChats" label="Approximately how many active groups or channels are managed?" options={["1–5", "6–15", "16–30", "31–75", "More than 75", "Not sure"]} />
              </Section>

              <Section number="03" id="workload" title="Ownership and workload" intro="Understand who keeps the channels working and where their time goes.">
                <ChoiceGroup entry="adminModel" label="Who is responsible for looking after these channels?" required options={["A dedicated staff organiser or community manager", "A named staff member alongside other duties", "Several staff share responsibility", "Volunteers or elected admins", "Responsibility is informal or unclear", "Nobody actively manages them"]} />
                <ChoiceGroup entry="weeklyHours" label="How many hours are spent managing chat channels in a typical week?" required options={["Less than 1 hour", "1–3 hours", "4–7 hours", "8–15 hours", "16–25 hours", "More than 25 hours", "Varies too much to estimate"]} />
                <ChoiceGroup entry="timeSpent" label="How is that management time spent?" kind="checkbox" options={timeActivities} />
                <TextArea entry="workloadDetail" label="Where does the most time or pressure come from?" placeholder="Capture the participant's explanation and any seasonal spikes" />
              </Section>

              <Section number="04" id="objectives" title="Objectives" intro="Identify the outcomes the community channels are expected to create.">
                <ChoiceGroup entry="objectives" label="What are the organisation's objectives for its community channels?" required kind="checkbox" options={objectives} />
                <TextArea entry="topObjectives" label="Which two objectives matter most, and why?" required placeholder="Record the two priorities in the participant's own words" />
                <TextArea entry="successDefinition" label="What would a healthy, successful community look like?" placeholder="Signals, behaviours or outcomes they would want to see" />
              </Section>

              <Section number="05" id="challenges" title="Challenges" intro="Find the problems with the greatest practical or human cost.">
                <ChoiceGroup entry="challenges" label="Which challenges affect the organisation's chats?" kind="checkbox" options={challenges} />
                <TextArea entry="biggestChallenge" label="What is the single biggest challenge?" required placeholder="Describe the problem, who it affects and why it matters" />
                <TextArea entry="recentExample" label="Can you describe a recent example?" placeholder="What happened, how people responded, and what it cost in time or trust" />
              </Section>

              <Section number="06" id="matrix" title="Reaction to Matrix" intro="Capture the response after showing the relevant ideas or prototypes.">
                <Field label="Overall, how useful could the Matrix approach be for this organisation?" required>
                  <div className="rating" role="radiogroup" aria-label="Matrix usefulness rating">
                    {[1, 2, 3, 4, 5].map((score) => <label key={score}><input type="radio" name={googleForm.entries.matrixRating} value={String(score)} required /><span>{score}</span></label>)}
                  </div>
                  <div className="rating-legend"><span>Not useful</span><span>Very useful</span></div>
                </Field>
                <TextArea entry="usefulTools" label="Which tools or capabilities seemed particularly useful?" placeholder="What stood out, and what would it help them do?" />
                <TextArea entry="matrixBarriers" label="What concerns or barriers would make adoption difficult?" placeholder="For example: migration, habits, trust, training, security review or procurement" />
                <TextArea entry="missingTools" label="Are there tools they would like to see that Chat Hackers is not working on?" placeholder="Capture unmet needs without limiting the answer to Matrix" />
              </Section>

              <Section number="07" id="pilot" title="Pilot potential" intro="Identify a realistic next step without turning the research into a sales conversation.">
                <ChoiceGroup entry="pilotInterest" label="Would the organisation be interested in discussing a supported pilot?" required options={["Yes", "Maybe — more information needed", "Not now", "No"]} />
                <TextArea entry="pilotUseCase" label="What would be the most useful and manageable pilot use case?" placeholder="A specific community, campaign, workflow or problem" />
                <TextArea entry="decisionConstraints" label="Who would need to agree, and what constraints would need to be addressed?" placeholder="Decision-makers, policies, technical requirements or risks" />
                <ChoiceGroup entry="pilotTiming" label="When could a pilot realistically begin?" options={["Within 1 month", "In 1–3 months", "In 3–6 months", "More than 6 months", "No likely timeframe"]} />
                <TextArea entry="followUpNotes" label="Follow-up notes" placeholder="Next action, introductions offered, or anything important not captured above" />
              </Section>

              <div className="submit-card">
                {status === "success" ? (
                  <div className="success-message" role="status">
                    <span className="success-icon">✓</span>
                    <div><strong>Response sent</strong><p>The interview was submitted to Google Forms.</p></div>
                    <button type="button" className="primary-button" onClick={resetInterview}>Start next interview</button>
                  </div>
                ) : (
                  <>
                    <div><strong>Ready to save the interview?</strong><p>Required questions must be completed before submission.</p></div>
                    <div className="submit-actions">
                      <button type="reset" className="text-button">Clear form</button>
                      <button type="submit" className="primary-button" disabled={status === "submitting"}>{status === "submitting" ? "Sending…" : "Submit response"}</button>
                    </div>
                  </>
                )}
              </div>
              <p className="submission-note">Responses go directly to the connected Google Form. Because Google does not return a readable confirmation to this page, the success message confirms that the submission was sent.</p>
            </div>
          </form>
          <iframe className="response-frame" name="google-form-response" title="Google Forms submission response" onLoad={handleFrameLoad} />
        </section>
      </div>
    </main>
  );
}
