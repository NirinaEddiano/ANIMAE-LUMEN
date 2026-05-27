'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Script from 'next/script';

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
const projectsData: Project[] = [
  // --- RETRAITES SPIRITUELLES (8 projets) ---
  {
    id: "retreat-ibiza",
    title: "Sensitive Sisterhood",
    category: "retreats",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "retreat-bali",
    title: "Somatic Breathwork",
    category: "retreats",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "retreat-pyrenees",
    title: "Silence de l'Esprit",
    category: "retreats",
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "retreat-desert",
    title: "Ancrage des Dunes",
    category: "retreats",
    imageUrl: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "retreat-mountain",
    title: "Wild Soul Connection",
    category: "retreats",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "retreat-yoga",
    title: "L'Éveil du Corps",
    category: "retreats",
    imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "retreat-ocean",
    title: "Méditation Océane",
    category: "retreats",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "retreat-forest",
    title: "Reconnexion Terrestre",
    category: "retreats",
    imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80"
  },

  // --- CÉRÉMONIES SACRÉES (8 projets) ---
  {
    id: "ceremony-chamonix",
    title: "L'Union d'Âmes",
    category: "ceremonies",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ceremony-lake",
    title: "Le Passage de l'Eau",
    category: "ceremonies",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ceremony-larzac",
    title: "Le Feu Purificateur",
    category: "ceremonies",
    imageUrl: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ceremony-temple",
    title: "Éveil du Temple",
    category: "ceremonies",
    imageUrl: "https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ceremony-ritual",
    title: "La Dévotion Sacrée",
    category: "ceremonies",
    imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ceremony-circles",
    title: "Cercles de Fumée",
    category: "ceremonies",
    imageUrl: "https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ceremony-vessel",
    title: "L'Offrande de Terre",
    category: "ceremonies",
    imageUrl: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ceremony-meadow",
    title: "Rituels Dorés",
    category: "ceremonies",
    imageUrl: "https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&w=600&q=80"
  },

  // --- FESTIVALS CONSCIENTS (8 projets) ---
  {
    id: "festival-babylon",
    title: "The Gardens of Babylon",
    category: "festivals",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "festival-earth",
    title: "Ecstatic Gathering",
    category: "festivals",
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "festival-light",
    title: "Lumière Émergente",
    category: "festivals",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "festival-forest",
    title: "L'Onde Sonore",
    category: "festivals",
    imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "festival-dance",
    title: "La Danse Libérée",
    category: "festivals",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "festival-sunset",
    title: "Transe du Crépuscule",
    category: "festivals",
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "festival-communion",
    title: "Communion Festive",
    category: "festivals",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "festival-woodlands",
    title: "Rassemblement Sacré",
    category: "festivals",
    imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80"
  },

  // --- PORTRAITS THÉRAPEUTIQUES (8 projets) ---
  {
    id: "portrait-valerie",
    title: "Séance Introspective",
    category: "portraits",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "portrait-maelys",
    title: "Le Regard d'Âme",
    category: "portraits",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "portrait-gabriel",
    title: "Présence Pure",
    category: "portraits",
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "portrait-clara",
    title: "Acceptation Intime",
    category: "portraits",
    imageUrl: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "portrait-emilie",
    title: "Vérité Lumineuse",
    category: "portraits",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "portrait-lucas",
    title: "Brute Sincérité",
    category: "portraits",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "portrait-ines",
    title: "Douce Réconciliation",
    category: "portraits",
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "portrait-sarah",
    title: "L'Essence Révélée",
    category: "portraits",
    imageUrl: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&w=600&q=80"
  }
];

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

export default function PortfolioPage() {
  const { language } = useLanguage();

  const hero = portfolioHeroTranslations[language];
  const [filter, setFilter] = useState<'all' | 'retreats' | 'ceremonies' | 'festivals' | 'portraits'>('all');

const t = filterTranslations[language];

// Filtrage des réalisations selon la catégorie active
const filteredProjects = filter === 'all' 
  ? projectsData 
  : projectsData.filter(project => project.category === filter);

  return (
    <main className="min-h-screen bg-[#FAF9F6] pb-0">
      
      {/* SECTION HERO */}
      <section className="relative h-[50vh] md:h-[58vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center animate-fade-in"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80')`,
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-neutral-950/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/25 pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl space-y-4 md:space-y-6 px-4 pt-12 md:pt-16">
          <span className="font-sans text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-300 block">
            {hero.tagline}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide font-light leading-tight text-white">
            {hero.heading}
          </h1>
          <p className="font-sans text-xs md:text-sm tracking-[0.12em] leading-relaxed font-light text-neutral-200 max-w-xl mx-auto">
            {hero.subheading}
          </p>
        </div>
      </section>

      {/* SECTION : GRILLE FILTRABLE (PC : 4 COLONNES COMPACTES - 32 RÉALISATIONS) */}
{/* SECTION : GRILLE FILTRABLE (PC : 4 COLONNES COMPACTES - 32 RÉALISATIONS) */}
<section className="max-w-[85rem] mx-auto pt-16 md:pt-20 pb-12 md:pb-16 px-4 md:px-8 space-y-16">
  
  {/* 1. Menu de Filtrage Minimaliste (Lisibilité des inactifs augmentée à 80%) */}
  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-b border-neutral-200/50 pb-6">
    {(['all', 'retreats', 'ceremonies', 'festivals', 'portraits'] as const).map((cat) => {
      const isActive = filter === cat;
      return (
        <button
          key={cat}
          onClick={() => setFilter(cat)}
          className={`font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase pb-2 transition-all duration-300 cursor-pointer ${
            isActive 
              ? 'text-neutral-950 font-semibold border-b border-neutral-950 opacity-100' 
              : 'text-neutral-800 opacity-80 hover:opacity-100 hover:text-neutral-950'
          }`}
        >
          {t[cat]}
        </button>
      );
    })}
  </div>

  {/* 2. Grille de Réalisations (Format d'Artiste 4 Colonnes sur PC) */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
    {filteredProjects.map((project) => (
      <div 
        key={project.id} 
        className="flex flex-col space-y-4 group"
      >
        {/* Image en format vertical d'art (3/4) */}
        <Link href={`/portfolio/${project.id}`}>
          <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative cursor-pointer shadow-sm">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          </div>
        </Link>

        {/* Textes descriptifs de la réalisation */}
        <div className="space-y-2 px-1">
          {/* Type de catégorie en petit texte fin d'en-tête */}
          <span className="font-sans text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block">
            {t[project.category]}
          </span>
          
          {/* Titre artistique de la réalisation */}
          <h3 className="font-serif text-lg md:text-xl tracking-wide font-light text-neutral-900 leading-snug">
            {project.title}
          </h3>

          {/* Lien d'exploration de la galerie d'art */}
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

{/* SECTION : CALL TO ACTION (L'INVITATION SACRÉE SUR GRANDE PHOTO PANORAMIQUE) */}
<section className="relative h-[65vh] md:h-[75vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white">
  
  {/* Grande image panoramique spirituelle et lumineuse en arrière-plan */}
  <div
    className="absolute inset-0 transition-transform duration-[4000ms] ease-out group-hover:scale-105"
    style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  />

  {/* Double couche d'assombrissement renforcée pour faire ressortir le texte blanc */}
  <div className="absolute inset-0 bg-neutral-950/50 pointer-events-none" />
  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/10 via-black/10 to-neutral-950/10 pointer-events-none" />

  {/* Contenu de l'invitation */}
  <div className="relative z-10 text-center max-w-3xl space-y-6 md:space-y-8 px-4">
    
    {/* Tagline de taille plus confortable */}
    <span className="font-sans text-xs md:text-sm tracking-[0.35em] uppercase font-light text-neutral-300 block animate-pulse">
      {ctaSectionTranslations[language].tagline}
    </span>

    {/* Grand Titre artistique bien visible (Cormorant Garamond) */}
    <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide font-light leading-tight text-white">
      {ctaSectionTranslations[language].heading}
    </h2>

    {/* Descriptif poétique agrandi à 16px (text-base) et contrasté (text-neutral-200) */}
    <p className="font-sans text-sm md:text-base tracking-[0.12em] leading-relaxed font-light text-neutral-200 max-w-2xl mx-auto">
      {ctaSectionTranslations[language].description}
    </p>

    {/* Bouton d'action minimaliste et élégant */}
    <div className="pt-4">
      <Link
        href="/contact"
        className="bg-white/10 backdrop-blur-md border border-white/40 text-white text-[10px] md:text-xs uppercase tracking-[0.25em] font-light px-10 py-4 hover:bg-white hover:text-neutral-900 hover:border-white transition-all duration-500 inline-block rounded-none shadow-md cursor-pointer"
      >
        {ctaSectionTranslations[language].buttonText}
      </Link>
    </div>

  </div>
</section>

{/* SECTION : INTEGRATION INSTAGRAM MASONRY FOUITA (LARGEUR AJUSTÉE SANS VIDE) */}
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