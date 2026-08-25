import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useI18n } from '../context/I18nContext';
import { api } from '../services/api';
import { PERSONAS, LANGUAGES } from '../utils/preferences';
import ChildDashboard from '../components/child/ChildDashboard';

export default function DashboardPage() {
  const { user } = useUser();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      navigate('/setup');
      return;
    }
    Promise.all([
      api.getDashboard(user.id),
      api.getLatestAssessment(user.id),
      api.recommend(user.id).catch(() => null),
      api.getActivities({ persona: user.persona, language: user.language }).catch(() => ({ activities: [] })),
    ]).then(([dash, assessment, rec, acts]) => {
      setDashboard(dash.dashboard);
      setActivities(acts?.activities || []);
      if (!assessment.assessment) {
        setRecommendation(null);
      } else if (rec?.recommendation) {
        setRecommendation(rec.recommendation);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [user, navigate]);

  const personaLabel = PERSONAS.find((p) => p.id === user?.persona);
  const langLabel = LANGUAGES.find((l) => l.id === user?.language);

  const startRecommended = () => {
    if (recommendation?.activityId) {
      navigate(`/activity/${recommendation.activityId}`, { state: { recommendation } });
    }
  };

  if (loading) return <p>{t('common.loading')}</p>;
  if (!dashboard) return <p className="error-text">{t('common.error')}</p>;

  const hasAssessment = dashboard.assessmentSummary !== null;

  if (user?.persona === 'child') {
    return (
      <ChildDashboard
        user={user}
        dashboard={dashboard}
        recommendation={recommendation}
        activities={activities}
      />
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="welcome-text">
          <p className="eyebrow">{t('dashboard.welcome')} 👋</p>
          <h1>{user.name}</h1>
        </div>
        <div className="context-indicator">
          <span>{personaLabel ? t(personaLabel.labelKey) : ''} · {langLabel ? t(langLabel.labelKey) : ''}</span>
          <button className="text-btn" type="button" onClick={() => navigate('/settings')}>
            {t('common.changeSettings')}
          </button>
        </div>
      </header>

      {!hasAssessment && (
        <section className="dashboard-card today-plan">
          <p>{t('dashboard.noAssessment')}</p>
          <button className="btn-primary" type="button" onClick={() => navigate('/assessment')}>
            {t('dashboard.goAssessment')}
          </button>
        </section>
      )}

      {hasAssessment && recommendation && (
        <div className="dashboard-grid">
          <section className="dashboard-card today-plan">
            <h2>{t('dashboard.plan')}</h2>
            <div className="plan-stats">
              <span className="stat-highlight">{dashboard.completedCount} {t('dashboard.activities')}</span>
              <span className="stat-time">{Math.round(dashboard.avgAccuracy)}% {t('progress.accuracy').toLowerCase()}</span>
            </div>
            <button className="btn-primary" type="button" onClick={startRecommended}>
              {t('dashboard.startActivity')}
            </button>
          </section>

          <section className="dashboard-card recommended">
            <p className="kicker">{t('dashboard.recommended')}</p>
            <h2>{recommendation.topic} · {recommendation.difficulty}</h2>
            <p className="card-desc">{recommendation.reason}</p>
            <button className="btn-secondary" type="button" onClick={startRecommended}>
              {t('dashboard.startActivity')}
            </button>
          </section>

          <section className="dashboard-card progress-snapshot">
            <h2>{t('dashboard.progressSnapshot')}</h2>
            <div className="progress-list">
              {dashboard.progress.length ? dashboard.progress.map((prog) => (
                <div key={prog.skill} className="progress-item">
                  <div className="progress-label">
                    <span>{prog.skill}</span>
                    <span>{prog.accuracy}%</span>
                  </div>
                  <div className="progress-bar-container" aria-hidden="true">
                    <div className="progress-bar-fill" style={{ width: `${prog.accuracy}%` }} />
                  </div>
                </div>
              )) : (
                <p className="card-desc">{t('progress.none')}</p>
              )}
            </div>
          </section>
        </div>
      )}

      {dashboard.recentAttempts?.length > 0 && (
        <section className="continue-learning">
          <div className="section-header">
            <h2>{t('dashboard.continueLearning')}</h2>
            <button className="text-btn" type="button" onClick={() => navigate('/progress')}>
              {t('dashboard.viewAll')}
            </button>
          </div>
          <div className="activity-carousel">
            {dashboard.recentAttempts.map((item) => (
              <div key={item.id} className="activity-card">
                <h3>{item.title}</h3>
                <p>{item.topic} · {item.score}%</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
