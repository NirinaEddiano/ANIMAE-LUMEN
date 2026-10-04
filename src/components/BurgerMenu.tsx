'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteContent } from '@/lib/useSiteContent';
import { isUntranslated } from '@/lib/content';
import { NAV_CONTENT_KEYS, NAV_ITEMS } from '@/lib/navigation';

export default function BurgerMenu({ light = false }: { light?: boolean }) {
  // Le panneau se referme seul quand le pathname change : on compare le chemin
  // au moment de l'ouverture pendant le render, sans effet ni setState.
  const [menu, setMenu] = useState({ open: false, path: '' });
  const pathname = usePathname();
  const { language } = useLanguage();
  const rows = useSiteContent(NAV_CONTENT_KEYS);

  const open = menu.open && menu.path === pathname;
  const toggle = () => setMenu({ open: !open, path: pathname });

  const text = (key: string, fallback: string): string => {
    const item = rows.find((r) => r.key === key);
    // EN identique au FR (traduction jamais faite) → libellé codé en dur.
    if (!item || (language === 'en' && isUntranslated(item))) return fallback;
    return ((language === 'fr' ? item.value_fr : item.value_en) || '').trim() || fallback;
  };

  // Verrouillage du scroll quand le panneau est ouvert.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {/* Trait unique très fin — visible uniquement mobile / tablette */}
      <button
        onClick={toggle}
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        className="lg:hidden shrink-0 flex flex-col items-center justify-center w-8 h-8 gap-[6px] group"
      >
        <span
          className={`block w-6 h-px transition-all duration-300 ${
            light ? 'bg-charcoal/50 group-hover:bg-charcoal' : 'bg-white/60 group-hover:bg-white'
          } ${open ? 'translate-y-[3.5px] rotate-45' : ''}`}
        />
        <span
          className={`block w-6 h-px transition-all duration-300 ${
            light ? 'bg-charcoal/50 group-hover:bg-charcoal' : 'bg-white/60 group-hover:bg-white'
          } ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`}
        />
      </button>

      {/* Voile discret — ne recouvre pas la page, s'efface au clic */}
      {open && (
        <button
          onClick={toggle}
          aria-hidden="true"
          tabIndex={-1}
          className="fixed inset-0 z-[55] bg-charcoal/15 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Panneau compact aligné à droite — hauteur limitée au contenu */}
      <div
        className={`fixed top-0 right-0 z-[60] w-[min(78vw,17rem)] h-auto bg-[#fcf7f3]/97 backdrop-blur-md border-l border-charcoal/10 shadow-[-12px_0_40px_-24px_rgba(0,0,0,0.35)] transition-all duration-400 ease-out lg:hidden ${
          open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col px-6 pt-4 pb-7">
          <div className="h-px w-full bg-charcoal/10 mb-5" />

          <nav className="flex flex-col">
            {NAV_ITEMS.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggle}
                  className={`group flex items-baseline gap-3 py-3 border-b border-charcoal/[0.07] last:border-b-0 transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-55 hover:opacity-100'
                  }`}
                >
                  <span className="font-sans text-[8px] tracking-[0.2em] text-charcoal/30 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`font-sans text-[11px] tracking-[0.3em] uppercase font-light text-charcoal ${
                      isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                    }`}
                  >
                    {text(item.dbKey, language === 'fr' ? item.labelFr : item.labelEn)}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
