'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { FAQ_ITEMS } from './faq-data';

export default function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      style={{
        backgroundColor: '#0A1628',
        padding: '96px 24px 120px',
        borderTop: '0.5px solid rgba(201,168,76,0.15)',
      }}
    >
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: 'clamp(30px, 4.5vw, 44px)',
            lineHeight: 1.15,
            color: '#F8F6F1',
            marginBottom: '56px',
          }}
        >
          Frequently asked questions
        </motion.h2>

        <div>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.04 * i, ease: 'easeOut' }}
                style={{ borderBottom: '0.5px solid rgba(201,168,76,0.2)' }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '24px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                      fontWeight: 600,
                      fontSize: '20px',
                      color: '#F8F6F1',
                    }}
                  >
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    color="#C9A84C"
                    strokeWidth={1.5}
                    style={{
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.25s ease',
                    }}
                  />
                </button>
                {isOpen && (
                  <p
                    style={{
                      fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                      fontWeight: 300,
                      fontSize: '14px',
                      lineHeight: 1.75,
                      color: 'rgba(248,246,241,0.6)',
                      paddingBottom: '24px',
                      maxWidth: '680px',
                    }}
                  >
                    {item.a}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
