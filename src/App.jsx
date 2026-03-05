import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SIPCalculator from './calculators/SIPCalculator';
import LumpSumCalculator from './calculators/LumpSumCalculator';
import SWPCalculator from './calculators/SWPCalculator';
import StepUpSIPCalculator from './calculators/StepUpSIPCalculator';
import GoalPlannerCalculator from './calculators/GoalPlannerCalculator';
import CAGRCalculator from './calculators/CAGRCalculator';

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('smartmf-theme') || 'dark');
  useEffect(() => { localStorage.setItem('smartmf-theme', theme); }, [theme]);
  const toggle = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);
  return { theme, toggle };
}

const TABS = [
  { id: 'sip', icon: '📈', label: 'SIP', desc: 'Calculate how your monthly SIP grows over time', component: SIPCalculator },
  { id: 'lumpsum', icon: '💰', label: 'Lump Sum', desc: 'Project the future value of a one-time investment', component: LumpSumCalculator },
  { id: 'swp', icon: '🏦', label: 'SWP', desc: 'Plan your monthly income from a corpus', component: SWPCalculator },
  { id: 'stepup', icon: '🚀', label: 'Step-Up SIP', desc: 'See the power of increasing your SIP annually', component: StepUpSIPCalculator },
  { id: 'goal', icon: '🎯', label: 'Goal Planner', desc: 'Reverse-calculate the SIP needed for any life goal', component: GoalPlannerCalculator },
  { id: 'cagr', icon: '📊', label: 'CAGR', desc: 'Measure the true annualised growth of any investment', component: CAGRCalculator },
];

/* ─── Navbar ─────────────────────────────────────────────────── */
function Navbar({ theme, onToggle }) {
  const isLight = theme === 'light';
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#" className="navbar-logo">
          <div className="logo-icon">📉</div>
          <span>SmartMF</span>
          <span className="navbar-badge">CALCULATORS</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href="#tools" className="navbar-link">Tools</a>
          <a href="#faq" className="navbar-link">FAQ</a>
          {/* Theme toggle */}
          <button className="theme-toggle" onClick={onToggle} aria-label="Toggle theme">
            <span>{isLight ? '🌙' : '☀️'}</span>
            <div className={`theme-toggle-track ${isLight ? 'on' : ''}`}>
              <div className={`theme-toggle-thumb ${isLight ? 'on' : 'off'}`} />
            </div>
            <span style={{ fontSize: '0.78rem' }}>{isLight ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <div className="hero">
      <div className="hero-grid-lines" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-eyebrow">
        <span>✨</span> Free · No Login · Instant Results
      </div>

      <h1>
        Make{' '}
        <span className="grad-text">Smarter</span>
        {' '}Investment
        <br />
        <span className="grad-text">Decisions</span> Today
      </h1>

      <p>
        6 powerful mutual fund calculators — SIP, Lump Sum, SWP, Step-Up,
        Goal Planning &amp; CAGR. All in one beautiful, easy-to-use suite.
      </p>

      <div className="hero-stats">
        {[
          { value: '6', label: 'Calculators' },
          null,
          { value: '100%', label: 'Free to Use' },
          null,
          { value: '₹0', label: 'No Hidden Cost' },
          null,
          { value: '∞', label: 'Scenarios' },
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
  return (
    <div className="calc-tabs-wrapper" id="tools">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`calc-tab ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── Active header ──────────────────────────────────────────── */
function ActiveTabHeader({ tab }) {
  return (
    <div className="active-tab-header">
      <h2>
        <span>{tab.icon}</span>
        {tab.label} Calculator
      </h2>
      <p>{tab.desc}</p>
    </div>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'What is SIP?',
    a: 'A Systematic Investment Plan (SIP) lets you invest a fixed amount in a mutual fund every month. It benefits from rupee cost averaging and the power of compounding.'
  },
  {
    q: 'SIP vs Lump Sum — which is better?',
    a: 'SIP spreads your investment over time, reducing market-timing risk. Lump sum invests all at once — it can yield higher returns if timed well but carries more risk.'
  },
  {
    q: 'What is SWP?',
    a: 'A Systematic Withdrawal Plan lets you withdraw a fixed amount periodically from your mutual fund corpus — ideal for generating regular retirement income.'
  },
  {
    q: 'What is CAGR?',
    a: 'Compounded Annual Growth Rate is the rate at which an investment must grow each year to reach its end value from its start. It smooths out volatility for apples-to-apples comparison.'
  },
  {
    q: 'Are these calculations accurate?',
    a: 'These projections use assumed constant return rates for illustration. Actual mutual fund returns vary. Always consult a SEBI-registered financial advisor before investing.'
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ padding: '3rem 0 1rem', maxWidth: 740, margin: '0 auto' }}>
      <div className="section-title">Frequently Asked Questions</div>
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
  return (
    <footer className="footer">
      <div><strong>SmartMF Calculators</strong> — Built for investors, by design</div>
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
            {Comp && <Comp />}
          </motion.div>
        </AnimatePresence>

        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
