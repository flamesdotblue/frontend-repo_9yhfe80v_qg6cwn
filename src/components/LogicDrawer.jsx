import { X } from 'lucide-react';

export default function LogicDrawer({ open, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-50 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-[520px] transform transition-all duration-400 ease-out ${
          open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        style={{ background: 'rgba(29,15,47,0.85)', backdropFilter: 'blur(12px)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative h-full flex flex-col">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:scale-105 transition"
            aria-label="Close"
            style={{ color: '#D4AF37' }}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 overflow-y-auto">
            <h2 className="text-2xl font-serif mb-4" style={{ color: '#D4AF37' }}>
              System Logic & Methodology
            </h2>
            <div className="space-y-6 text-sm leading-6" style={{ color: '#ECCBA0' }}>
              <Section title="Effective Productivity Impact">
                Effective Productivity Impact = (Onboarding Duration + Vacancy Duration + Well-Being/Sick Leave) × Regional Labor Index × Service Complexity Multiplier
              </Section>
              <Divider />
              <Section title="Overtime Premium Load">
                Overtime Premium Load = Average Monthly Compensation × 0.5 × (Vacancy Duration / 30)
              </Section>
              <Divider />
              <Section title="Regional Labor Index">
                A scaling factor reflecting wage differentials by destination. Default = 1.0; Tier-1 metros may range 1.1–1.3.
              </Section>
              <Divider />
              <Section title="Service Complexity Multiplier">
                Captures luxury service intensity by brand/category. Typical range: 1.0 (select service) to 1.4 (ultra luxury).
              </Section>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-serif text-lg mb-1" style={{ color: '#D4AF37' }}>{title}</h3>
      <p className="text-[rgba(236,203,160,0.9)]">{children}</p>
    </div>
  );
}

function Divider() {
  return <div className="my-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />;
}
