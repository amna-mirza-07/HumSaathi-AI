import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../context/I18nContext';

const navItems = [
  { path: '/dashboard', labelKey: 'nav.dashboard' },
  { path: '/progress', labelKey: 'nav.progress' },
  { path: '/settings', labelKey: 'nav.settings' },
  { path: '/parent', labelKey: 'nav.parent' },
];

export default function AppShell({ children }) {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/" aria-label={`${t('app.name')} home`}>
          <span className="brand-mark" aria-hidden="true">H</span>
          <span>{t('app.name').replace(' AI', '')} <em>AI</em></span>
        </Link>
        <span className="status-chip">{t('app.tagline')}</span>
      </header>

      <div className="workspace">
        <aside className="sidebar" aria-label="Main navigation">
          <p className="sidebar-label">{t('nav.home')}</p>
          <nav>
            {navItems.map((item) => (
              <button
                className={`nav-item ${location.pathname === item.path ? 'is-active' : ''}`}
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                <span className="nav-dot" aria-hidden="true" />
                {t(item.labelKey)}
              </button>
            ))}
          </nav>
        </aside>

        <main className="main-content" id="main">
          {children}
        </main>
      </div>
    </div>
  );
}
