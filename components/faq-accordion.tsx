'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import type { FaqItem } from '@/components/sections/geo-faq-data';

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {items.map((item, i) => {
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
                  maxWidth: '720px',
                }}
              >
                {item.a}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
