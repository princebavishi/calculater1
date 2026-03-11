import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FAQS = [
  { q: 'What is SIP?', a: 'A Systematic Investment Plan (SIP) lets you invest a fixed amount in a mutual fund every month. It benefits from rupee cost averaging and the power of compounding.' },
  { q: 'SIP vs Lump Sum — which is better?', a: 'SIP spreads your investment over time, reducing market-timing risk. Lump sum invests all at once — it can yield higher returns if timed well but carries more risk.' },
  { q: 'What is SWP?', a: 'A Systematic Withdrawal Plan lets you withdraw a fixed amount periodically from your mutual fund corpus — ideal for generating regular retirement income.' },
  { q: 'What is CAGR?', a: 'Compounded Annual Growth Rate is the rate at which an investment must grow each year to reach its end value from its start. It smooths out volatility for apples-to-apples comparison.' },
  { q: 'Are these calculations accurate?', a: 'These projections use assumed constant return rates for illustration. Actual mutual fund returns vary. Always consult a SEBI-registered financial advisor before investing.' },
];

export default function FAQ() {
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
