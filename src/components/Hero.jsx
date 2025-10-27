import { useEffect, useMemo } from 'react';
import Spline from '@splinetool/react-spline';
import { ChevronRight } from 'lucide-react';

export default function Hero({ onOpenLogic, confidence, currentStep }) {
  // Map step to labels and icons
  const steps = useMemo(
    () => [
      { key: 'setup', label: '🏨 Setup' },
      { key: 'ops', label: '👥 Operations' },
      { key: 'results', label: '📊 Results & Report' },
    ],
    []
  );

  const progress = useMemo(() => {
    const stepProgress = (currentStep / (steps.length - 1)) * 100;
    return Math.max(0, Math.min(100, stepProgress));
  }, [currentStep, steps.length]);

  useEffect(() => {
    // no-op: reserved for analytics/scroll sync
  }, [currentStep]);

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#1D0F2F' }}>
      {/* Spline Cover */}
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/qMOKV671Z1CM9yS7/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Gradient overlay to enhance readability - allow interactions with Spline */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(29,15,47,0.6)] via-[rgba(29,15,47,0.4)] to-[rgba(29,15,47,0.85)]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[980px] px-6 py-8">
        {/* Progress Bar */}
        <div className="w-full h-1 rounded-full overflow-hidden bg-gradient-to-r from-[rgba(212,175,55,0.25)] to-[rgba(212,175,55,0.05)]">
          <div
            className="h-1 bg-gradient-to-r from-[rgba(212,175,55,0.6)] to-[rgba(236,203,160,0.95)] shadow-[0_0_12px_rgba(212,175,55,0.6)]"
            style={{ width: `${progress}%`, transition: 'width 600ms ease, background 600ms ease' }}
          />
        </div>

        {/* Step Pills + Confidence */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {steps.map((s, idx) => (
              <div
                key={s.key}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  idx === currentStep
                    ? 'bg-[rgba(255,255,255,0.08)] text-[#ECCBA0] shadow-[0_0_12px_rgba(212,175,55,0.35)]'
                    : 'bg-[rgba(255,255,255,0.05)] text-[rgba(236,203,160,0.65)]'
                }`}
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {s.label}
              </div>
            ))}
          </div>
          <div className="text-sm" style={{ color: '#ECCBA0' }}>
            Data Confidence: <span className="font-semibold" style={{ color: '#D4AF37' }}>{Math.round(confidence)}%</span>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="mt-16 text-center">
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight" style={{ color: '#ECCBA0' }}>
            💎 Kintsug Workforce Intelligence Calculator
          </h1>
          <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto text-[rgba(236,203,160,0.9)]">
            Discover what operational chaos really costs — and how harmony restores value.
          </p>

          <div className="mt-6 flex items-center justify-center">
            <button
              onClick={onOpenLogic}
              className="group inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm"
              style={{
                color: '#ECCBA0',
                border: '1px solid rgba(212,175,55,0.55)',
                background: 'rgba(255,255,255,0.04)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                backdropFilter: 'blur(6px)'
              }}
            >
              View System Logic & Methodology
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
