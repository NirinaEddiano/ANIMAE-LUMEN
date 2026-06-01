'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Script from 'next/script';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react'; // Assurez-vous d'avoir importé ces deux hooks de React !
// 1. Traductions de la section Hero du Portfolio
const portfolioHeroTranslations = {
  fr: {
    tagline: "Fragments d'éternité",
    heading: "Le Portfolio",
    subheading: "Un recueil visuel de retraites spirituelles, cérémonies sacrées, festivals conscients et portraits thérapeutiques.",
  },
  en: {
    tagline: "Fragments of eternity",
    heading: "The Portfolio",
    subheading: "A visual testament to spiritual retreats, sacred ceremonies, conscious festivals, and therapeutic portraits.",
  }
};

// 2. Traductions des catégories, étiquettes et boutons du filtre
const filterTranslations = {
  fr: {
    all: "Tous",
    retreats: "Retraites Spirituelles",
    ceremonies: "Cérémonies Sacrées",
    festivals: "Festivals Conscients",
    portraits: "Portraits Thérapeutiques",
    viewProject: "Découvrir la galerie →",
  },
  en: {
    all: "All",
    retreats: "Spiritual Retreats",
    ceremonies: "Sacred Ceremonies",
    festivals: "Conscious Festivals",
    portraits: "Therapeutic Portraits",
    viewProject: "Explore the gallery →",
  }
};

// Définition de la structure stricte d'un projet pour TypeScript
interface Project {
  id: string;
  title: string;
  category: 'retreats' | 'ceremonies' | 'festivals' | 'portraits';
  imageUrl: string;
}


const ctaSectionTranslations = {
  fr: {
    tagline: "L'invitation",
    heading: "Co-créer un espace de présence",
    description: "Vous organisez une retraite de transformation, célébrez une union d'âmes, ou ressentez l'appel d'honorer votre essence à travers un portrait thérapeutique ? Écrivons ensemble le témoignage visuel de votre lumière.",
    buttonText: "Initier le voyage →",
  },
  en: {
    tagline: "The invitation",
    heading: "Co-creating a space of presence",
    description: "Are you hosting a transformational retreat, celebrating a sacred union, or feeling the calling to honor your essence through a therapeutic portrait? Let us write the visual testament of your light together.",
    buttonText: "Begin the journey →",
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

export default function PortfolioPage({ 
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
  const [filter, setFilter] = useState<'all' | 'retreats' | 'ceremonies' | 'festivals' | 'portraits'>('all');

    // --- NOUVEAU : Chargement dynamique des portfolios depuis Supabase ---
  const [portfolios, setPortfolios] = useState<any[]>([]);
   useEffect(() => {
    const fetchPortfolios = async () => {
      const { data } = await supabase.from('portfolios').select('*');
      if (data) setPortfolios(data);
    };
    fetchPortfolios();
  },[])

  

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

  const hero = portfolioHeroTranslations[language];
  const t = filterTranslations[language];

// Filtrage des réalisations venant de Supabase (portfolios)
const filteredProjects = filter === 'all' 
  ? portfolios 
  : portfolios.filter(project => project.category === filter);

  return (
    <main className="min-h-screen bg-[#FAF9F6] pb-0">
      
      {/* SECTION HERO : Hauteur identique (Coucher de soleil méditatif d'origine, Édition active au clic) */}
      <section className="relative h-[50vh] md:h-[58vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white">
        
        {/* Image de fond cliquable et modifiable en direct par l'admin */}
        <div
          onClick={() => {
            if (isEditing) {
              onSelectKey('portfolio_hero_image');
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              fileInput?.click(); // Ouvre l'explorateur local
            }
          }}
          className={`absolute inset-0 bg-cover bg-center ${
            isEditing ? 'cursor-pointer hover:brightness-90' : ''
          } ${isEditing && selectedKey === 'portfolio_hero_image' ? 'ring-4 ring-white/40 ring-inset' : ''}`}
          style={{
            backgroundImage: `url(${getContent('portfolio_hero_image', 'value_fr', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80')})`,
          }}
        />

        {/* Voiles d'ombrage de lisibilité */}
        <div className="absolute inset-0 bg-neutral-950/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/25 pointer-events-none" />

        {/* Contenu textuel centré et épuré éditable en direct */}
        <div className="relative z-10 text-center max-w-3xl space-y-4 md:space-y-6 px-4 pt-12 md:pt-16">
          
          {/* Tagline du Portfolio éditable */}
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('portfolio_hero_tagline', e.currentTarget.innerText || '')}
            onClick={() => isEditing && onSelectKey('portfolio_hero_tagline')}
            style={getInlineStyle('portfolio_hero_tagline')}
            className={`font-sans text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-300 block outline-none rounded-xs whitespace-pre-wrap ${
              isEditing ? 'hover:bg-white/10 cursor-text animate-none' : 'animate-fade-in'
            } ${isEditing && selectedKey === 'portfolio_hero_tagline' ? 'border border-dashed border-white bg-white/10' : ''}`}
          >
            {getContent('portfolio_hero_tagline', language === 'fr' ? 'value_fr' : 'value_en', hero.tagline)}
          </span>

          {/* Grand Titre (Cormorant Garamond) éditable */}
          <h1
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('portfolio_hero_heading', e.currentTarget.innerText || '')}
            onClick={() => isEditing && onSelectKey('portfolio_hero_heading')}
            style={getInlineStyle('portfolio_hero_heading')}
            className={`font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide font-light leading-tight text-white outline-none rounded-xs whitespace-pre-wrap ${
              isEditing ? 'hover:bg-white/10 cursor-text' : ''
            } ${isEditing && selectedKey === 'portfolio_hero_heading' ? 'border border-dashed border-white bg-white/10' : ''}`}
          >
            {getContent('portfolio_hero_heading', language === 'fr' ? 'value_fr' : 'value_en', hero.heading)}
          </h1>

          {/* Sous-titre descriptif éditable */}
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('portfolio_hero_subheading', e.currentTarget.innerText || '')}
            onClick={() => isEditing && onSelectKey('portfolio_hero_subheading')}
            style={getInlineStyle('portfolio_hero_subheading')}
            className={`font-sans text-xs md:text-sm tracking-[0.12em] leading-relaxed font-light text-neutral-200 max-w-xl mx-auto outline-none rounded-xs whitespace-pre-wrap ${
              isEditing ? 'hover:bg-white/10 cursor-text' : ''
            } ${isEditing && selectedKey === 'portfolio_hero_subheading' ? 'border border-dashed border-white bg-white/10' : ''}`}
          >
            {getContent('portfolio_hero_subheading', language === 'fr' ? 'value_fr' : 'value_en', hero.subheading)}
          </p>

        </div>
      </section>

      {/* SECTION : GRILLE FILTRABLE (PC : 4 COLONNES COMPACTES - 32 RÉALISATIONS) */}
{/* SECTION : GRILLE FILTRABLE DYNAMIQUE */}
      <section className="max-w-[85rem] mx-auto pt-16 md:pt-20 pb-12 md:pb-16 px-4 md:px-8 space-y-16">
        
        {/* Menu de Filtrage */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-b border-neutral-200/50 pb-6">
          {(['all', 'retreats', 'ceremonies', 'festivals', 'portraits'] as const).map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase pb-2 transition-all duration-300 cursor-pointer ${
                  isActive ? 'text-neutral-950 font-semibold border-b border-neutral-950 opacity-100' : 'text-neutral-800 opacity-80 hover:opacity-100 hover:text-neutral-950'
                }`}
              >
                {t[cat]}
              </button>
            );
          })}
        </div>

        {/* Grille dynamique venant de Supabase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
          {filteredProjects.map((project: any) => (
            <div 
              key={project.id} 
              className="flex flex-col space-y-4 group"
            >
              <Link href={`/portfolio/${project.id}`}>
                <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative cursor-pointer shadow-sm">
                  <img
                    // On utilise la première image du tableau 'images' de votre base de données
                    src={project.images && project.images.length > 0 ? project.images[0] : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'}
                    alt={language === 'fr' ? project.title_fr : project.title_en}
                    className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                </div>
              </Link>

              <div className="space-y-2 px-1">
                <span className="font-sans text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block">
                  {t[project.category as keyof typeof t]}
                </span>
                
                <h3 className="font-serif text-lg md:text-xl tracking-wide font-light text-neutral-900 leading-snug">
                  {language === 'fr' ? project.title_fr : project.title_en}
                </h3>

                <div className="pt-1">
                  <Link
                    href={`/portfolio/${project.id}`}
                    className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-light text-neutral-500 group-hover:text-neutral-950 border-b border-neutral-300 group-hover:border-neutral-950 pb-1 transition-all duration-500 inline-block"
                  >
                    {t.viewProject}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

{/* SECTION : CALL TO ACTION (INVITATION SACRÉE DYNAMIQUE) */}
<section className="relative h-[65vh] md:h-[75vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white">
  
  {/* Grande image panoramique spirituelle en arrière-plan (Cliquable et éditable) */}
  <div
    onClick={() => {
      if (isEditing) {
        onSelectKey('portfolio_cta_image');
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        fileInput?.click(); // Déclenche l'upload local
      }
    }}
    className={`absolute inset-0 bg-cover bg-center transition-transform duration-[4000ms] ease-out group-hover:scale-105 ${
      isEditing ? 'cursor-pointer hover:brightness-90' : ''
    } ${isEditing && selectedKey === 'portfolio_cta_image' ? 'ring-4 ring-white/40 ring-inset' : ''}`}
    style={{
      backgroundImage: `url(${getContent('portfolio_cta_image', 'value_fr', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80')})`,
    }}
  />

  <div className="absolute inset-0 bg-neutral-950/50 pointer-events-none" />
  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/10 via-black/10 to-neutral-950/10 pointer-events-none" />

  {/* Contenu de l'invitation éditable */}
  <div className="relative z-10 text-center max-w-3xl space-y-6 md:space-y-8 px-4">
    
    {/* Tagline éditable */}
    <span
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={(e) => onUpdateText('portfolio_cta_tagline', e.currentTarget.innerText || '')}
      onClick={() => isEditing && onSelectKey('portfolio_cta_tagline')}
      style={getInlineStyle('portfolio_cta_tagline')}
      className={`font-sans text-xs md:text-sm tracking-[0.35em] uppercase font-light text-neutral-300 block outline-none rounded-xs whitespace-pre-wrap ${
        isEditing ? 'hover:bg-white/10 cursor-text' : 'animate-pulse'
      } ${isEditing && selectedKey === 'portfolio_cta_tagline' ? 'border border-dashed border-white bg-white/10' : ''}`}
    >
      {getContent('portfolio_cta_tagline', language === 'fr' ? 'value_fr' : 'value_en', ctaSectionTranslations[language].tagline)}
    </span>

    {/* Grand Titre éditable */}
    <h2
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={(e) => onUpdateText('portfolio_cta_heading', e.currentTarget.innerText || '')}
      onClick={() => isEditing && onSelectKey('portfolio_cta_heading')}
      style={getInlineStyle('portfolio_hero_heading')}
      className={`font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide font-light leading-tight text-white outline-none rounded-xs whitespace-pre-wrap ${
        isEditing ? 'hover:bg-white/10 cursor-text' : ''
      } ${isEditing && selectedKey === 'portfolio_cta_heading' ? 'border border-dashed border-white bg-white/10' : ''}`}
    >
      {getContent('portfolio_cta_heading', language === 'fr' ? 'value_fr' : 'value_en', ctaSectionTranslations[language].heading)}
    </h2>

    {/* Descriptif éditable */}
    <p
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={(e) => onUpdateText('portfolio_cta_description', e.currentTarget.innerText || '')}
      onClick={() => isEditing && onSelectKey('portfolio_cta_description')}
      style={getInlineStyle('portfolio_cta_description')}
      className={`font-sans text-sm md:text-base tracking-[0.12em] leading-relaxed font-light text-neutral-200 max-w-2xl mx-auto outline-none rounded-xs whitespace-pre-wrap ${
        isEditing ? 'hover:bg-white/10 cursor-text' : ''
      } ${isEditing && selectedKey === 'portfolio_cta_description' ? 'border border-dashed border-white bg-white/10' : ''}`}
    >
      {getContent('portfolio_cta_description', language === 'fr' ? 'value_fr' : 'value_en', ctaSectionTranslations[language].description)}
    </p>

    {/* Bouton d'action éditable */}
    <div className="pt-4">
      <Link
        href="/contact"
        onClick={(e) => isEditing && e.preventDefault()}
        className="bg-white/10 backdrop-blur-md border border-white/40 text-white text-[10px] md:text-xs uppercase tracking-[0.25em] font-light px-10 py-4 hover:bg-white hover:text-neutral-900 hover:border-white transition-all duration-500 inline-block rounded-none shadow-md cursor-pointer"
      >
        <span
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('portfolio_cta_button_text', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('portfolio_cta_button_text')}
          style={getInlineStyle('portfolio_cta_button_text')}
          className={`outline-none whitespace-pre-wrap ${isEditing ? 'cursor-text' : ''}`}
        >
          {getContent('portfolio_cta_button_text', language === 'fr' ? 'value_fr' : 'value_en', ctaSectionTranslations[language].buttonText)}
        </span>
      </Link>
    </div>

  </div>
</section>

{/* SECTION : INTEGRATION INSTAGRAM MASONRY FOUITA (LARGEUR AJUSTÉE SANS VIDE) */}
{/* SECTION : INTEGRATION INSTAGRAM DYNAMIQUE */}
<section className="bg-[#FAF9F6] pt-12 pb-8 md:pb-12 px-4 md:px-8 border-t border-neutral-200/40">
  <div className="w-full space-y-16">
    
    {/* En-tête de section éditable */}
    <div className="text-center space-y-4 max-w-xl mx-auto">
      
      {/* Tagline éditable */}
      <span
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('insta_tagline', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('insta_tagline')}
        style={getInlineStyle('insta_tagline')}
        className={`font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block outline-none rounded-xs whitespace-pre-wrap ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'insta_tagline' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('insta_tagline', language === 'fr' ? 'value_fr' : 'value_en', instagramSectionTranslations[language].tagline)}
      </span>

      {/* Heading éditable */}
      <h2
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('insta_heading', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('insta_heading')}
        style={getInlineStyle('insta_heading')}
        className={`font-serif text-3xl md:text-5xl tracking-wide font-light text-neutral-800 leading-tight outline-none rounded-xs whitespace-pre-wrap block ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'insta_heading' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('insta_heading', language === 'fr' ? 'value_fr' : 'value_en', instagramSectionTranslations[language].heading)}
      </h2>
      
      {/* Nom du compte éditable */}
      <div className="pt-2">
        <a 
          href="https://www.instagram.com/animaelumen" 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => isEditing && e.preventDefault()}
          className="font-serif text-xl md:text-2xl italic font-light text-neutral-600 hover:text-neutral-900 transition-colors duration-300 underline underline-offset-8 inline-block"
        >
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('insta_handle', e.currentTarget.innerText || '')}
            onClick={() => isEditing && onSelectKey('insta_handle')}
            style={getInlineStyle('insta_handle')}
            className={`outline-none whitespace-pre-wrap ${isEditing ? 'cursor-text' : ''}`}
          >
            {getContent('insta_handle', 'value_fr', '@animaelumen')}
          </span>
        </a>
      </div>

      {/* Subheading éditable */}
      <p
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('insta_subheading', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('insta_subheading')}
        style={getInlineStyle('insta_subheading')}
        className={`font-sans text-xs md:text-sm font-light text-neutral-500 tracking-wide max-w-xs mx-auto pt-4 outline-none rounded-xs whitespace-pre-wrap ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'insta_subheading' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('insta_subheading', language === 'fr' ? 'value_fr' : 'value_en', instagramSectionTranslations[language].subheading)}
      </p>
      
      <div className="w-12 h-[1px] bg-neutral-300 mx-auto mt-6" />
    </div>

    {/* CONTAINER INSTAGRAM (Widget Fouita inchangé) */}
    <div className="max-w-[90rem] mx-auto w-full px-2 md:px-6">
      <div className="w-full h-auto">
        <div data-key="Masonry Instagram Feed" className="ft" id="ftuaxm8l1" />
        <Script src="https://wdg.fouita.com/widgets/0x48d497.js" strategy="lazyOnload" />
      </div>
    </div>

    {/* Bouton d'invitation éditable */}
    <div className="text-center pt-4">
      <a
        href="https://www.instagram.com/animaelumen"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-light text-neutral-800 border border-neutral-800/30 px-8 py-3.5 hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-all duration-500 inline-block rounded-none cursor-pointer"
      >
        <span
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('insta_button_text', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('insta_button_text')}
          style={getInlineStyle('insta_button_text')}
          className={`outline-none whitespace-pre-wrap ${isEditing ? 'cursor-text' : ''}`}
        >
          {getContent('insta_button_text', language === 'fr' ? 'value_fr' : 'value_en', instagramSectionTranslations[language].buttonText)}
        </span>
      </a>
    </div>

  </div>
</section>

    </main>
  );
}