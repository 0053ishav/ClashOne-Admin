import { useMemo } from "react";

const TARGET_TYPES = [
  { value: "building", label: "Buildings" },
  { value: "troop", label: "Troops" },
  { value: "spell", label: "Spells" },
  { value: "hero", label: "Heroes" },
  { value: "pet", label: "Pets" },
];
const VILLAGES = [
  { value: "home", label: "Home Village" },
  { value: "builderBase", label: "Builder Base" },
];

export default function HammerJamDashboard({ config, setConfig, saveConfig, loading, eventTimezone, setEventTimezone }) {
  const hammerJam = config.hammerJam || {};
  const update = (patch) => setConfig((current) => ({
    ...current,
    hammerJam: { ...(current.hammerJam || {}), ...patch },
  }));
  const selectedTargets = useMemo(() => new Set(hammerJam.appliesTo || []), [hammerJam.appliesTo]);
  const selectedVillages = useMemo(() => new Set(hammerJam.villages || []), [hammerJam.villages]);

  const updateTimestamp = (field, value) => {
    const timestamp = parseDateInput(value, eventTimezone);
    update({ [field]: Math.floor(timestamp / 1000) });
  };
  const toggleArrayValue = (field, value, checked) => {
    const values = new Set(hammerJam[field] || []);
    if (checked) values.add(value);
    else values.delete(value);
    update({ [field]: [...values] });
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="breadcrumb"><span>Events</span><span>/</span><span>Hammer Jam</span></div>
          <h1 className="page-header-title">Hammer Jam</h1>
          <p className="page-header-description">Configure upgrade discounts, duration, resource production, target categories, and villages.</p>
        </div>
        <div className="page-header-actions">
          <Field label="Timezone">
            <select value={eventTimezone} onChange={(event) => {
              setEventTimezone(event.target.value);
              localStorage.setItem("admin-timezone", event.target.value);
            }} className="input">
              <option value="UTC">UTC · UTC+00:00</option>
              <option value="IST">IST (India) · UTC+05:30</option>
            </select>
          </Field>
          <button onClick={saveConfig} disabled={loading} className="btn btn-primary">{loading ? "Saving…" : "Save configuration"}</button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Event status" value={hammerJam.enabled ? "Enabled" : "Disabled"} detail={hammerJam.enabled ? "Configuration is active" : "Configuration is disabled"} />
        <StatCard label="Time multiplier" value={formatMultiplier(hammerJam.timeMultiplier)} detail="Upgrade duration" />
        <StatCard label="Cost multiplier" value={formatMultiplier(hammerJam.costMultiplier)} detail="Upgrade cost" />
        <StatCard label="Resource multiplier" value={`${Number(hammerJam.resourceMultiplier ?? 1)}×`} detail="Resource production" />
      </div>

      <section className="card hammer-jam-card">
        <div className="section-header">
          <div>
            <div className="section-title">Event configuration</div>
            <div className="section-description">Timestamps are stored as Unix seconds, matching events/hammer-jam.json.</div>
          </div>
          <label className="event-toggle">
            <input type="checkbox" checked={!!hammerJam.enabled} onChange={(event) => update({ enabled: event.target.checked })} className="native-checkbox" />
            Enabled
          </label>
        </div>
        <div className="event-config-grid">
          <Field label="Config version"><input type="number" min="1" step="1" value={config.version ?? 1} onChange={(event) => setConfig((current) => ({ ...current, version: Number(event.target.value) }))} className="input" /></Field>
          <Field label="Event title" className="xl:col-span-2"><input value={hammerJam.title || ""} onChange={(event) => update({ title: event.target.value })} className="input" /></Field>
          <Field label={`Start · ${eventTimezone}`}><input type="datetime-local" value={toDateInput(Number(hammerJam.startsAt) * 1000, eventTimezone)} onChange={(event) => updateTimestamp("startsAt", event.target.value)} className="input" /></Field>
          <Field label={`End · ${eventTimezone}`}><input type="datetime-local" value={toDateInput(Number(hammerJam.endsAt) * 1000, eventTimezone)} onChange={(event) => updateTimestamp("endsAt", event.target.value)} className="input" /></Field>
        </div>
      </section>

      <section className="card hammer-jam-card">
        <div className="section-header">
          <div>
            <div className="section-title">Event multipliers</div>
            <div className="section-description">Use 0.5 for half time/cost and 2 for double production.</div>
          </div>
        </div>
        <div className="event-config-grid">
          <Field label="Upgrade time multiplier"><input type="number" min="0" step="0.05" value={hammerJam.timeMultiplier ?? 1} onChange={(event) => update({ timeMultiplier: Number(event.target.value) })} className="input" /></Field>
          <Field label="Upgrade cost multiplier"><input type="number" min="0" step="0.05" value={hammerJam.costMultiplier ?? 1} onChange={(event) => update({ costMultiplier: Number(event.target.value) })} className="input" /></Field>
          <Field label="Resource production multiplier"><input type="number" min="0" step="0.1" value={hammerJam.resourceMultiplier ?? 1} onChange={(event) => update({ resourceMultiplier: Number(event.target.value) })} className="input" /></Field>
        </div>
      </section>

      <section className="card hammer-jam-card">
        <div className="section-header">
          <div>
            <div className="section-title">Applies to</div>
            <div className="section-description">Select the upgrade categories affected by Hammer Jam.</div>
          </div>
        </div>
        <div className="hammer-jam-options">
          {TARGET_TYPES.map((target) => (
            <label key={target.value} className="toggle-card">
              <span className="toggle-label">{target.label}</span>
              <input type="checkbox" checked={selectedTargets.has(target.value)} onChange={(event) => toggleArrayValue("appliesTo", target.value, event.target.checked)} className="native-checkbox" />
            </label>
          ))}
        </div>
      </section>

      <section className="card hammer-jam-card">
        <div className="section-header">
          <div>
            <div className="section-title">Villages</div>
            <div className="section-description">Choose which villages this event affects.</div>
          </div>
        </div>
        <div className="hammer-jam-options">
          {VILLAGES.map((village) => (
            <label key={village.value} className="toggle-card">
              <span className="toggle-label">{village.label}</span>
              <input type="checkbox" checked={selectedVillages.has(village.value)} onChange={(event) => toggleArrayValue("villages", village.value, event.target.checked)} className="native-checkbox" />
            </label>
          ))}
        </div>
      </section>
    </>
  );
}

function Field({ label, children, className = "" }) {
  return <label className={`field ${className}`}><span className="field-label">{label}</span>{children}</label>;
}

function StatCard({ label, value, detail }) {
  return <div className="stat-card"><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-description">{detail}</div></div>;
}

function formatMultiplier(value) {
  const multiplier = Number(value ?? 1);
  return Number.isFinite(multiplier) ? `${multiplier}×` : "—";
}

function toDateInput(timestamp, timezone = "IST") {
  if (!Number.isFinite(timestamp) || timestamp <= 0) return "";
  const timeZone = timezone === "UTC" ? "UTC" : "Asia/Kolkata";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(timestamp));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

function parseDateInput(value, timezone = "IST") {
  if (!value) return 0;
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const offsetMinutes = timezone === "IST" ? 330 : 0;
  return Date.UTC(year, month - 1, day, hour, minute) - offsetMinutes * 60_000;
}
