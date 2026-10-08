'use client';

import { useLanguage } from '@/context/LanguageContext';
import { fontFamilyWithFallback, isHiddenKey, isUntranslated } from '@/lib/content';
import { supabase } from '@/lib/supabase';
import { useState, useEffect, type CSSProperties, type ReactNode } from 'react';

/** Champ de formulaire dont le libellé est modifiable depuis l'admin.
 *  L'input enfant n'est jamais touché, seule l'étiquette est éditable. */
function ContactField({
  labelKey,
  label,
  isEditing,
  selectedKey,
  onSelectKey,
  onUpdateText,
  style,
  children,
}: {
  labelKey: string;
  label: string;
  isEditing: boolean;
  selectedKey: string | null;
  onSelectKey: (key: string) => void;
  onUpdateText: (key: string, value: string) => void;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-2 text-left">
      <label
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText(labelKey, e.currentTarget.innerText || '')}
        onClick={(e) => {
          if (!isEditing) return;
          e.preventDefault();
          onSelectKey(labelKey);
        }}
        style={style}
        className={`font-sans text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-light text-neutral-400/90 outline-none rounded-xs whitespace-pre-wrap ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === labelKey ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// Toutes les clés utilisées par la page : le contenu est donc intégralement
// éditable depuis l'admin, et l'absence de ligne retombe sur le repli codé en dur.
const CONTACT_KEYS = [
  'contact_hero_image', 'contact_hero_tagline', 'contact_hero_heading', 'contact_hero_subheading',
  'contact_tagline', 'contact_heading', 'contact_email', 'contact_whatsapp', 'contact_instagram',
  'contact_image_1', 'contact_image_2',
  'contact_form_tagline', 'contact_form_heading',
  'contact_label_firstname', 'contact_label_lastname', 'contact_label_email',
  'contact_label_subject', 'contact_label_message', 'contact_btn_send', 'contact_btn_sending',
  'insta_tagline', 'insta_heading', 'insta_subheading', 'insta_btn_text',
];

const CONTACT_DEFAULTS: Record<string, { fr: string; en: string }> = {
  contact_hero_tagline: { fr: "L'espace de rencontre", en: 'The meeting space' },
  contact_hero_heading: { fr: 'Prendre contact', en: 'Get in touch' },
  contact_hero_subheading: {
    fr: "Faisons connaissance et co-créons un espace de présence pour immortaliser votre lumière.",
    en: 'Let us connect and co-create a space of presence to immortalize your light.',
  },
  contact_tagline: { fr: "L'invitation au partage", en: 'Invitation to share' },
  contact_heading: { fr: 'S’unir & échanger', en: 'Unite & connect' },
  contact_form_tagline: { fr: 'Écrire une histoire', en: 'Write a story' },
  contact_form_heading: { fr: 'Votre projet', en: 'Your project' },
  contact_label_firstname: { fr: 'Prénom', en: 'First name' },
  contact_label_lastname: { fr: 'Nom', en: 'Last name' },
  contact_label_email: { fr: 'Adresse email', en: 'Email address' },
  contact_label_subject: { fr: 'Sujet', en: 'Subject' },
  contact_label_message: {
    fr: 'Votre message (retraite, union sacrée, portrait introspectif…)',
    en: 'Your message (retreat, sacred union, introspective portrait…)',
  },
  contact_btn_send: { fr: 'Initier la connexion', en: 'Initiate connection' },
  contact_btn_sending: { fr: 'Envoi…', en: 'Sending…' },
};

const CONTACT_STATUS: Record<'fr' | 'en', { success: string; error: string }> = {
  fr: {
    success: 'Votre message a bien été envoyé.',
    error: "Une erreur est survenue lors de l'envoi du message.",
  },
  en: {
    success: 'Your message has been sent successfully.',
    error: 'An error occurred while sending your message.',
  },
};

const CONTACT_IMAGES: Record<string, string> = {
  contact_hero_image:
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
  contact_image_1:
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
  contact_image_2:
    'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=600&q=80',
};

const CONTACT_LINKS: Record<string, string> = {
  contact_email: 'animaelumen@outlook.com',
  contact_whatsapp: '+33 6 83 84 38 07',
  contact_instagram: '@animaelumen',
};

export default function ContactPage({ 
  isEditing = false, 
  selectedKey = null, 
  onSelectKey = () => {}, 
  onUpdateText = () => {},
  dbContent = [] 
}: { 
  isEditing?: boolean; 
  selectedKey?: string | null; 
  onSelectKey?: (key: string) => void; 
  onUpdateText?: (key: string, value: string) => void;
  dbContent?: any[];
}) {
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: CONTACT_STATUS[language].success });
        setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: CONTACT_STATUS[language].error });
    } finally {
      setSending(false);
    }
  };

  // --- CHARGEMENT DYNAMIQUE DES TEXTES & STYLES ---
  const [localDbContent, setLocalDbContent] = useState<any[]>([]);

  useEffect(() => {
    if (isEditing) return; // En mode admin, les données viennent déjà de l'admin
    supabase.from('site_content').select('*').in('key', CONTACT_KEYS).then(({ data }) => {
      if (data) setLocalDbContent(data);
    });
  }, [isEditing]);

  const activeContent = isEditing ? dbContent : localDbContent;

  // Masquage choisis par l'administrateur : un bloc disparait du site
  // public quand TOUS ses contenus sont masques. La condition 'every'
  // evite de laisser un trou de mise en page si un seul element reste.
  const hidden = (...keys: string[]) => keys.every((k) => isHiddenKey(activeContent, k));

  const findRow = (key: string) => activeContent.find((i: { key: string }) => i.key === key);

  /** Texte bilingue éditable : repli codé en dur si la ligne est absente,
   *  et repli anglais si value_en n'est qu'une copie du français. */
  const t = (key: string, override?: { fr?: string; en?: string }): string => {
    const fallback = override ?? CONTACT_DEFAULTS[key] ?? { fr: '', en: '' };
    const item = findRow(key) as { value_fr?: string; value_en?: string; is_deleted?: boolean } | undefined;
    if (!item) return fallback[language] ?? '';
    if (item.is_deleted) return '';
    if (language === 'en' && isUntranslated(item as any)) return fallback.en ?? '';
    return ((item[`value_${language}`] as string) || '').trim() || fallback[language] || '';
  };

  // Coordonnées, liens et images : identiques dans les deux colonnes,
  // on lit donc l'anglais et on accepte le français si l'anglais est vide.
  const neutral = (key: string): string => {
    const item = findRow(key) as { value_fr?: string; value_en?: string; is_deleted?: boolean } | undefined;
    if (item?.is_deleted) return '';
    return (item?.value_en || item?.value_fr || '').trim() || CONTACT_LINKS[key] || CONTACT_IMAGES[key] || '';
  };

  const getInlineStyle = (key: string) => {
    const item = findRow(key) as any;
    if (!item) return {};
    return {
      fontFamily: fontFamilyWithFallback(item.font_family) || undefined,
      fontSize: item.font_size || undefined,
      fontWeight: item.is_bold ? 'bold' : undefined,
    };
  };

  const getStampClass = (key: string): string => {
    const item = findRow(key) as any;
    return item?.is_stamped ? 'effect-letterpress' : '';
  };
  // ------------------------------------------------

  return (
    <main className="min-h-screen bg-[#fcf7f3] relative">
      
      {/* SECTION HERO */}
      <section className={`relative h-[50vh] md:h-[58vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white ${hidden('contact_hero_image', 'contact_hero_tagline', 'contact_hero_heading', 'contact_hero_subheading') ? 'hidden' : ''}`}>
        
        {/* Image de fond cliquable et modifiable en direct */}
        <div
          onClick={() => {
            if (isEditing) {
              onSelectKey('contact_hero_image');
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              fileInput?.click(); // Déclenche l'upload local
            }
          }}
          className={`absolute inset-0 bg-cover bg-center grayscale ${
            isEditing ? 'cursor-pointer hover:brightness-90' : ''
          } ${isEditing && selectedKey === 'contact_hero_image' ? 'ring-4 ring-white/40 ring-inset' : ''}`}
          style={{
            backgroundImage: `url(${neutral('contact_hero_image')})`,
          }}
        />

        {/* Voile d'ombrage léger pour garantir la lisibilité du texte fin blanc */}
        <div className="absolute inset-0 bg-neutral-950/15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-neutral-950/15 pointer-events-none" />

        {/* Contenu textuel épuré et centré */}
        <div className="relative z-10 text-center max-w-3xl space-y-5 md:space-y-7 px-4 pt-12 md:pt-16">

          {/* Tagline de rencontre éditable */}
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('contact_hero_tagline', e.currentTarget.innerText || '')}
            onClick={() => isEditing && onSelectKey('contact_hero_tagline')}
            style={getInlineStyle('contact_hero_tagline')}
            className={`font-sans text-[9px] md:text-[10px] tracking-[0.46em] uppercase font-light text-white/55 block outline-none rounded-xs whitespace-pre-wrap ${
              isEditing ? 'hover:bg-white/10 cursor-text animate-none' : 'animate-fade-in'
            } ${isEditing && selectedKey === 'contact_hero_tagline' ? 'border border-dashed border-white bg-white/10' : ''}`}
          >
            {t('contact_hero_tagline')}
          </span>

          {/* Titre éditable — typo fine, jamais de corps géant */}
          <h1
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('contact_hero_heading', e.currentTarget.innerText || '')}
            onClick={() => isEditing && onSelectKey('contact_hero_heading')}
            style={getInlineStyle('contact_hero_heading')}
            className={`font-sans text-[13px] md:text-sm tracking-[0.42em] uppercase font-light text-white/90 outline-none rounded-xs whitespace-pre-wrap ${getStampClass('contact_hero_heading')} ${
              isEditing ? 'hover:bg-white/10 cursor-text' : ''
            } ${isEditing && selectedKey === 'contact_hero_heading' ? 'border border-dashed border-white bg-white/10' : ''}`}
          >
            {t('contact_hero_heading')}
          </h1>

          <div className="w-8 h-px bg-white/25 mx-auto" />

          {/* Sous-titre d'invitation à la création éditable */}
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('contact_hero_subheading', e.currentTarget.innerText || '')}
            onClick={() => isEditing && onSelectKey('contact_hero_subheading')}
            style={getInlineStyle('contact_hero_subheading')}
            className={`font-serif text-[13px] md:text-sm leading-relaxed tracking-[0.02em] font-light text-white/60 max-w-sm mx-auto outline-none rounded-xs whitespace-pre-wrap ${
              isEditing ? 'hover:bg-white/10 cursor-text' : ''
            } ${isEditing && selectedKey === 'contact_hero_subheading' ? 'border border-dashed border-white bg-white/10' : ''}`}
          >
            {t('contact_hero_subheading')}
          </p>

        </div>

      </section>

     {/* SECTION : FORMULAIRE DE CONTACT DYNAMIQUE (LAYOUT FLEX ASYMÉTRIQUE AVEC 2 PHOTOS) */}
<section 
  style={{
    backgroundColor: '#fcf7f3'
  }}
  className={`py-20 md:py-32 px-6 lg:px-12 text-neutral-950 ${hidden('contact_tagline', 'contact_heading', 'contact_email', 'contact_whatsapp', 'contact_instagram', 'contact_form_tagline', 'contact_form_heading') ? 'hidden' : ''}`}
>
  <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
    
    {/* COLONNE GAUCHE (45% de largeur) : Coordonnées fines & Duo de photos d'exposition superposées éditables */}
    <div className="w-full lg:w-[43%] space-y-12 shrink-0">
      
      {/* Coordonnées détaillées éditables */}
      <div className="space-y-6 text-left">
        {/* Petit titre éditable */}
        <span
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('contact_tagline', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('contact_tagline')}
          style={getInlineStyle('contact_tagline')}
          className={`font-sans text-[9px] md:text-[10px] tracking-[0.46em] uppercase font-light text-neutral-400/80 block outline-none rounded-xs whitespace-pre-wrap ${
            isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
          } ${isEditing && selectedKey === 'contact_tagline' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
        >
          {t('contact_tagline')}
        </span>

        {/* Titre de la section éditable */}
        <h3
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('contact_heading', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('contact_heading')}
          style={getInlineStyle('contact_heading')}
          className={`font-sans text-[11px] md:text-xs tracking-[0.34em] uppercase font-light text-neutral-900/85 outline-none rounded-xs whitespace-pre-wrap ${
            isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
          } ${isEditing && selectedKey === 'contact_heading' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
        >
          {t('contact_heading')}
        </h3>

        <div className="w-8 h-px bg-neutral-300/70" />
        
        {/* Liens de Contacts avec Icônes SVG fines - Textes éditables en direct */}
        <div className="flex flex-col space-y-4">

          {/* Adresse de marque fixe dans les deux langues. */}
          <a
            href={`mailto:${neutral('contact_email')}`}
            className="flex items-center space-x-3 font-sans text-[11px] md:text-xs tracking-[0.06em] font-light text-neutral-700/80 hover:text-neutral-950 transition-colors duration-300 inline-flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span
              contentEditable={false}
              suppressContentEditableWarning={true}
              style={getInlineStyle('contact_email')}
              className="outline-none whitespace-pre-wrap"
            >
              {neutral('contact_email')}
            </span>
          </a>

          {/* WhatsApp éditable */}
          <a
            href={`https://wa.me/${neutral('contact_whatsapp').replace(/\D+/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault(); // Évite l'ouverture de WhatsApp lors de l'édition
                onSelectKey('contact_whatsapp');
              }
            }}
            className="flex items-center space-x-3 font-sans text-[11px] md:text-xs tracking-[0.06em] font-light text-neutral-700/80 hover:text-neutral-950 transition-colors duration-300 inline-flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span
              contentEditable={false}
              suppressContentEditableWarning={true}
              onBlur={(e) => onUpdateText('contact_whatsapp', e.currentTarget.innerText || '')}
              style={getInlineStyle('contact_whatsapp')}
              className={`outline-none whitespace-pre-wrap ${isEditing ? 'cursor-text' : ''}`}
            >
              {neutral('contact_whatsapp')}
            </span>
          </a>

          {/* Nom Instagram de marque fixe dans les deux langues. */}
          <a
            href={`https://www.instagram.com/${neutral('contact_instagram').replace(/^@/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 font-sans text-[11px] md:text-xs tracking-[0.06em] font-light text-neutral-700/80 hover:text-neutral-950 transition-colors duration-300 inline-flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span
              contentEditable={false}
              suppressContentEditableWarning={true}
              style={getInlineStyle('contact_instagram')}
              className="outline-none whitespace-pre-wrap"
            >
              {neutral('contact_instagram')}
            </span>
          </a>

        </div>
      </div>

      {/* Duo de photos d'exposition (Superposition asymétrique tactile, éditables un à un) */}
      <div className="relative w-full h-[340px] md:h-[420px] select-none pt-4">
        
        {/* Photo 1 (Arrière-plan, grand format vertical : Gaze de présence, yeux fermés) */}
        <div 
          onClick={() => {
            if (isEditing) {
              onSelectKey('contact_image_1');
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              fileInput?.click(); // Déclenche l'upload local autonome
            }
          }}
          className={`group absolute top-0 left-0 w-[55%] aspect-[3/4] overflow-hidden shadow-md -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer ${
            isEditing && selectedKey === 'contact_image_1' ? 'z-30 ring-4 ring-neutral-400 ring-inset' : 'z-10'
          }`}
        >
          <img
            src={neutral('contact_image_1')}
            alt="Méditation"
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-103 grayscale group-hover:grayscale-0"
          />
        </div>

        {/* Photo 2 (Premier plan, format portrait : Fumigation sacrée et rituel) */}
        <div 
          onClick={() => {
            if (isEditing) {
              onSelectKey('contact_image_2');
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              fileInput?.click();
            }
          }}
          className={`group absolute bottom-4 right-2 w-[48%] aspect-[3/4] overflow-hidden shadow-lg rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer ${
            isEditing && selectedKey === 'contact_image_2' ? 'z-40 ring-4 ring-neutral-400 ring-inset' : 'z-20'
          }`}
        >
          <img
            src={neutral('contact_image_2')}
            alt="Fumigation sacrée et rituel de passage"
            className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
          />
        </div>

      </div>

    </div>

    {/* COLONNE DROITE (55% de largeur) : Formulaire d'écriture d'origine (100% intouchable pour préserver les inputs) */}
    <div className="w-full lg:w-[57%] space-y-8">
      
      {/* Titres du Formulaire éditables */}
      <div className="space-y-4 text-left">
        {/* Petit titre éditable */}
        <span
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('contact_form_tagline', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('contact_form_tagline')}
          style={getInlineStyle('contact_form_tagline')}
          className={`font-sans text-[9px] md:text-[10px] tracking-[0.46em] uppercase font-light text-neutral-400/80 block outline-none rounded-xs whitespace-pre-wrap ${
            isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
          } ${isEditing && selectedKey === 'contact_form_tagline' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
        >
          {t('contact_form_tagline')}
        </span>

        {/* Titre Principal de section éditable */}
        <h3
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('contact_form_heading', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('contact_form_heading')}
          style={getInlineStyle('contact_form_heading')}
          className={`font-sans text-[11px] md:text-xs tracking-[0.34em] uppercase font-light text-neutral-900/85 outline-none rounded-xs whitespace-pre-wrap block ${getStampClass('contact_form_heading')} ${
            isEditing ? 'hover:bg-[#FAF9F6] cursor-text' : ''
          } ${isEditing && selectedKey === 'contact_form_heading' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
        >
          {t('contact_form_heading')}
        </h3>
        <div className="w-8 h-px bg-neutral-300/70" />
      </div>

      {/* Formulaire HTML d'origine (Totalement préservé, aucun input n'est modifié) */}
      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 pt-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <ContactField
            labelKey="contact_label_firstname"
            label={t('contact_label_firstname')}
            isEditing={isEditing}
            selectedKey={selectedKey}
            onSelectKey={onSelectKey}
            onUpdateText={onUpdateText}
            style={getInlineStyle('contact_label_firstname')}
          >
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light"
            />
          </ContactField>
          <ContactField
            labelKey="contact_label_lastname"
            label={t('contact_label_lastname')}
            isEditing={isEditing}
            selectedKey={selectedKey}
            onSelectKey={onSelectKey}
            onUpdateText={onUpdateText}
            style={getInlineStyle('contact_label_lastname')}
          >
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light"
            />
          </ContactField>
        </div>

        <ContactField
          labelKey="contact_label_email"
          label={t('contact_label_email')}
          isEditing={isEditing}
          selectedKey={selectedKey}
          onSelectKey={onSelectKey}
          onUpdateText={onUpdateText}
          style={getInlineStyle('contact_label_email')}
        >
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light"
          />
        </ContactField>

        <ContactField
          labelKey="contact_label_subject"
          label={t('contact_label_subject')}
          isEditing={isEditing}
          selectedKey={selectedKey}
          onSelectKey={onSelectKey}
          onUpdateText={onUpdateText}
          style={getInlineStyle('contact_label_subject')}
        >
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light"
          />
        </ContactField>

        <ContactField
          labelKey="contact_label_message"
          label={t('contact_label_message')}
          isEditing={isEditing}
          selectedKey={selectedKey}
          onSelectKey={onSelectKey}
          onUpdateText={onUpdateText}
          style={getInlineStyle('contact_label_message')}
        >
          <textarea
            rows={5}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light resize-none leading-relaxed"
          />
        </ContactField>

        <div className="pt-4 text-left">
          <button
            type="submit"
            disabled={sending}
            className="text-[9px] md:text-[10px] uppercase tracking-[0.34em] font-light text-neutral-900/90 border border-neutral-900/25 px-8 py-3.5 hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-all duration-500 inline-block rounded-none cursor-pointer shadow-xs disabled:opacity-40"
          >
            {sending ? t('contact_btn_sending') : t('contact_btn_send')}
          </button>
          {status.type && (
            <p className={`mt-4 text-xs font-sans tracking-wide ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
              {status.message}
            </p>
          )}
        </div>

      </form>

    </div>

  </div>
</section>



    {/* Sur le site public c'est le Footer qui affiche la section Instagram.
        Ici on ne la montre que dans l'éditeur, comme sur les autres pages. */}
    </main>
  );
}
