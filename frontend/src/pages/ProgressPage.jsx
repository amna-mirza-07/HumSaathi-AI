import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useI18n } from '../context/I18nContext';
import { api } from '../services/api';

export default function ProgressPage() {
  const { user } = useUser();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      navigate('/setup');
      return;
    }
    api.getDashboard(user.id)
      .then((data) => setDashboard(data.dashboard))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <p>{t('common.loading')}</p>;
  if (!dashboard) return <p className="error-text">{t('common.error')}</p>;

  return (
    <div className="progress-page">
      <p className="eyebrow">{t('nav.progress')}</p>
      <h1>{t('progress.title')}</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">{t('progress.completed')}</span>
          <span className="stat-value">{dashboard.completedCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{t('progress.accuracy')}</span>
          <span className="stat-value">{dashboard.avgAccuracy}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{t('progress.level')}</span>
          <span className="stat-value">{dashboard.currentLevel}</span>
        </div>
      </div>

      <section className="dashboard-card">
        <h2>{t('progress.strongest')}</h2>
        <p>{dashboard.strongest?.skill || '—'} ({dashboard.strongest?.accuracy ?? 0}%)</p>
      </section>

      <section className="dashboard-card">
        <h2>{t('progress.needsPractice')}</h2>
        <p>{dashboard.needsPractice?.skill || '—'} ({dashboard.needsPractice?.accuracy ?? 0}%)</p>
      </section>

      <section className="dashboard-card">
        <h2>{t('progress.recent')}</h2>
        {dashboard.recentAttempts?.length ? (
          <ul className="recent-list">
            {dashboard.recentAttempts.map((a) => (
              <li key={a.id}>{a.title} — {a.score}% — {a.difficulty}</li>
            ))}
          </ul>
        ) : (
          <p>{t('progress.none')}</p>
        )}
      </section>
    </div>
  );
}
