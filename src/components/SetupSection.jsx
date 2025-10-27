import { useEffect } from 'react';

const cardStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)'
};

export default function SetupSection({ values, onChange, onNext }) {
  useEffect(() => {
    // progressive enhancements could go here
  }, []);

  const Field = ({ label, type = 'text', name, placeholder, options, hint }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm" style={{ color: '#ECCBA0' }}>{label}</label>
      {options ? (
        <select
          className="bg-transparent rounded-md px-3 py-2 outline-none focus:ring-1"
          style={{ color: '#ECCBA0', border: '1px solid rgba(255,255,255,0.12)' }}
          name={name}
          value={values[name] ?? ''}
          onChange={(e) => onChange(name, e.target.value)}
        >
          <option value="" className="bg-[#1D0F2F]">Select...</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#1D0F2F]">{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={values[name] ?? ''}
          onChange={(e) => onChange(name, e.target.value)}
          className="bg-transparent rounded-md px-3 py-2 outline-none focus:ring-1 placeholder:opacity-70 transition-shadow"
          style={{ color: '#ECCBA0', border: '1px solid rgba(255,255,255,0.12)' }}
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = hint || '')}
        />
      )}
    </div>
  );

  return (
    <section className="w-full flex justify-center py-12 md:py-16" style={{ backgroundColor: '#1D0F2F' }}>
      <div className="w-full max-w-[980px] px-6">
        <div className="rounded-xl p-6 md:p-8" style={cardStyle}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Location / Destination" name="location" options={[
              'Delhi NCR', 'Mumbai', 'Bengaluru', 'Goa', 'Dubai', 'Singapore'
            ]} />
            <Field label="Hotel Category (Stars)" name="category" options={['3 Star', '4 Star', '5 Star', 'Luxury']} />

            <Field label="Affiliation Type" name="affiliation" options={['Chain', 'Independent']} />
            <Field label="Hotel Brand / Group Name" name="brand" placeholder="e.g., Aman, Taj, Marriott" hint="e.g., Aman, Taj, Marriott" />

            <Field label="Property Profile" name="profile" options={[
              'Urban Business', 'Resort', 'Boutique', 'Convention'
            ]} />
            <Field label="Number of Keys (Rooms)" name="keys" type="number" placeholder="e.g., 120" hint="e.g., 120" />

            <Field label="Total Team Strength" name="team" type="number" placeholder="e.g., 160" hint="e.g., 160" />
            <Field label="Number of Properties" name="properties" type="number" placeholder="e.g., 1" hint="e.g., 1" />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className="rounded-full px-5 py-2 text-sm transition"
              onClick={onNext}
              style={{
                color: '#1D0F2F',
                background: 'linear-gradient(90deg, #D4AF37, #ECCBA0)',
                boxShadow: '0 6px 20px rgba(212,175,55,0.25)'
              }}
            >
              Next → Workforce Inputs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
