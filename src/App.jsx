import { useMemo, useRef, useState } from 'react';
import Hero from './components/Hero';
import LogicDrawer from './components/LogicDrawer';
import SetupSection from './components/SetupSection';
import OperationsAndResults from './components/OperationsAndResults';

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [setup, setSetup] = useState({});
  const [ops, setOps] = useState({});

  const setupRef = useRef(null);
  const opsRef = useRef(null);

  const totalFields = 8 + 7; // setup + ops fields considered
  const filledCount = useMemo(() => {
    const s = ['location','category','affiliation','brand','profile','keys','team','properties'].filter((k) => !!setup[k]);
    const o = ['exits','avgComp','recruit','training','onboard','vacancy','wellness'].filter((k) => !!ops[k]);
    return s.length + o.length;
  }, [setup, ops]);
  const confidence = Math.min(100, (filledCount / totalFields) * 100);

  const onSetupChange = (k, v) => setSetup((prev) => ({ ...prev, [k]: v }));
  const onOpsChange = (k, v) => setOps((prev) => ({ ...prev, [k]: v }));

  const goToOps = () => {
    setCurrentStep(1);
    opsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onOpenLogic = () => setDrawerOpen(true);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1D0F2F' }}>
      <Hero onOpenLogic={onOpenLogic} confidence={confidence} currentStep={currentStep} />
      <LogicDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div ref={setupRef}>
        <SetupSection values={setup} onChange={onSetupChange} onNext={goToOps} />
      </div>

      <div ref={opsRef}>
        <OperationsAndResults
          values={ops}
          onChange={(k, v) => {
            onOpsChange(k, v);
            if (currentStep < 1) setCurrentStep(1);
          }}
          setup={setup}
          onConfidenceBump={() => {}}
        />
      </div>

      <footer className="py-8 text-center" style={{ backgroundColor: '#1D0F2F', color: 'rgba(212,175,55,0.7)' }}>
        <p className="text-xs font-serif">Built by Kintsug — Restoring Operational Harmony in Luxury Hospitality.</p>
      </footer>
    </div>
  );
}
