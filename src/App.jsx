import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { lazy, Suspense } from 'react';

const SIPCalculator = lazy(() => import('./calculators/SIPCalculator'));
const LumpSumCalculator = lazy(() => import('./calculators/LumpSumCalculator'));
const SWPCalculator = lazy(() => import('./calculators/SWPCalculator'));
const StepUpSIPCalculator = lazy(() => import('./calculators/StepUpSIPCalculator'));
const GoalPlannerCalculator = lazy(() => import('./calculators/GoalPlannerCalculator'));
const CAGRCalculator = lazy(() => import('./calculators/CAGRCalculator'));

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('smartmf-theme') || 'dark');
  useEffect(() => { localStorage.setItem('smartmf-theme', theme); }, [theme]);
  const toggle = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);
  return { theme, toggle };
}

const TABS = [
  { id: 'sip', icon: '📈', labelKey: 'sip', descKey: 'sip_desc', component: SIPCalculator },
  { id: 'lumpsum', icon: '💰', labelKey: 'lumpsum', descKey: 'lumpsum_desc', component: LumpSumCalculator },
  { id: 'swp', icon: '🏦', labelKey: 'swp', descKey: 'swp_desc', component: SWPCalculator },
  { id: 'stepup', icon: '🚀', labelKey: 'stepup', descKey: 'stepup_desc', component: StepUpSIPCalculator },
  { id: 'goal', icon: '🎯', labelKey: 'goal', descKey: 'goal_desc', component: GoalPlannerCalculator },
  { id: 'cagr', icon: '📊', labelKey: 'cagr', descKey: 'cagr_desc', component: CAGRCalculator },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'मराठी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'gu', label: 'ગુજરાતી' },
];

/* ─── Navbar ─────────────────────────────────────────────────── */
function Navbar({ theme, onToggle }) {
  const { t, i18n } = useTranslation();
  const isLight = theme === 'light';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#" className="navbar-logo">
          <div className="logo-icon">📉</div>
          <span>{t('app.title')}</span>
          <span className="navbar-badge">{t('app.badge')}</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href="#tools" className="navbar-link">{t('app.tools')}</a>
          <a href="#faq" className="navbar-link">{t('app.faq')}</a>

          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            style={{
              padding: '0.2rem 0.5rem', fontSize: '0.8rem', width: 'auto',
              borderRadius: 'var(--r-full)', background: 'var(--bg-glass)',
              borderColor: 'var(--border)', color: 'var(--text-primary)'
            }}
          >
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>

          <button className="theme-toggle" onClick={onToggle} aria-label="Toggle theme">
            <span>{isLight ? '🌙' : '☀️'}</span>
            <div className={`theme-toggle-track ${isLight ? 'on' : ''}`}>
              <div className={`theme-toggle-thumb ${isLight ? 'on' : 'off'}`} />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
function Hero() {
  const { t } = useTranslation();
  return (
    <div className="hero">
      <div className="hero-grid-lines" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-eyebrow">
        <span>✨</span> {t('hero.eyebrow')}
      </div>

      <h1>
        {t('hero.title1')}{' '}
        <span className="grad-text">{t('hero.titleSmarter')}</span>
        {' '}{t('hero.title2')}
        <br />
        <span className="grad-text">{t('hero.titleDecisions')}</span> {t('hero.titleToday')}
      </h1>

      <p>{t('hero.desc')}</p>

      <div className="hero-stats">
        {[
          { value: '6', label: t('hero.calc') },
          null,
          { value: '100%', label: t('hero.free') },
          null,
          { value: '₹0', label: t('hero.hidden') },
          null,
          { value: '∞', label: t('hero.scenarios') },
        ].map((s, i) =>
          s === null
            ? <div key={i} className="hero-divider" />
            : (
              <div key={i} className="hero-stat" style={{ textAlign: 'center' }}>
                <div className="hero-stat-value">{s.value}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            )
        )}
      </div>
    </div>
  );
}

/* ─── Tab Strip ──────────────────────────────────────────────── */
function CalcTabStrip({ active, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="calc-tabs-wrapper" id="tools">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`calc-tab ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span>{tab.icon}</span>
          <span>{t(`tabs.${tab.labelKey}`)}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── Active header ──────────────────────────────────────────── */
function ActiveTabHeader({ tab }) {
  const { t } = useTranslation();
  return (
    <div className="active-tab-header">
      <h2>
        <span>{tab.icon}</span>
        {t(`tabs.${tab.labelKey}`)} {t('common.calculator')}
      </h2>
      <p>{t(`tabs.${tab.descKey}`)}</p>
    </div>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'What is SIP?', a: 'A Systematic Investment Plan (SIP) lets you invest a fixed amount in a mutual fund every month. It benefits from rupee cost averaging and the power of compounding.' },
  { q: 'SIP vs Lump Sum — which is better?', a: 'SIP spreads your investment over time, reducing market-timing risk. Lump sum invests all at once — it can yield higher returns if timed well but carries more risk.' },
  { q: 'What is SWP?', a: 'A Systematic Withdrawal Plan lets you withdraw a fixed amount periodically from your mutual fund corpus — ideal for generating regular retirement income.' },
  { q: 'What is CAGR?', a: 'Compounded Annual Growth Rate is the rate at which an investment must grow each year to reach its end value from its start. It smooths out volatility for apples-to-apples comparison.' },
  { q: 'Are these calculations accurate?', a: 'These projections use assumed constant return rates for illustration. Actual mutual fund returns vary. Always consult a SEBI-registered financial advisor before investing.' },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  const { t } = useTranslation();
  return (
    <section id="faq" style={{ padding: '3rem 0 1rem', maxWidth: 740, margin: '0 auto' }}>
      <div className="section-title">{t('app.faq')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {FAQS.map((faq, i) => (
          <div key={i} className="faq-item" onClick={() => setOpen(open === i ? null : i)}>
            <div className="faq-q">
              <span>{faq.q}</span>
              <i className={`faq-chevron${open === i ? ' open' : ''}`}>▾</i>
            </div>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  className="faq-a"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  {faq.a}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div><strong>{t('app.title')} {t('common.calculator')}</strong> — Built for investors, by design</div>
      <div className="footer-divider">────────────────────────────────────</div>
      <div>
        ⚠️ <em>For educational purposes only. Not financial advice.</em>
      </div>
      <div style={{ marginTop: '0.5rem', color: 'var(--p-7)' }}>
        Mutual fund investments are subject to market risks. Read all scheme related documents carefully.
      </div>
    </footer>
  );
}

/* ─── App Root ───────────────────────────────────────────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState('sip');
  const { theme, toggle } = useTheme();
  const tab = TABS.find(t => t.id === activeTab);
  const Comp = tab?.component;

  return (
    <div className="app-shell" data-theme={theme}>
      <Navbar theme={theme} onToggle={toggle} />
      <main className="main-content">
        <Hero />
        <CalcTabStrip active={activeTab} onChange={setActiveTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + '-header'}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveTabHeader tab={tab} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {Comp && (
              <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>Loading calculator...</div>}>
                <Comp />
              </Suspense>
            )}
          </motion.div>
        </AnimatePresence>

        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
