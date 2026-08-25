import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useI18n } from '../context/I18nContext';

export default function LandingPage() {
  const { user } = useUser();
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="landing">
      <p className="eyebrow">{t('landing.eyebrow')}</p>
      <h1>
        {t('landing.title')}<br />
        <span>{t('landing.titleAccent')}</span>
      </h1>
      <p className="intro">{t('landing.intro')}</p>
      <p className="disclaimer">{t('app.disclaimer')}</p>

      <div className="landing-actions">
        {user?.setupComplete ? (
          <button className="btn-primary" type="button" onClick={() => navigate('/dashboard')}>
            {t('landing.continue')}
          </button>
        ) : (
          <Link className="btn-primary" to="/setup">{t('landing.getStarted')}</Link>
        )}
      </div>
    </div>
  );
}
