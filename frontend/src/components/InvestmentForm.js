import React, { useState } from 'react';

const STEPS = [
  {
    id: 'personal', title: 'Personal Profile', subtitle: 'Tell us about yourself',
    icon: '👤',
    fields: [
      { id: 'age', label: 'Your Age', type: 'number', placeholder: '28', min: 18, max: 80, hint: 'Determines investment horizon strategy' },
      { id: 'monthlyIncome', label: 'Monthly Income (₹)', type: 'number', placeholder: '75000', hint: 'Gross monthly take-home' },
      {
        id: 'incomeSource', label: 'Income Source', type: 'select', options: [
          { value: 'salaried', label: 'Salaried Employee' },
          { value: 'self-employed', label: 'Self Employed / Business' },
          { value: 'freelancer', label: 'Freelancer' },
          { value: 'investor', label: 'Investor / Retired' },
        ]
      },
    ]
  },
  {
    id: 'investment', title: 'Investment Details', subtitle: 'Define your investment plan',
    icon: '💰',
    fields: [
      { id: 'monthlySIP', label: 'Monthly SIP Amount (₹)', type: 'number', placeholder: '10000', hint: 'Suggested: 20% of monthly income' },
      { id: 'lumpsum', label: 'One-Time Investment (₹)', type: 'number', placeholder: '0', hint: 'Optional initial investment' },
      { id: 'existingPortfolio', label: 'Existing Investments (₹)', type: 'number', placeholder: '0', hint: 'Current mutual fund / equity portfolio value' },
    ]
  },
  {
    id: 'goals', title: 'Goals & Risk', subtitle: 'Define your financial goals',
    icon: '🎯',
    fields: [
      {
        id: 'investmentGoal', label: 'Primary Investment Goal', type: 'select', options: [
          { value: 'Wealth Creation', label: '🚀 Wealth Creation' },
          { value: 'Retirement Planning', label: '🏖️ Retirement Planning' },
          { value: 'Child Education', label: '🎓 Child Education' },
          { value: 'Tax Saving', label: '💸 Tax Saving (ELSS)' },
          { value: 'Short Term Goals', label: '📅 Short Term Goals' },
          { value: 'Emergency Fund', label: '🛡️ Emergency Fund' },
        ]
      },
      { id: 'investmentHorizon', label: 'Investment Horizon (Years)', type: 'number', placeholder: '10', min: 1, max: 40, hint: 'How many years do you plan to stay invested?' },
      {
        id: 'riskTolerance', label: 'Risk Tolerance', type: 'select', options: [
          { value: 'Conservative', label: '🔒 Conservative — Preserve capital' },
          { value: 'Moderate', label: '⚖️ Moderate — Balanced growth' },
          { value: 'Moderate-High', label: '📈 Moderate-High — Growth focused' },
          { value: 'Aggressive', label: '🔥 Aggressive — Maximum returns' },
        ]
      },
    ]
  }
];

const DEFAULTS = {
  age: '', monthlyIncome: '', incomeSource: 'salaried',
  monthlySIP: '', lumpsum: '0', existingPortfolio: '0',
  investmentGoal: 'Wealth Creation', investmentHorizon: '', riskTolerance: 'Moderate',
};

export default function InvestmentForm({ onSubmit, loading }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(DEFAULTS);
  const [errors, setErrors] = useState({});

  const currentStep = STEPS[step];

  const update = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }));
  };

  const validate = () => {
    const errs = {};
    const required = currentStep.fields.map(f => f.id);
    required.forEach(id => {
      if (!formData[id] && formData[id] !== 0) errs[id] = 'This field is required';
    });
    if (formData.age && (formData.age < 18 || formData.age > 80)) errs.age = 'Age must be between 18 and 80';
    if (formData.monthlyIncome && formData.monthlyIncome <= 0) errs.monthlyIncome = 'Income must be positive';
    if (formData.monthlySIP && formData.monthlySIP <= 0) errs.monthlySIP = 'SIP amount must be positive';
    return errs;
  };

  const next = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else onSubmit(formData);
  };

  const back = () => setStep(s => s - 1);

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto' }}>
      {/* Step indicators */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '36px', justifyContent: 'center' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px',
              background: i < step ? 'var(--accent-emerald)' : i === step ? 'var(--accent-blue)' : 'rgba(59,130,246,0.08)',
              color: i <= step ? 'white' : 'var(--text-muted)',
              border: i === step ? '2px solid rgba(59,130,246,0.4)' : '2px solid transparent',
              transition: 'all 0.3s',
              boxShadow: i === step ? '0 0 20px rgba(59,130,246,0.3)' : 'none',
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: '40px', height: '2px', background: i < step ? 'var(--accent-emerald)' : 'var(--border)', borderRadius: '1px', transition: 'all 0.3s' }} />
            )}
          </div>
        ))}
      </div>

      {/* Step header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }} key={step} className="animate-fade-up">
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>{currentStep.icon}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', marginBottom: '8px' }}>{currentStep.title}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{currentStep.subtitle}</p>
      </div>

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }} key={`fields-${step}`} className="animate-fade-up">
        {currentStep.fields.map((field) => (
          <div key={field.id} className="input-group">
            <label className="input-label">{field.label}</label>
            {field.type === 'select' ? (
              <select
                className="select-field"
                value={formData[field.id]}
                onChange={e => update(field.id, e.target.value)}
                style={{ borderColor: errors[field.id] ? 'var(--accent-rose)' : undefined }}
              >
                <option value="">Select...</option>
                {field.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                className="input-field"
                type={field.type}
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                value={formData[field.id]}
                onChange={e => update(field.id, e.target.value)}
                style={{ borderColor: errors[field.id] ? 'var(--accent-rose)' : undefined }}
              />
            )}
            {field.hint && !errors[field.id] && (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{field.hint}</span>
            )}
            {errors[field.id] && (
              <span style={{ fontSize: '12px', color: 'var(--accent-rose)' }}>⚠ {errors[field.id]}</span>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {step > 0 && (
          <button className="btn btn-outline" onClick={back} style={{ flex: 1, justifyContent: 'center' }}>
            ← Back
          </button>
        )}
        <button
          className={`btn ${step === STEPS.length - 1 ? 'btn-gold' : 'btn-primary'}`}
          onClick={next}
          disabled={loading}
          style={{ flex: 2, justifyContent: 'center' }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="loader" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
              Analyzing...
            </span>
          ) : step === STEPS.length - 1 ? '🔍 Analyze My Portfolio' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}