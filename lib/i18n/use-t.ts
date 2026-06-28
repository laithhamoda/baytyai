'use client';

import { useCallback } from 'react';

import ar from '@/messages/ar.json';
import en from '@/messages/en.json';

type Locale = 'en' | 'ar';
type Messages = typeof en;

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj) as string | undefined;
}

export function useT(locale: Locale = 'en') {
  const messages = (locale === 'ar' ? ar : en) as unknown as Record<string, unknown>;

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      let value = getNestedValue(messages, key) ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          value = value.replace(`{${k}}`, String(v));
        }
      }
      return value;
    },
    [messages],
  );

  return t;
}

// Server-side equivalent (no hook)
export function getT(locale: Locale = 'en') {
  const messages = (locale === 'ar' ? ar : en) as unknown as Record<string, unknown>;

  return function t(key: string, vars?: Record<string, string | number>): string {
    let value = getNestedValue(messages, key) ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        value = value.replace(`{${k}}`, String(v));
      }
    }
    return value;
  };
}

export type { Messages, Locale };
