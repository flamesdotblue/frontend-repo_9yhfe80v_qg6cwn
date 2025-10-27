import { useEffect, useMemo, useRef, useState } from 'react';
import { Info } from 'lucide-react';

const cardStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)'
};

function useCountUp(value, duration = 2000) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = Number.isFinite(value) ? value : 0;
    const d = Math.max(300, duration);
    let raf;

    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / d);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };

    cancelAnimationFrame(raf);
    startRef.current = null;
    requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  useEffect(() => {
    fromRef.current = display;
  }, [display]);

  return display;
}

export default function OperationsAndResults({ values, onChange, setup, onConfidenceBump }) {
  const Field = ({ label, name, type = 'number', placeholder, tooltip }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm flex items-center gap-1" style={{ color: '#ECCBA0' }}>
        {label}
        {tooltip && (
          <span className="relative group">
            <Info className="w-3.5 h-3.5 opacity-70" />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none" style={{ background: 'rgba(0,0,0,0.6)', color: '#ECCBA0' }}>
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={values[name] ?? ''}
        onChange={(e) => onChange(name, e.target.value)}
        className="bg-transparent rounded-md px-3 py-2 outline-none focus:ring-1 placeholder:opacity-70"
        style={{ color: '#ECCBA0', border: '1px solid rgba(255,255,255,0.12)' }}
        onBlur={onConfidenceBump}
      />
    </div>
  );

  const parsed = useMemo(() => {
    const num = (v) => (v ? parseFloat(v) : 0);
    const exits = num(values.exits);
    const avgComp = num(values.avgComp);
    const recruit = num(values.recruit);
    const training = num(values.training);
    const onboardDays = num(values.onboard);
    const vacancyDays = num(values.vacancy);
    const wellnessDays = num(values.wellness);

    // Assumptions & multipliers
    const regionalIdx = 1.1; // could be inferred from location later
    const serviceMult = setup?.category?.includes('Luxury') ? 1.25 : 1.1;

    const dayCostPerEmp = (avgComp / 30) * regionalIdx * serviceMult;
    const productivityDrag = (onboardDays + vacancyDays + wellnessDays) * dayCostPerEmp;
    const overtimePremium = avgComp * 0.5 * (vacancyDays / 30);

    const perExitCost = recruit + training + productivityDrag + overtimePremium;
    const annualLeakage = exits * perExitCost;

    const teamSize = Math.max(1, parseFloat(setup?.team || '1'));
    const keys = Math.max(1, parseFloat(setup?.keys || '1'));

    return {
      annualLeakage,
      costPerKey: annualLeakage / keys,
      costPerEmployee: annualLeakage / teamSize,
      lossTickerPerDay: annualLeakage / 365
    };
  }, [values, setup]);

  const animatedAnnual = useCountUp(Math.round(parsed.annualLeakage));
  const animatedKey = useCountUp(Math.round(parsed.costPerKey));
  const animatedEmp = useCountUp(Math.round(parsed.costPerEmployee));
  const animatedTicker = useCountUp(Math.round(parsed.lossTickerPerDay));

  const [savings, setSavings] = useState(20);
  const recoverable = Math.round((parsed.annualLeakage * savings) / 100);

  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="w-full flex justify-center py-12 md:py-16" style={{ backgroundColor: '#1D0F2F' }}>
      <div className="w-full max-w-[980px] px-6 space-y-8">
        {/* Workforce Inputs */}
        <div className="rounded-xl p-6 md:p-8" style={cardStyle}>
          <h3 className="text-lg font-serif mb-4" style={{ color: '#D4AF37' }}>Workforce Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="Team Members Exited (12 M)" name="exits" placeholder="e.g., 24" tooltip="Employees exited in the last 12 months" />
            <Field label="Avg. Monthly Compensation" name="avgComp" placeholder="e.g., 40000" tooltip="Gross monthly per employee" />
            <Field label="Recruitment Cost per Hire" name="recruit" placeholder="e.g., 25000" tooltip="Agency + internal cost per hire" />

            <Field label="Training Investment / Employee" name="training" placeholder="e.g., 15000" tooltip="Direct training and mentoring cost" />
            <Field label="Onboarding Duration (days)" name="onboard" placeholder="e.g., 30" tooltip="Days to reach baseline productivity" />
            <Field label="Vacancy Duration (days)" name="vacancy" placeholder="e.g., 20" tooltip="Average time role stays unfilled" />

            <Field label="Well-Being / Sick Leave (days)" name="wellness" placeholder="e.g., 6" tooltip="Annual average per employee" />
          </div>
        </div>

        {/* Results */}
        <div className="rounded-xl p-6 md:p-8 space-y-6" style={cardStyle}>
          <h3 className="text-lg font-serif" style={{ color: '#D4AF37' }}>Results & Insights</h3>
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-semibold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg,#D4AF37,#ECCBA0)' }}>
              Annual Workforce Leakage (₹) {new Intl.NumberFormat('en-IN').format(animatedAnnual)}
            </div>
            <p className="mt-2 text-sm text-[rgba(236,203,160,0.85)]">
              Your hidden cost from attrition, burnout, and training drag.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard label="Cost per Key / Year" value={animatedKey} />
            <MetricCard label="Cost per Employee / Year" value={animatedEmp} />
            <MetricCard label="Real-Time Loss Ticker (₹/day)" value={animatedTicker} />
            <div className="rounded-lg p-4" style={cardStyle}>
              <div className="text-sm mb-2" style={{ color: '#ECCBA0' }}>Recoverable Savings Slider</div>
              <input
                type="range"
                min={10}
                max={50}
                value={savings}
                onChange={(e) => setSavings(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="mt-1 text-sm" style={{ color: '#ECCBA0' }}>{savings}% potential | ≈ ₹{new Intl.NumberFormat('en-IN').format(recoverable)}</div>
            </div>
          </div>
        </div>

        {/* Report */}
        <div className="rounded-xl p-6 md:p-8 space-y-4" style={cardStyle}>
          <h3 className="text-lg font-serif" style={{ color: '#D4AF37' }}>Your Personalized Kintsug Workforce Leakage Report</h3>
          <p className="text-sm text-[rgba(236,203,160,0.85)]">Get your detailed insights and join our early access waitlist to experience harmony in action.</p>
          <ReportForm onDone={() => setSubmitted(true)} />
        </div>

        {submitted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.45)] backdrop-blur" />
            <div className="relative z-10 rounded-xl p-6 w-[90%] max-w-md text-center" style={cardStyle}>
              <div className="text-lg font-serif mb-2" style={{ color: '#D4AF37' }}>Your report is on its way.</div>
              <p className="text-sm" style={{ color: '#ECCBA0' }}>
                You’ve been added to the Kintsug Early Access List.
              </p>
              <button
                className="mt-4 rounded-full px-4 py-2 text-sm"
                onClick={() => setSubmitted(false)}
                style={{
                  color: '#1D0F2F',
                  background: 'linear-gradient(90deg, #D4AF37, #ECCBA0)'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-lg p-4" style={cardStyle}>
      <div className="text-xs mb-1" style={{ color: '#ECCBA0' }}>{label}</div>
      <div className="text-xl font-semibold" style={{ color: '#ECCBA0' }}>
        ₹{new Intl.NumberFormat('en-IN').format(value)}
      </div>
    </div>
  );
}

function ReportForm({ onDone }) {
  const [form, setForm] = useState({ name: '', email: '', title: '' });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder for backend integration: PDF generation + email + waitlist
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onDone?.();
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input label="Name" value={form.name} onChange={(v) => update('name', v)} placeholder="e.g., Aisha Sharma" />
      <Input label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} placeholder="e.g., aisha@example.com" />
      <Input label="Designation" value={form.title} onChange={(v) => update('title', v)} placeholder="e.g., GM, HR Head" />
      <div className="md:col-span-3 flex justify-end mt-1">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full px-5 py-2 text-sm disabled:opacity-60"
          style={{
            color: '#1D0F2F',
            background: 'linear-gradient(90deg, #D4AF37, #ECCBA0)',
            boxShadow: '0 6px 20px rgba(212,175,55,0.25)'
          }}
        >
          {loading ? 'Sending…' : 'Send My Report & Join Waitlist →'}
        </button>
      </div>
    </form>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm" style={{ color: '#ECCBA0' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent rounded-md px-3 py-2 outline-none focus:ring-1 placeholder:opacity-70"
        style={{ color: '#ECCBA0', border: '1px solid rgba(255,255,255,0.12)' }}
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = placeholder || '')}
      />
    </div>
  );
}
