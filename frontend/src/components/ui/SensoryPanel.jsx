export default function SensoryPanel({ prefs, onChange, t }) {
  const toggle = (key) => onChange({ [key]: !prefs[key] });

  return (
    <section className="sensory-panel" aria-labelledby="sensory-heading">
      <h2 id="sensory-heading">{t('setup.sensoryTitle')}</h2>
      <div className="sensory-grid">
        <label className="sensory-row">
          <span>{t('sensory.textSize')}</span>
          <select
            value={prefs.textSize}
            onChange={(e) => onChange({ textSize: e.target.value })}
          >
            <option value="small">{t('size.small')}</option>
            <option value="medium">{t('size.medium')}</option>
            <option value="large">{t('size.large')}</option>
            <option value="xlarge">{t('size.xlarge')}</option>
          </select>
        </label>

        {[
          ['soundEnabled', 'sensory.sound'],
          ['animationsEnabled', 'sensory.animations'],
          ['reducedMotion', 'sensory.reducedMotion'],
          ['highContrast', 'sensory.highContrast'],
          ['calmMode', 'sensory.calmMode'],
        ].map(([key, labelKey]) => (
          <label className="sensory-row" key={key}>
            <span>{t(labelKey)}</span>
            <button
              type="button"
              className={`toggle-btn ${prefs[key] ? 'is-on' : ''}`}
              onClick={() => toggle(key)}
              aria-pressed={prefs[key]}
            >
              {prefs[key] ? t('sensory.on') : t('sensory.off')}
            </button>
          </label>
        ))}
      </div>
    </section>
  );
}
