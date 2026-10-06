'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteContent, type SiteContentRow } from '@/lib/useSiteContent';
import { fontFamilyWithFallback, isUntranslated } from '@/lib/content';
import { NAV_CONTENT_KEYS, NAV_ITEMS, SITE_BYLINE_DEFAULT, SITE_BYLINE_KEY, SITE_LOGO_DEFAULT } from '@/lib/navigation';
import BurgerMenu from './BurgerMenu';
import DynamicText from './DynamicText';

interface HeaderProps {
  isEditing?: boolean;
  selectedKey?: string | null;
  onSelectKey?: (key: string) => void;
  onUpdateText?: (key: string, value: string) => void;
  dbContent?: SiteContentRow[];
  preview?: boolean;
}

function EditableLabel({
  dbKey,
  value,
  fallback,
  isEditing,
  selectedKey,
  onSelectKey,
  onUpdateText,
  style,
  className,
}: {
  dbKey: string;
  value: string;
  fallback: string;
  isEditing: boolean;
  selectedKey: string | null;
  onSelectKey: (key: string) => void;
  onUpdateText: (key: string, value: string) => void;
  style?: CSSProperties;
  className?: string;
}) {
  const text = value || fallback;
  const isSelected = isEditing && selectedKey === dbKey;

  if (!isEditing) {
    return <span style={style} className={className}>{text}</span>;
  }

  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelectKey(dbKey);
      }}
      onBlur={(e) => onUpdateText(dbKey, e.currentTarget.innerText || '')}
      style={style}
      className={`${className} outline-none cursor-text rounded-xs ${
        isSelected ? 'ring-2 ring-sage/50 bg-sage/15' : 'hover:bg-black/5'
      }`}
    >
      {text}
    </span>
  );
}

export default function Header({
  isEditing = false,
  selectedKey = null,
  onSelectKey = () => {},
  onUpdateText = () => {},
  dbContent = [],
  preview = false,
}: HeaderProps) {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const fetched = useSiteContent(isEditing ? [] : NAV_CONTENT_KEYS);
  const rows = isEditing ? dbContent : fetched;

  useEffect(() => {
    if (isEditing) return;
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEditing]);

  const row = (key: string): SiteContentRow | undefined => rows.find((r) => r.key === key);
  const text = (key: string, fallback: string): string => {
    const item = row(key);
    // EN identique au FR (traduction jamais faite) → libellé codé en dur.
    if (!item || (language === 'en' && isUntranslated(item))) return fallback;
    return ((language === 'fr' ? item.value_fr : item.value_en) || '').trim() || fallback;
  };
  const styleOf = (key: string): CSSProperties | undefined => {
    const item = row(key);
    if (!item) return undefined;
    return { fontFamily: fontFamilyWithFallback(item.font_family), fontWeight: item.is_bold ? 'bold' : undefined };
  };

  const solid = preview || isEditing || scrolled;
  const shell = preview || isEditing ? 'relative' : 'fixed top-0 left-0 right-0';
  const label = solid ? 'text-charcoal' : 'text-white';

  const languageButton = (code: 'fr' | 'en', text_label: string) => (
    <button
      key={code}
      type="button"
      onClick={() => setLanguage(code)}
      aria-pressed={language === code}
      className={`font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase transition-opacity duration-300 ${
        solid ? 'text-charcoal' : 'text-white'
      } ${language === code ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
    >
      {text_label}
    </button>
  );

  const navLink = (item: (typeof NAV_ITEMS)[number], children: ReactNode, className: string) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link
        href={item.href}
        onClick={(e) => isEditing && e.preventDefault()}
        className={`${className} transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <header className={`${shell} z-50`}>
      <div
        className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-3 md:px-8 md:py-4 transition-colors duration-500 ${
          solid ? 'bg-[#fcf7f3]/90 backdrop-blur-md border-b border-charcoal/10' : ''
        }`}
      >
        {/* LOGO — GAUCHE */}
        <Link
          href="/"
          onClick={(e) => isEditing && e.preventDefault()}
          className={`shrink-0 flex flex-col items-start gap-0.5 transition-colors duration-500`}
        >
          <span className={`font-sans text-[9px] md:text-[10px] tracking-[0.42em] uppercase ${label}`}>
            {SITE_LOGO_DEFAULT}
          </span>
          <DynamicText
            dbKey={SITE_BYLINE_KEY}
            as="span"
            isEditing={isEditing}
            selectedKey={selectedKey}
            onSelectKey={onSelectKey}
            onUpdateText={onUpdateText}
            dbContent={dbContent}
            defaultText={SITE_BYLINE_DEFAULT}
            className={`font-sans text-[8px] md:text-[9px] tracking-[0.24em] ${
              solid ? 'text-charcoal/55' : 'text-white/70'
            }`}
          />
        </Link>

        {/* MENU — CENTRE (desktop) */}
        <nav
          className={`flex-1 items-center justify-center gap-6 xl:gap-9 ${
            preview || isEditing ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {NAV_ITEMS.map((item) =>
            navLink(
              item,
              <EditableLabel
                key={item.dbKey}
                dbKey={item.dbKey}
                value={text(item.dbKey, language === 'fr' ? item.labelFr : item.labelEn)}
                fallback={language === 'fr' ? item.labelFr : item.labelEn}
                isEditing={isEditing}
                selectedKey={selectedKey}
                onSelectKey={onSelectKey}
                onUpdateText={onUpdateText}
                style={styleOf(item.dbKey)}
                className={`font-sans text-[9px] lg:text-[10px] xl:text-[11px] tracking-[0.34em] uppercase font-light ${label}`}
              />,
              'whitespace-nowrap'
            )
          )}
        </nav>

        {/* LANGUE — DROITE (abréviations) */}
        <div className="shrink-0 flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2.5">
            {languageButton('en', 'EN')}
            <span className={`font-sans text-[9px] ${solid ? 'text-charcoal/25' : 'text-white/25'}`}>/</span>
            {languageButton('fr', 'FR')}
          </div>

          {/* MENU BURGER — mobile / tablette uniquement */}
          <BurgerMenu light={solid} />
        </div>
      </div>
    </header>
  );
}
