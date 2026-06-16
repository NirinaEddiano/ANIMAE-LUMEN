'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function BackButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  const { language } = useLanguage();

  return (
    <button
      onClick={() => router.back()}
      className={`font-sans text-[11px] tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors duration-300 ${className}`}
    >
      &larr; {language === 'fr' ? 'Retour' : 'Back'}
    </button>
  );
}
