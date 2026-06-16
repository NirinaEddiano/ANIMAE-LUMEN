'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

import { supabase } from '@/lib/supabase';
import InstagramSection from '@/components/InstagramSection';
import { useState, useEffect } from 'react';

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
    <main className="min-h-screen bg-[#FAF9F6] pb-0 relative">
      
      {/* SECTION HERO */}
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

      {/* SECTION : GRILLE FILTRABLE DYNAMIQUE */}
      <section className="max-w-[85rem] mx-auto pt-12 md:pt-16 pb-12 md:pb-16 px-4 md:px-8">
        
        {/* Filtre Sticky — Mobile swipe / Desktop centré */}
        <div className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-md py-4 mb-8 flex overflow-x-auto whitespace-nowrap scrollbar-hide snap-x md:justify-center border-b border-neutral-200/50 px-4 md:px-0">
          {(['all', 'retreats', 'ceremonies', 'festivals', 'portraits'] as const).map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`snap-start shrink-0 font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase pb-1 transition-all duration-300 ease-in-out cursor-pointer mr-8 last:mr-0 ${
                  isActive
                    ? 'text-neutral-900 font-semibold border-b border-neutral-900'
                    : 'text-neutral-500 opacity-70 hover:opacity-100 hover:text-neutral-900'
                }`}
              >
                {t[cat]}
              </button>
            );
          })}
        </div>

        {/* Grille des projets filtrés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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



    <InstagramSection
      dbContent={dbContent}
      isEditing={isEditing}
      onUpdateText={onUpdateText}
      onSelectKey={onSelectKey}
      selectedKey={selectedKey}
    />
    </main>
  );
}