import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'بيتي للذكاء الاصطناعي — الذكاء الاصطناعي لإدارة المرافق والبناء في الخليج' },
  description:
    'بنية تشغيلية مدعومة بالذكاء الاصطناعي لمشغّلي إدارة المرافق ومشاريع البناء الكبرى في الخليج. نحمي هوامش العقود، ونسرّع التعبئة، ونعزز أداء اتفاقيات مستوى الخدمة على العقود التي تتجاوز 5 ملايين دولار.',
  alternates: {
    canonical: 'https://baytyai.com/ar',
    languages: {
      en: 'https://baytyai.com',
      ar: 'https://baytyai.com/ar',
      'ar-AE': 'https://baytyai.com/ar',
      'x-default': 'https://baytyai.com',
    },
  },
};

const KPIS = [
  { label: 'العقود المشمولة', value: '> 5 مليون دولار' },
  { label: 'نطاق استعادة الهامش', value: '1.8% – 4.6%' },
  { label: 'نافذة التعبئة', value: '90 يوماً' },
];

export default function ArabicLanding() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-white font-arabic">
      <section className="mx-auto w-full max-w-container px-6 pb-24 pt-32 md:px-12">
        <div className="flex flex-col gap-16 lg:flex-row-reverse lg:items-start lg:gap-24">
          {/* Main column */}
          <div className="flex flex-col gap-8 lg:max-w-screen-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bayty-600">
              البنية التشغيلية المدعومة بالذكاء الاصطناعي — الخليج
            </p>

            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight text-steel-900">
              بنية تشغيلية مدعومة بالذكاء الاصطناعي لإدارة المرافق ومشاريع البناء الكبرى في الخليج
            </h1>

            <p className="text-lg leading-loose text-steel-600">
              نحمي هوامش العقود، ونسرّع التعبئة، ونعزّز أداء اتفاقيات مستوى الخدمة لمشغّلي إدارة
              المرافق والبناء الذين يديرون عقوداً تتجاوز 5 ملايين دولار في السعودية والإمارات وبقية
              دول الخليج.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/#book"
                className="inline-flex items-center justify-center bg-bayty-500 px-8 py-4 text-base font-medium text-white transition-colors hover:bg-bayty-600"
              >
                احجز استشارة استراتيجية مدفوعة
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-bayty-600 transition-colors hover:text-steel-900"
              >
                English ←
              </Link>
            </div>

            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel-500">
              مبنية لمشغّلي رؤية 2030 ومحافظ المشاريع العملاقة في الخليج.
            </p>
          </div>

          {/* Operator snapshot */}
          <div className="w-full lg:max-w-[320px]">
            <div className="border border-steel-200 bg-white p-8">
              <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-bayty-600">
                لمحة تشغيلية
              </p>
              <div className="flex flex-col divide-y divide-ink-700">
                {KPIS.map((kpi) => (
                  <div key={kpi.label} className="py-4">
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-steel-500">
                      {kpi.label}
                    </p>
                    <p className="text-xl font-medium text-steel-900">{kpi.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
