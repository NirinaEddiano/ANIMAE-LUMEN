'use client';

import { useLanguage } from '@/context/LanguageContext';
import Script from 'next/script';

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

export default function ContactPage() {
  const { language } = useLanguage();
  const t = contactHeroTranslations[language];

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      
      {/* SECTION HERO : Hauteur identique à À Propos (Brume matinale dorée et stable) */}
      <section className="relative h-[50vh] md:h-[58vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white">
        
        {/* Image de fond : Lever de soleil et brume sur le lac (Lien stable) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80')`,
            backgroundPosition: 'center',
          }}
        />

        {/* Voile d'ombrage léger pour garantir la lisibilité du texte fin blanc */}
        <div className="absolute inset-0 bg-neutral-950/15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-neutral-950/15 pointer-events-none" />

        {/* Contenu textuel épuré et centré */}
        <div className="relative z-10 text-center max-w-3xl space-y-4 md:space-y-6 px-4 pt-12 md:pt-16">
          
          {/* Tagline de rencontre */}
          <span className="font-sans text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-300 block animate-fade-in">
            {t.tagline}
          </span>

          {/* Grand Titre (Cormorant Garamond) */}
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide font-light leading-tight text-white">
            {t.heading}
          </h1>

          {/* Sous-titre d'invitation à la création */}
          <p className="font-sans text-xs md:text-sm tracking-[0.12em] leading-relaxed font-light text-neutral-200 max-w-xl mx-auto">
            {t.subheading}
          </p>

        </div>

      </section>

      {/* SECTION : FORMULAIRE DE CONTACT (LAYOUT FLEX ASYMÉTRIQUE AVEC 2 PHOTOS) */}
<section className="bg-[#FAF9F6] py-20 md:py-32 px-6 lg:px-12 text-neutral-950 border-t border-neutral-200/40">
  <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
    
    {/* COLONNE GAUCHE (45% de largeur) : Coordonnées fines & Duo de photos d'exposition superposées */}
    <div className="w-full lg:w-[43%] space-y-12 shrink-0">
      
      {/* Coordonnées détaillées */}
      <div className="space-y-6">
        <span className="font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block">
          {contactFormTranslations[language].infoTitle}
        </span>
        <h3 className="font-serif text-2xl md:text-3xl tracking-wide font-light text-neutral-900 leading-tight">
          Animae Lumen
        </h3>
        <div className="w-8 h-[1px] bg-neutral-300" />
        
        {/* Liens avec Icônes SVG fines */}
        <div className="flex flex-col space-y-4">
          
          {/* E-mail */}
          <a 
            href="mailto:animaelumen@outlook.com" 
            className="flex items-center space-x-3 font-sans text-xs md:text-sm tracking-wide font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>animaelumen@outlook.com</span>
          </a>

          {/* WhatsApp */}
          <a 
            href="https://wa.me/33683843807" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-3 font-sans text-xs md:text-sm tracking-wide font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>+33 6 83 84 38 07</span>
          </a>

          {/* Instagram */}
          <a 
            href="https://www.instagram.com/animaelumen" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-3 font-sans text-xs md:text-sm tracking-wide font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>@animaelumen</span>
          </a>

        </div>
      </div>

      {/* Duo de photos d'exposition (Superposition asymétrique tactile d'inspiration holistique) */}
      <div className="relative w-full h-[340px] md:h-[420px] select-none pt-4">
        
        {/* Photo 1 (Arrière-plan, grand format vertical : Gaze de présence, yeux fermés) - Inclinaison gauche */}
        <div className="absolute top-0 left-0 w-[55%] aspect-[3/4] overflow-hidden shadow-md z-10 -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
            alt="Méditation"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>

        {/* Photo 2 (Premier plan, format portrait : Fumigation sacrée et rituel) - Inclinaison droite */}
        <div className="absolute bottom-4 right-2 w-[48%] aspect-[3/4] overflow-hidden shadow-lg z-20 rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=600&q=80"
            alt="Fumigation sacrée et rituel de passage"
            className="w-full h-full object-cover"
          />
        </div>

      </div>

    </div>

    {/* COLONNE DROITE (55% de largeur) : Formulaire d'écriture épuré et haut de gamme */}
    <div className="w-full lg:w-[57%] space-y-8">
      
      {/* Titres du Formulaire */}
      <div className="space-y-4">
        <span className="font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block">
          {contactFormTranslations[language].tagline}
        </span>
        <h3 className="font-serif text-3xl md:text-4xl tracking-wide font-light text-neutral-900 leading-tight">
          {contactFormTranslations[language].heading}
        </h3>
        <div className="w-12 h-[1px] bg-neutral-300" />
      </div>

      {/* Formulaire HTML épuré */}
      <form className="space-y-8 md:space-y-10 pt-4">
        
        {/* Ligne 1 : Prénom & Nom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="flex flex-col space-y-2">
            <label className="font-sans text-xs uppercase tracking-[0.2em] font-light text-neutral-400">
              {contactFormTranslations[language].firstName}
            </label>
            <input 
              type="text" 
              required
              className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light"
            />
          </div>
          <div className="flex flex-col space-y-2">
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

        {/* Ligne 2 : Email */}
        <div className="flex flex-col space-y-2">
          <label className="font-sans text-xs uppercase tracking-[0.2em] font-light text-neutral-400">
            {contactFormTranslations[language].email}
          </label>
          <input 
            type="email" 
            required
            className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light"
          />
        </div>

        {/* Ligne 3 : Sujet */}
        <div className="flex flex-col space-y-2">
          <label className="font-sans text-xs uppercase tracking-[0.2em] font-light text-neutral-400">
            {contactFormTranslations[language].subject}
          </label>
          <input 
            type="text" 
            required
            className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light"
          />
        </div>

        {/* Ligne 4 : Message */}
        <div className="flex flex-col space-y-2">
          <label className="font-sans text-xs uppercase tracking-[0.2em] font-light text-neutral-400">
            {contactFormTranslations[language].message}
          </label>
          <textarea 
            rows={5}
            required
            className="w-full bg-transparent border-b border-neutral-300/80 py-2.5 text-neutral-800 focus:border-neutral-950 focus:outline-none transition-colors duration-300 font-sans text-sm font-light resize-none leading-relaxed"
          />
        </div>

        {/* Bouton envoyer */}
        <div className="pt-4">
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

{/* SECTION : INTEGRATION INSTAGRAM MASONRY FOUITA (LARGEUR AJUSTÉE SANS VIDE) */}
<section className="bg-[#FAF9F6] pt-12 pb-8 md:pb-12 px-4 md:px-8 border-t border-neutral-200/40">
  <div className="w-full space-y-16">
    
    {/* En-tête de section avec votre nom de compte IG mis en valeur */}
    <div className="text-center space-y-4 max-w-xl mx-auto">
      <span className="font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block">
        {instagramSectionTranslations[language].tagline}
      </span>
      <h2 className="font-serif text-3xl md:text-5xl tracking-wide font-light text-neutral-800 leading-tight">
        {instagramSectionTranslations[language].heading}
      </h2>
      
      {/* Votre lien de compte Instagram artistique */}
      <div className="pt-2">
        <a 
          href="https://www.instagram.com/animaelumen" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-serif text-xl md:text-2xl italic font-light text-neutral-600 hover:text-neutral-900 transition-colors duration-300 underline underline-offset-8"
        >
          @animaelumen
        </a>
      </div>

      <p className="font-sans text-xs md:text-sm font-light text-neutral-500 tracking-wide max-w-xs mx-auto pt-4">
        {instagramSectionTranslations[language].subheading}
      </p>
      <div className="w-12 h-[1px] bg-neutral-300 mx-auto mt-6" />
    </div>

    {/* CONTAINER AJUSTÉ À 1440px (max-w-[90rem]) ET HAUTEUR AUTOMATIQUE SANS ESPACE VIDE */}
    <div className="max-w-[90rem] mx-auto w-full px-2 md:px-6">
      <div className="w-full h-auto">
        
        {/* Balise du widget Fouita */}
        <div 
          data-key="Masonry Instagram Feed" 
          className="ft" 
          id="ftuaxm8l1"
        />

        {/* Chargement dynamique et sécurisé du script d'intégration Fouita */}
        <Script 
          src="https://wdg.fouita.com/widgets/0x48d497.js"
          strategy="lazyOnload"
        />

      </div>
    </div>

    {/* Bouton d'invitation à s'abonner (Qui se place désormais parfaitement sous la grille) */}
    <div className="text-center pt-4">
      <a
        href="https://www.instagram.com/animaelumen"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-light text-neutral-800 border border-neutral-800/30 px-8 py-3.5 hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-all duration-500 inline-block rounded-none cursor-pointer"
      >
        {instagramSectionTranslations[language].buttonText}
      </a>
    </div>

  </div>
</section>

    </main>
  );
}