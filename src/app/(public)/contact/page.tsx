'use client';

import { useLanguage } from '@/context/LanguageContext';
import Script from 'next/script';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react'; 

// 1. Traductions de la section Hero de Contact
const contactHeroTranslations = {
  fr: {
    tagline: "L'espace de rencontre",
    heading: "Prendre Contact",
    subheading: "Faisons connaissance et co-créons un espace de présence pour immortaliser votre lumière.",
  },
  en: {
    tagline: "The meeting space",
    heading: "Get in Touch",
    subheading: "Let us connect and co-create a space of presence to immortalize your light.",
  }
};

const contactFormTranslations = {
  fr: {
    tagline: "L'invitation au partage",
    heading: "Écrire une histoire",
    infoTitle: "S'unir & Échanger",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse Email",
    subject: "Sujet",
    message: "Votre message (votre projet de retraite, union sacrée, ou envie de portrait introspectif...)",
    send: "Initier la connexion",
  },
  en: {
    tagline: "Invitation to share",
    heading: "Write a story",
    infoTitle: "Unite & Connect",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    subject: "Subject",
    message: "Your message (your retreat project, sacred union, or introspective portrait desire...)",
    send: "Initiate connection",
  }
};

const instagramSectionTranslations = {
  fr: {
    tagline: "Le voyage continue",
    heading: "Rejoindre le cercle",
    subheading: "Plongez quotidiennement dans la poésie de l'invisible, du silence et de la présence pure.",
    buttonText: "Suivre sur Instagram",
  },
  en: {
    tagline: "The journey continues",
    heading: "Join the circle",
    subheading: "Dive daily into the poetry of the unseen, silence, and pure presence.",
    buttonText: "Follow on Instagram",
  }
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

  // --- CHARGEMENT DYNAMIQUE DES TEXTES & STYLES ---
  const [localDbContent, setLocalDbContent] = useState<any[]>([]);

  useEffect(() => {
    if (isEditing) return; // En mode admin, les données viennent déjà de l'admin
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*');
      if (data) setLocalDbContent(data);
    };
    fetchContent();
  }, [isEditing]);

  const activeContent = isEditing ? dbContent : localDbContent;

  const getContent = (key: string, field: 'value_fr' | 'value_en', defaultValue: string) => {
    const item = activeContent.find((i: any) => i.key === key);
    return item ? item[field] : defaultValue;
  };

  const getInlineStyle = (key: string) => {
    const item = activeContent.find((i: any) => i.key === key);
    if (!item) return {};
    return {
      fontFamily: item.font_family,
      fontSize: item.font_size,
      fontWeight: item.is_bold ? 'bold' : 'light' as const,
    };
  };
  // ------------------------------------------------

  const t = contactHeroTranslations[language];

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      
      {/* SECTION HERO : Hauteur identique à À Propos (Brume matinale dorée, Édition active) */}
      <section className="relative h-[50vh] md:h-[58vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white">
        
        {/* Image de fond cliquable et modifiable en direct */}
        <div
          onClick={() => {
            if (isEditing) {
              onSelectKey('contact_hero_image');
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              fileInput?.click(); // Déclenche l'upload local
            }
          }}
          className={`absolute inset-0 bg-cover bg-center ${
            isEditing ? 'cursor-pointer hover:brightness-90' : ''
          } ${isEditing && selectedKey === 'contact_hero_image' ? 'ring-4 ring-white/40 ring-inset' : ''}`}
          style={{
            backgroundImage: `url(${getContent('contact_hero_image', 'value_fr', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80')})`,
          }}
        />

        {/* Voile d'ombrage léger pour garantir la lisibilité du texte fin blanc */}
        <div className="absolute inset-0 bg-neutral-950/15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-neutral-950/15 pointer-events-none" />

        {/* Contenu textuel épuré et centré */}
        <div className="relative z-10 text-center max-w-3xl space-y-4 md:space-y-6 px-4 pt-12 md:pt-16">
          
          {/* Tagline de rencontre éditable */}
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('contact_hero_tagline', e.currentTarget.innerText || '')}
            onClick={() => isEditing && onSelectKey('contact_hero_tagline')}
            style={getInlineStyle('contact_hero_tagline')}
            className={`font-sans text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-300 block outline-none rounded-xs whitespace-pre-wrap ${
              isEditing ? 'hover:bg-white/10 cursor-text animate-none' : 'animate-fade-in'
            } ${isEditing && selectedKey === 'contact_hero_tagline' ? 'border border-dashed border-white bg-white/10' : ''}`}
          >
            {getContent('contact_hero_tagline', language === 'fr' ? 'value_fr' : 'value_en', t.tagline)}
          </span>

          {/* Grand Titre (Cormorant Garamond) éditable */}
          <h1
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('contact_hero_heading', e.currentTarget.innerText || '')}
            onClick={() => isEditing && onSelectKey('contact_hero_heading')}
            style={getInlineStyle('contact_hero_heading')}
            className={`font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide font-light leading-tight text-white outline-none rounded-xs whitespace-pre-wrap ${
              isEditing ? 'hover:bg-white/10 cursor-text' : ''
            } ${isEditing && selectedKey === 'contact_hero_heading' ? 'border border-dashed border-white bg-white/10' : ''}`}
          >
            {getContent('contact_hero_heading', language === 'fr' ? 'value_fr' : 'value_en', t.heading)}
          </h1>

          {/* Sous-titre d'invitation à la création éditable */}
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('contact_hero_subheading', e.currentTarget.innerText || '')}
            onClick={() => isEditing && onSelectKey('contact_hero_subheading')}
            style={getInlineStyle('contact_hero_subheading')}
            className={`font-sans text-xs md:text-sm tracking-[0.12em] leading-relaxed font-light text-neutral-200 max-w-xl mx-auto outline-none rounded-xs whitespace-pre-wrap ${
              isEditing ? 'hover:bg-white/10 cursor-text' : ''
            } ${isEditing && selectedKey === 'contact_hero_subheading' ? 'border border-dashed border-white bg-white/10' : ''}`}
          >
            {getContent('contact_hero_subheading', language === 'fr' ? 'value_fr' : 'value_en', t.subheading)}
          </p>

        </div>

      </section>

     {/* SECTION : FORMULAIRE DE CONTACT DYNAMIQUE (LAYOUT FLEX ASYMÉTRIQUE AVEC 2 PHOTOS) */}
<section className="bg-[#FAF9F6] py-20 md:py-32 px-6 lg:px-12 text-neutral-950 border-t border-neutral-200/40">
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
          className={`font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block outline-none rounded-xs whitespace-pre-wrap ${
            isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
          } ${isEditing && selectedKey === 'contact_tagline' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
        >
          {getContent('contact_tagline', language === 'fr' ? 'value_fr' : 'value_en', contactFormTranslations[language].infoTitle)}
        </span>

        {/* Titre Principal de Contact éditable */}
        <h3
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('contact_heading', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('contact_heading')}
          style={getInlineStyle('contact_heading')}
          className={`font-serif text-2xl md:text-3xl tracking-wide font-light text-neutral-900 leading-tight outline-none rounded-xs whitespace-pre-wrap ${
            isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
          } ${isEditing && selectedKey === 'contact_heading' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
        >
          {getContent('contact_heading', 'value_fr', 'Animae Lumen')}
        </h3>

        <div className="w-8 h-[1px] bg-neutral-300" />
        
        {/* Liens de Contacts avec Icônes SVG fines - Textes éditables en direct */}
        <div className="flex flex-col space-y-4">
          
          {/* E-mail éditable */}
          <a 
            href={`mailto:${getContent('contact_email', 'value_fr', 'animaelumen@outlook.com')}`}
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault(); // Évite la redirection d'e-mail lors de l'édition
                onSelectKey('contact_email');
              }
            }}
            className="flex items-center space-x-3 font-sans text-xs md:text-sm tracking-wide font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-300 inline-flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => onUpdateText('contact_email', e.currentTarget.innerText || '')}
              style={getInlineStyle('contact_email')}
              className={`outline-none whitespace-pre-wrap ${isEditing ? 'cursor-text' : ''}`}
            >
              {getContent('contact_email', 'value_fr', 'animaelumen@outlook.com')}
            </span>
          </a>

          {/* WhatsApp éditable */}
          <a 
            href={`https://wa.me/${getContent('contact_whatsapp', 'value_fr', '33683843807').replace(/\s+/g, '')}`}
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault(); // Évite l'ouverture de WhatsApp lors de l'édition
                onSelectKey('contact_whatsapp');
              }
            }}
            className="flex items-center space-x-3 font-sans text-xs md:text-sm tracking-wide font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-300 inline-flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => onUpdateText('contact_whatsapp', e.currentTarget.innerText || '')}
              style={getInlineStyle('contact_whatsapp')}
              className={`outline-none whitespace-pre-wrap ${isEditing ? 'cursor-text' : ''}`}
            >
              {getContent('contact_whatsapp', 'value_fr', '+33 6 83 84 38 07')}
            </span>
          </a>

          {/* Instagram éditable */}
          <a 
            href="https://www.instagram.com/animaelumen" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault(); // Évite la redirection Instagram lors de l'édition
                onSelectKey('contact_instagram');
              }
            }}
            className="flex items-center space-x-3 font-sans text-xs md:text-sm tracking-wide font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-300 inline-flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => onUpdateText('contact_instagram', e.currentTarget.innerText || '')}
              style={getInlineStyle('contact_instagram')}
              className={`outline-none whitespace-pre-wrap ${isEditing ? 'cursor-text' : ''}`}
            >
              {getContent('contact_instagram', 'value_fr', '@animaelumen')}
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
          className={`absolute top-0 left-0 w-[55%] aspect-[3/4] overflow-hidden shadow-md -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer ${
            isEditing && selectedKey === 'contact_image_1' ? 'z-30 ring-4 ring-neutral-400 ring-inset' : 'z-10'
          }`}
        >
          <img
            src={getContent('contact_image_1', 'value_fr', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80')}
            alt="Méditation"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
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
          className={`absolute bottom-4 right-2 w-[48%] aspect-[3/4] overflow-hidden shadow-lg rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer ${
            isEditing && selectedKey === 'contact_image_2' ? 'z-40 ring-4 ring-neutral-400 ring-inset' : 'z-20'
          }`}
        >
          <img
            src={getContent('contact_image_2', 'value_fr', 'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=600&q=80')}
            alt="Fumigation sacrée et rituel de passage"
            className="w-full h-full object-cover"
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
          className={`font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block outline-none rounded-xs whitespace-pre-wrap ${
            isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
          } ${isEditing && selectedKey === 'contact_form_tagline' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
        >
          {getContent('contact_form_tagline', language === 'fr' ? 'value_fr' : 'value_en', contactFormTranslations[language].tagline)}
        </span>

        {/* Titre Principal de section éditable */}
        <h3
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('contact_form_heading', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('contact_form_heading')}
          style={getInlineStyle('contact_form_heading')}
          className={`font-serif text-3xl md:text-4xl tracking-wide font-light text-neutral-900 leading-tight outline-none rounded-xs whitespace-pre-wrap block ${
            isEditing ? 'hover:bg-[#FAF9F6] cursor-text' : ''
          } ${isEditing && selectedKey === 'contact_form_heading' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
        >
          {getContent('contact_form_heading', language === 'fr' ? 'value_fr' : 'value_en', contactFormTranslations[language].heading)}
        </h3>
        <div className="w-12 h-[1px] bg-neutral-300" />
      </div>

      {/* Formulaire HTML d'origine (Totalement préservé, aucun input n'est modifié) */}
      <form className="space-y-8 md:space-y-10 pt-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="flex flex-col space-y-2 text-left">
            <label className="font-sans text-xs uppercase tracking-[0.2em] font-light text-neutral-400">
              {contactFormTranslations[language].firstName}
            </label>
            <input 
              type="text" 
              required
              className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light"
            />
          </div>
          <div className="flex flex-col space-y-2 text-left">
            <label className="font-sans text-xs uppercase tracking-[0.2em] font-light text-neutral-400">
              {contactFormTranslations[language].lastName}
            </label>
            <input 
              type="text" 
              required
              className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2 text-left">
          <label className="font-sans text-xs uppercase tracking-[0.2em] font-light text-neutral-400">
            {contactFormTranslations[language].email}
          </label>
          <input 
            type="email" 
            required
            className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light"
          />
        </div>

        <div className="flex flex-col space-y-2 text-left">
          <label className="font-sans text-xs uppercase tracking-[0.2em] font-light text-neutral-400">
            {contactFormTranslations[language].subject}
          </label>
          <input 
            type="text" 
            required
            className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light"
          />
        </div>

        <div className="flex flex-col space-y-2 text-left">
          <label className="font-sans text-xs uppercase tracking-[0.2em] font-light text-neutral-400">
            {contactFormTranslations[language].message}
          </label>
          <textarea 
            rows={5}
            required
            className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light resize-none leading-relaxed"
          />
        </div>

        <div className="pt-4 text-left">
          <button 
            type="submit"
            className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-light text-neutral-900 border border-neutral-900/30 px-10 py-4 hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-all duration-500 inline-block rounded-none cursor-pointer shadow-xs"
          >
            {contactFormTranslations[language].send}
          </button>
        </div>

      </form>

    </div>

  </div>
</section>

{/* SECTION : INTEGRATION INSTAGRAM DYNAMIQUE SUR LA PAGE CONTACT */}
<section className="bg-[#FAF9F6] pt-12 pb-8 md:pb-12 px-4 md:px-8 border-t border-neutral-200/40">
  <div className="w-full space-y-16">
    
    {/* En-tête de section éditable au clic */}
    <div className="text-center space-y-4 max-w-xl mx-auto">
      
      {/* Tagline de section éditable */}
      <span
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('instagram_tagline', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('instagram_tagline')}
        style={getInlineStyle('instagram_tagline')}
        className={`font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block outline-none rounded-xs whitespace-pre-wrap ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'instagram_tagline' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('instagram_tagline', language === 'fr' ? 'value_fr' : 'value_en', instagramSectionTranslations[language].tagline)}
      </span>

      {/* Titre de section éditable */}
      <h2
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('instagram_heading', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('instagram_heading')}
        style={getInlineStyle('instagram_heading')}
        className={`font-serif text-3xl md:text-5xl tracking-wide font-light text-neutral-800 leading-tight outline-none rounded-xs whitespace-pre-wrap block ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'instagram_heading' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('instagram_heading', language === 'fr' ? 'value_fr' : 'value_en', instagramSectionTranslations[language].heading)}
      </h2>
      
      {/* Lien de compte Instagram artistique éditable en direct */}
      <div className="pt-2">
        <a 
          href="https://www.instagram.com/animaelumen" 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => {
            if (isEditing) {
              e.preventDefault(); // Évite l'ouverture d'Instagram lors de l'édition
              onSelectKey('instagram_handle');
            }
          }}
          className="font-serif text-xl md:text-2xl italic font-light text-neutral-600 hover:text-neutral-900 transition-colors duration-300 underline underline-offset-8 inline-block"
        >
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('instagram_handle', e.currentTarget.innerText || '')}
            style={getInlineStyle('instagram_handle')}
            className={`outline-none whitespace-pre-wrap ${isEditing ? 'cursor-text' : ''}`}
          >
            {getContent('instagram_handle', 'value_fr', '@animaelumen')}
          </span>
        </a>
      </div>

      {/* Descriptif d'invitation éditable */}
      <p
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('instagram_subheading', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('instagram_subheading')}
        style={getInlineStyle('instagram_subheading')}
        className={`font-sans text-xs md:text-sm font-light text-neutral-500 tracking-wide max-w-xs mx-auto pt-4 outline-none rounded-xs whitespace-pre-wrap block ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'instagram_subheading' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('instagram_subheading', language === 'fr' ? 'value_fr' : 'value_en', instagramSectionTranslations[language].subheading)}
      </p>
      
      <div className="w-12 h-[1px] bg-neutral-300 mx-auto mt-6" />
    </div>

    {/* CONTAINER AJUSTÉ DU WIDGET FOUITA (Intact et sécurisé) */}
    <div className="max-w-[90rem] mx-auto w-full px-2 md:px-6">
      <div className="w-full h-auto">
        
        {/* Balise du widget Fouita */}
        <div 
          data-key="Masonry Instagram Feed" 
          className="ft" 
          id="ftuaxm8l1"
        />

        {/* Script d'intégration Fouita */}
        <Script 
          src="https://wdg.fouita.com/widgets/0x48d497.js"
          strategy="lazyOnload"
        />

      </div>
    </div>

    {/* Bouton d'invitation à s'abonner (Texte éditable au clic) */}
    <div className="text-center pt-4">
      <a
        href="https://www.instagram.com/animaelumen"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (isEditing) {
            e.preventDefault(); // Évite la redirection en mode édition
            onSelectKey('instagram_button_text');
          }
        }}
        className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-light text-neutral-800 border border-neutral-800/30 px-8 py-3.5 hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-all duration-500 inline-block rounded-none cursor-pointer"
      >
        <span
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('instagram_button_text', e.currentTarget.innerText || '')}
          style={getInlineStyle('instagram_button_text')}
          className={`outline-none whitespace-pre-wrap ${isEditing ? 'cursor-text' : ''}`}
        >
          {getContent('instagram_button_text', language === 'fr' ? 'value_fr' : 'value_en', instagramSectionTranslations[language].buttonText)}
        </span>
      </a>
    </div>

  </div>
</section>

    </main>
  );
}