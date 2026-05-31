'use client';

import { useState, useEffect } from 'react'; 
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Script from 'next/script';
import { supabase } from '@/lib/supabase';

// 1. Traductions de la section Hero d'À Propos
const aboutHeroTranslations = {
  fr: {
    tagline: "L'essence derrière l'objectif",
    heading: "Le Regard Conscient",
    subheading: "Une démarche introspective et sensible pour honorer la présence et capturer l'invisible.",
  },
  en: {
    tagline: "The essence behind the lens",
    heading: "The Conscious Gaze",
    subheading: "An introspective and sensitive approach to honor presence and capture the unseen.",
  }
};

const aboutVisionTranslations = {
  fr: {
    tagline: "La démarche & l'univers",
    heading: "L'essence de l'instant",
    subtitle: "Une quête de présence, d'émotion et de lumière.",
    paragraph1: "Ma photographie est une démarche spirituelle, introspective, presque thérapeutique. Née du désir de révéler l'invisible, elle cherche à capter le souffle de vie qui traverse les êtres et les espaces sacrés. Pour moi, l'image n'est pas un acte de capture ou de contrôle, mais un espace de rencontre silencieux, suspendu hors du temps, où l'on s'autorise enfin à être pleinement.",
    paragraph2: "Lors des retraites spirituelles et des cérémonies sacrées, ma présence se veut humble, presque murmurée. Je me fonds dans l'énergie du cercle pour figer la synergie collective, la dévotion silencieuse d'un rituel élémentaire ou la poussière dorée soulevée par les danses libres au coucher du soleil. Chaque cliché devient un talisman visuel, une preuve matérielle de votre propre lumière et de la magie des unions d'âmes.",
    paragraph3: "Dans l'intimité du face-à-face, la séance de portrait introspectif agit comme un rituel de guérison et d'acceptation par l'image. Dans un espace de sécurité absolue et d'écoute bienveillante, je vous guide pas à pas pour relâcher les tensions physiques, accueillir votre vulnérabilité sans jugement, et vous réconcilier durablement avec votre reflet brut et véritable.",
    buttonText: "Découvrir le portfolio →",
  },
  en: {
    tagline: "The approach & universe",
    heading: "The Essence of the Moment",
    subtitle: "A quest for presence, emotion, and light.",
    paragraph1: "My photography is a spiritual, introspective, almost therapeutic approach. Born from the desire to reveal the unseen, it seeks to capture the breath of life flowing through beings and sacred spaces. To me, an image is not an act of capture or control, but a silent meeting space, suspended outside of time, where we finally allow ourselves to fully be.",
    paragraph2: "During spiritual retreats and sacred ceremonies, my presence is humble, almost whispered. I dissolve into the circle's energy to freeze collective synergy, the silent devotion of an elemental ritual, or the golden dust kicked up by free dancing at sunset. Every photograph becomes a visual talisman, material proof of your own light and the magic of soul unions.",
    paragraph3: "In the intimacy of a one-on-one session, introspective portraiture acts as a ritual of healing and acceptance through imagery. Within a space of absolute safety and benevolent listening, I guide you step by step to release physical tension, welcome your vulnerability without judgment, and permanently reconcile with your raw and true reflection.",
    buttonText: "Explore the portfolio →",
  }
};

const aboutExperienceTranslations = {
  fr: {
    tagline: "L'expérience & le processus",
    heading: "Créer un espace de sécurité totale",
    description1: "Pour que l'âme accepte de se révéler, elle a besoin d'une sécurité absolue. C'est pourquoi je n'interviens jamais comme une simple observatrice extérieure. Je marche à vos côtés, je respire au rythme de vos rituels, et je me fonds doucement dans le silence de votre espace.",
    description2: "Sans flash, sans staging ni mise en scène artificielle, je travaille exclusivement en lumière naturelle. J'utilise un obturateur totalement silencieux pour préserver la pureté de vos instants de recueillement et la synergie de vos cercles. Vous êtes libre d'être, de pleurer, de danser, d'exister. Je me fais simplement gardienne de votre vérité.",
  },
  en: {
    tagline: "The experience & process",
    heading: "Creating a container of absolute safety",
    description1: "For the soul to reveal itself, it requires absolute safety. This is why I never arrive as a mere outside observer. I walk by your side, breathe to the rhythm of your rituals, and softly dissolve into the silence of your space.",
    description2: "No flash, no staging or artificial posing, I work exclusively in natural light. I use a completely silent shutter to preserve the purity of your moments of contemplation and the synergy of your circles. You are free to be, to weep, to dance, to exist. I simply act as the guardian of your truth.",
  }
};

const aboutSignatureTranslations = {
  fr: {
    tagline: "La signature artistique",
    heading: "Les outils de l'invisible",
    items: [
      {
        title: "La Lumière Pure",
        subtitle: "Prismes & Réfractions",
        description: "Je n'utilise aucun éclairage artificiel. Je travaille uniquement avec le soleil, capturant les prismes et les réfractions naturelles de l'air pour envelopper mes sujets d'un voile de lumière céleste.",
        imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80" // Prisme de lumière dorée
      },
      {
        title: "Le Grain Organique",
        subtitle: "Texture & Intemporalité",
        description: "Mes images intègrent un grain doux et une texture organique inspirée de la pellicule argentique. Cela donne à l'image numérique une dimension intemporelle, brute et presque palpable au toucher.",
        imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80" // Appareil argentique d'art
      },
      {
        title: "L'Obturateur Silencieux",
        subtitle: "Présence & Discrétion",
        description: "Le silence est mon outil le plus précieux. Grâce à un équipement haut de gamme sans aucun bruit de déclenchement, je me fonds dans vos rituels pour préserver la vérité pure de vos cercles.",
        imageUrl: "https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=600&q=80" // Fumée sacrée épurée
      }
    ]
  },
  en: {
    tagline: "The artistic signature",
    heading: "Tools of the unseen",
    items: [
      {
        title: "Pure Light",
        subtitle: "Prisms & Refractions",
        description: "I use no artificial lighting. I work exclusively with the sun, capturing natural prisms and refractions to wrap my subjects in a celestial veil of golden light.",
        imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Organic Grain",
        subtitle: "Texture & Timelessness",
        description: "My images integrate a soft grain and an organic texture inspired by analog film. This gives the digital medium a timeless, raw, and almost tactile quality.",
        imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Silent Shutter",
        subtitle: "Presence & Discretion",
        description: "Silence is my most precious tool. Thanks to high-end equipment with zero trigger noise, I seamlessly blend into your rituals to preserve the absolute truth of your spaces.",
        imageUrl: "https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }
};

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

export default function AboutPage({ 
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
    if (isEditing) return; // En mode admin, les données viennent déjà du panneau admin
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*');
      if (data) setLocalDbContent(data);
    };
    fetchContent();
  }, [isEditing]);

  const activeContent = isEditing ? dbContent : localDbContent;

  // CORRIGÉ : Ajout du type (i: any) pour rassurer le compilateur TypeScript
  const getContent = (key: string, field: 'value_fr' | 'value_en', defaultValue: string) => {
    const item = activeContent.find((i: any) => i.key === key);
    return item ? item[field] : defaultValue;
  };

  // CORRIGÉ : Ajout du type (i: any) pour rassurer le compilateur TypeScript
  const getInlineStyle = (key: string) => {
    const item = activeContent.find((i: any) => i.key === key);
    if (!item) return {};
    return {
      fontFamily: item.font_family,
      fontSize: item.font_size,
      fontWeight: item.is_bold ? 'bold' : 'light' as const,
    };
  };
  // ----------------------------------------------------

  const t = aboutHeroTranslations[language];

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      
      {/* SECTION HERO : Format contenu et apaisant (Hauteur réduite & Édition en direct active) */}
      <section className="relative h-[50vh] md:h-[58vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white">
        
        {/* Image de fond brumeuse cliquable et modifiable en direct */}
        <div
          onClick={() => {
            if (isEditing) {
              onSelectKey('about_hero_image');
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              fileInput?.click(); // Déclenche l'upload local
            }
          }}
          className={`absolute inset-0 bg-cover bg-center ${
            isEditing ? 'cursor-pointer hover:brightness-90' : ''
          } ${isEditing && selectedKey === 'about_hero_image' ? 'ring-4 ring-white/40 ring-inset' : ''}`}
          style={{
            backgroundImage: `url(${getContent('about_hero_image', 'value_fr', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80')})`,
          }}
        />

        {/* Voile d'ombrage léger pour une lisibilité parfaite des textes fins */}
        <div className="absolute inset-0 bg-neutral-950/15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-neutral-950/15 pointer-events-none" />

        {/* Contenu textuel centré et épuré */}
        <div className="relative z-10 text-center max-w-3xl space-y-4 md:space-y-6 px-4 pt-12 md:pt-16">
          
          {/* Tagline fine éditable */}
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('about_hero_tagline', e.currentTarget.innerText || '')}
            onClick={() => isEditing && onSelectKey('about_hero_tagline')}
            style={getInlineStyle('about_hero_tagline')}
            className={`font-sans text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-300 block outline-none rounded-xs whitespace-pre-wrap ${
              isEditing ? 'hover:bg-white/10 cursor-text' : ''
            } ${isEditing && selectedKey === 'about_hero_tagline' ? 'border border-dashed border-white bg-white/10' : ''}`}
          >
            {getContent('about_hero_tagline', language === 'fr' ? 'value_fr' : 'value_en', t.tagline)}
          </span>

          {/* Grand Titre (Cormorant Garamond) éditable */}
          <h1
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('about_hero_heading', e.currentTarget.innerText || '')}
            onClick={() => isEditing && onSelectKey('about_hero_heading')}
            style={getInlineStyle('about_hero_heading')}
            className={`font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide font-light leading-tight text-white outline-none rounded-xs whitespace-pre-wrap ${
              isEditing ? 'hover:bg-white/10 cursor-text' : ''
            } ${isEditing && selectedKey === 'about_hero_heading' ? 'border border-dashed border-white bg-white/10' : ''}`}
          >
            {getContent('about_hero_heading', language === 'fr' ? 'value_fr' : 'value_en', t.heading)}
          </h1>

          {/* Sous-titre descriptif éditable */}
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateText('about_hero_subheading', e.currentTarget.innerText || '')}
            onClick={() => isEditing && onSelectKey('about_hero_subheading')}
            style={getInlineStyle('about_hero_subheading')}
            className={`font-sans text-xs md:text-sm tracking-[0.12em] leading-relaxed font-light text-neutral-200 max-w-xl mx-auto outline-none rounded-xs whitespace-pre-wrap ${
              isEditing ? 'hover:bg-white/10 cursor-text' : ''
            } ${isEditing && selectedKey === 'about_hero_subheading' ? 'border border-dashed border-white bg-white/10' : ''}`}
          >
            {getContent('about_hero_subheading', language === 'fr' ? 'value_fr' : 'value_en', t.subheading)}
          </p>

        </div>

      </section>

     {/* SECTION : L'ESSENCE DE L'INSTANT (COLLAGE EFFET TIRAGES ÉPARPILLÉS SUR UNE TABLE & TEXTE RICHE DÉTAILLÉ) */}
<section className="bg-[#FAF9F6] py-20 md:py-32 px-6 lg:px-12 text-neutral-950 border-t border-neutral-200/40">
  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
    
    {/* COLONNE GAUCHE (6/12) : 7 tirages photo d'art éparpillés, superposés et éditables un à un de manière autonome */}
    <div className="lg:col-span-6 relative w-full h-[450px] md:h-[580px] select-none">
      
      {/* Photo 1 (Portrait d'âme central gauche) - Inclinaison gauche */}
      <div 
        onClick={() => {
          if (isEditing) {
            onSelectKey('about_image_0');
            // Ouvre l'explorateur local de manière autonome sans avoir besoin de référence React
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            fileInput?.click();
          }
        }}
        className={`absolute top-12 left-0 w-[44%] aspect-[3/4] overflow-hidden shadow-md -rotate-3 hover:rotate-0 hover:z-40 transition-all duration-500 cursor-pointer ${
          isEditing && selectedKey === 'about_image_0' ? 'z-40 ring-4 ring-neutral-400 ring-inset' : 'z-30'
        }`}
      >
        <img
          src={getContent('about_image_0', 'value_fr', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80')}
          alt="Portrait d'âme"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Photo 2 (Cérémonie/Mariage bas droit) - Inclinaison droite */}
      <div 
        onClick={() => {
          if (isEditing) {
            onSelectKey('about_image_1');
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            fileInput?.click();
          }
        }}
        className={`absolute bottom-6 right-0 w-[55%] aspect-[3/2] overflow-hidden shadow-lg rotate-3 hover:rotate-0 hover:z-40 transition-all duration-500 cursor-pointer ${
          isEditing && selectedKey === 'about_image_1' ? 'z-40 ring-4 ring-neutral-400 ring-inset' : 'z-25'
        }`}
      >
        <img
          src={getContent('about_image_1', 'value_fr', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80')}
          alt="Détail rituel"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Photo 3 (Vague de mer calme, carré) - Inclinaison gauche */}
      <div 
        onClick={() => {
          if (isEditing) {
            onSelectKey('about_image_2');
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            fileInput?.click();
          }
        }}
        className={`absolute top-45 left-[35%] w-[33%] aspect-[1/1] overflow-hidden opacity-75 shadow-xs -rotate-6 hover:rotate-0 hover:z-40 transition-all duration-500 cursor-pointer ${
          isEditing && selectedKey === 'about_image_2' ? 'z-40 opacity-100 ring-4 ring-neutral-400 ring-inset' : 'z-10'
        }`}
      >
        <img
          src={getContent('about_image_2', 'value_fr', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80')}
          alt="Calme océan"
          className="w-full h-full object-cover filter grayscale contrast-110"
        />
      </div>

      {/* Photo 4 (Nature/Collines vertes, bas gauche) - Inclinaison droite */}
      <div 
        onClick={() => {
          if (isEditing) {
            onSelectKey('about_image_3');
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            fileInput?.click();
          }
        }}
        className={`absolute bottom-2 left-6 w-[39%] aspect-[3/4] overflow-hidden shadow-md rotate-6 hover:rotate-0 hover:z-40 transition-all duration-500 cursor-pointer ${
          isEditing && selectedKey === 'about_image_3' ? 'z-40 ring-4 ring-neutral-400 ring-inset' : 'z-20'
        }`}
      >
        <img
          src={getContent('about_image_3', 'value_fr', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80')}
          alt="Nature sauvage"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Photo 5 (Fumée d'encens et mains rituelles, haut droit) - Inclinaison gauche */}
      <div 
        onClick={() => {
          if (isEditing) {
            onSelectKey('about_image_4');
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            fileInput?.click();
          }
        }}
        className={`absolute top-4 right-2 w-[46%] aspect-[3/2] overflow-hidden shadow-md -rotate-2 hover:rotate-0 hover:z-40 transition-all duration-500 cursor-pointer ${
          isEditing && selectedKey === 'about_image_4' ? 'z-40 ring-4 ring-neutral-400 ring-inset' : 'z-30'
        }`}
      >
        <img
          src={getContent('about_image_4', 'value_fr', 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80')}
          alt="Fumée sacrée"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Photo 6 (Sororité, cercle blanc central droit) - Inclinaison gauche */}
      <div 
        onClick={() => {
          if (isEditing) {
            onSelectKey('about_image_5');
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            fileInput?.click();
          }
        }}
        className={`absolute top-[30%] right-2 w-[52%] aspect-[3/2] overflow-hidden shadow-sm -rotate-1 hover:rotate-0 hover:z-40 transition-all duration-500 cursor-pointer ${
          isEditing && selectedKey === 'about_image_5' ? 'z-40 ring-4 ring-neutral-400 ring-inset' : 'z-15'
        }`}
      >
        <img
          src={getContent('about_image_5', 'value_fr', 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80')}
          alt="Sororité sacrée"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Photo 7 (Portrait intime en noir et blanc, en haut à gauche/milieu) - Inclinaison droite */}
      <div 
        onClick={() => {
          if (isEditing) {
            onSelectKey('about_image_6');
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            fileInput?.click();
          }
        }}
        className={`absolute top-[-10%] left-[30%] w-[32%] aspect-[3/4] overflow-hidden shadow-xs rotate-6 hover:rotate-0 hover:z-40 transition-all duration-500 cursor-pointer ${
          isEditing && selectedKey === 'about_image_6' ? 'z-40 opacity-100 ring-4 ring-neutral-400 ring-inset' : 'z-10'
        }`}
      >
        <img
          src={getContent('about_image_6', 'value_fr', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80')}
          alt="Portrait intime"
          className="w-full h-full object-cover filter grayscale contrast-110"
        />
      </div>

    </div>

    {/* COLONNE DROITE (6/12) : Textes descriptifs d'origine éditables en direct */}
    <div className="lg:col-span-6 space-y-6 lg:pl-4 text-left">
      {/* Tagline de section */}
      <span
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('about_tagline', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('about_tagline')}
        style={getInlineStyle('about_tagline')}
        className={`p-1.5 transition-all outline-none rounded-xs whitespace-pre-wrap block ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'about_tagline' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('about_tagline', language === 'fr' ? 'value_fr' : 'value_en', aboutVisionTranslations[language].tagline)}
      </span>

      {/* Titre principal de section */}
      <h2
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('about_heading', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('about_heading')}
        style={getInlineStyle('about_heading')}
        className={`p-2 transition-all outline-none rounded-xs whitespace-pre-wrap block leading-tight ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'about_heading' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('about_heading', language === 'fr' ? 'value_fr' : 'value_en', aboutVisionTranslations[language].heading)}
      </h2>

      {/* Sous-titre */}
      <p
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('about_subtitle', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('about_subtitle')}
        style={getInlineStyle('about_subtitle')}
        className={`p-2 transition-all outline-none rounded-xs whitespace-pre-wrap block leading-relaxed ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'about_subtitle' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('about_subtitle', language === 'fr' ? 'value_fr' : 'value_en', aboutVisionTranslations[language].subtitle)}
      </p>

      <div className="w-12 h-[1px] bg-neutral-300" />
      
      {/* 3 longs paragraphes éditables à l'écran */}
      <div className="space-y-5 font-sans text-sm md:text-base font-light text-neutral-600 leading-relaxed tracking-wide">
        <p
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('about_paragraph_1', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('about_paragraph_1')}
          style={getInlineStyle('about_paragraph_1')}
          className={`p-2 transition-all outline-none rounded-xs whitespace-pre-wrap block ${
            isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
          } ${isEditing && selectedKey === 'about_paragraph_1' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
        >
          {getContent('about_paragraph_1', language === 'fr' ? 'value_fr' : 'value_en', aboutVisionTranslations[language].paragraph1)}
        </p>

        <p
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('about_paragraph_2', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('about_paragraph_2')}
          style={getInlineStyle('about_paragraph_2')}
          className={`p-2 transition-all outline-none rounded-xs whitespace-pre-wrap block ${
            isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
          } ${isEditing && selectedKey === 'about_paragraph_2' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
        >
          {getContent('about_paragraph_2', language === 'fr' ? 'value_fr' : 'value_en', aboutVisionTranslations[language].paragraph2)}
        </p>

        <p
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('about_paragraph_3', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('about_paragraph_3')}
          style={getInlineStyle('about_paragraph_3')}
          className={`p-2 transition-all outline-none rounded-xs whitespace-pre-wrap block ${
            isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
          } ${isEditing && selectedKey === 'about_paragraph_3' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
        >
          {getContent('about_paragraph_3', language === 'fr' ? 'value_fr' : 'value_en', aboutVisionTranslations[language].paragraph3)}
        </p>
      </div>

      {/* Bouton de redirection d'origine */}
      <div className="pt-4">
        <Link
          href="/portfolio"
          className="text-xs uppercase tracking-[0.25em] font-light text-neutral-900 border-b border-neutral-900/20 pb-2 hover:border-neutral-950 transition-all duration-300 inline-block"
        >
          {aboutVisionTranslations[language].buttonText}
        </Link>
      </div>
    </div>

  </div>
</section>

{/* SECTION : L'EXPÉRIENCE DE L'ESPACE SACRÉ (COMPOSITION DUO ÉPURÉE & TEXTE DYNAMIQUE) */}
<section className="bg-[#FAF9F6] pt-12 pb-32 md:pb-44 px-6 lg:px-12 text-neutral-950 border-t border-neutral-200/40">
  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
    
    {/* COLONNE GAUCHE (5/12) : Explication de la démarche rituelle éditable */}
    <div className="lg:col-span-5 space-y-6">
      
      {/* Tagline de section éditable */}
      <span
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('experience_tagline', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('experience_tagline')}
        style={getInlineStyle('experience_tagline')}
        className={`font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block outline-none rounded-xs whitespace-pre-wrap ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'experience_tagline' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('experience_tagline', language === 'fr' ? 'value_fr' : 'value_en', aboutExperienceTranslations[language].tagline)}
      </span>

      {/* Titre Principal de section éditable */}
      <h2
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('experience_heading', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('experience_heading')}
        style={getInlineStyle('experience_heading')}
        className={`font-serif text-3xl md:text-4xl tracking-wide font-light text-neutral-900 leading-tight outline-none rounded-xs whitespace-pre-wrap block ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'experience_heading' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('experience_heading', language === 'fr' ? 'value_fr' : 'value_en', aboutExperienceTranslations[language].heading)}
      </h2>

      <div className="w-12 h-[1px] bg-neutral-300" />
      
      {/* Paragraphes explicatifs éditables */}
      <div className="space-y-5 font-sans text-sm md:text-base font-light text-neutral-600 leading-relaxed tracking-wide text-left">
        <p
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('experience_desc1', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('experience_desc1')}
          style={getInlineStyle('experience_desc1')}
          className={`font-medium text-neutral-800 outline-none rounded-xs whitespace-pre-wrap ${
            isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
          } ${isEditing && selectedKey === 'experience_desc1' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
        >
          {getContent('experience_desc1', language === 'fr' ? 'value_fr' : 'value_en', aboutExperienceTranslations[language].description1)}
        </p>

        <p
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('experience_desc2', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('experience_desc2')}
          style={getInlineStyle('experience_desc2')}
          className={`font-sans text-sm md:text-base font-light text-neutral-600 leading-relaxed tracking-wide outline-none rounded-xs whitespace-pre-wrap block ${
            isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
          } ${isEditing && selectedKey === 'experience_desc2' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
        >
          {getContent('experience_desc2', language === 'fr' ? 'value_fr' : 'value_en', aboutExperienceTranslations[language].description2)}
        </p>
      </div>
    </div>

    {/* COLONNE DROITE (7/12) : Composition de 2 images d'art asymétriques superposées et éditables */}
    <div className="lg:col-span-7 relative w-full flex items-center justify-center py-8">
      
      {/* Photo Principale (Grand format vertical, lever de soleil brumeux) */}
      <div 
        onClick={() => {
          if (isEditing) {
            onSelectKey('experience_image_1');
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            fileInput?.click(); // Déclenche l'upload local
          }
        }}
        className={`overflow-hidden aspect-[3/4] relative shadow-sm ${
          isEditing ? 'cursor-pointer hover:brightness-95' : ''
        } ${isEditing && selectedKey === 'experience_image_1' ? 'z-30 ring-4 ring-neutral-400 ring-inset w-[62%]' : 'z-10 w-[62%]'}`}
      >
        <img
          src={getContent('experience_image_1', 'value_fr', 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=800&q=80')}
          alt="Matin calme et brume sacrée"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-neutral-900/5 pointer-events-none" />
      </div>

      {/* Photo Secondaire (Format carré rituels, vient chevaucher doucement) */}
      <div 
        onClick={() => {
          if (isEditing) {
            onSelectKey('experience_image_2');
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            fileInput?.click();
          }
        }}
        className={`overflow-hidden shadow-lg absolute bottom-[-10px] right-4 md:right-8 transition-all duration-700 ${
          isEditing ? 'cursor-pointer hover:brightness-95' : 'hover:scale-102'
        } ${isEditing && selectedKey === 'experience_image_2' ? 'z-40 ring-4 ring-neutral-400 ring-inset w-[42%] aspect-[1/1]' : 'z-20 w-[42%] aspect-[1/1]'}`}
      >
        <img
          src={getContent('experience_image_2', 'value_fr', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80')}
          alt="Connexion sacrée à la terre"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-neutral-900/5 pointer-events-none" />
      </div>

    </div>

  </div>
</section>

{/* SECTION : LES OUTILS DE L'INVISIBLE (CADRE MARIE-LOUISE AVEC GAP LATÉRAL DYNAMIQUE) */}
<section className="bg-[#FAF9F6] pt-12 pb-32 md:pb-44 px-6 lg:px-12 text-neutral-950 border-t border-neutral-200/40">
  <div className="max-w-6xl mx-auto space-y-16 md:space-y-24">
    
    {/* En-tête de section centré et minimaliste éditable en direct à l'écran */}
    <div className="text-center space-y-4 max-w-xl mx-auto">
      
      {/* Tagline éditable */}
      <span
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('signature_tagline', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('signature_tagline')}
        style={getInlineStyle('signature_tagline')}
        className={`font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block animate-fade-in outline-none rounded-xs whitespace-pre-wrap ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'signature_tagline' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('signature_tagline', language === 'fr' ? 'value_fr' : 'value_en', aboutSignatureTranslations[language].tagline)}
      </span>

      {/* Titre de section éditable */}
      <h2
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('signature_heading', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('signature_heading')}
        style={getInlineStyle('signature_heading')}
        className={`font-serif text-3xl md:text-5xl tracking-wide font-light text-neutral-800 leading-tight outline-none rounded-xs whitespace-pre-wrap block ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'signature_heading' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('signature_heading', language === 'fr' ? 'value_fr' : 'value_en', aboutSignatureTranslations[language].heading)}
      </h2>

      <div className="w-12 h-[1px] bg-neutral-300 mx-auto mt-6" />
    </div>

    {/* GRILLE DES OUTILS DÉTAILLÉE (3 Colonnes avec cadre Pass-Partout blanc d'exposition) */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
      {[0, 1, 2].map((index) => {
        const item = aboutSignatureTranslations[language].items[index];
        const imageKey = `signature_image_${index}`;
        const subtitleKey = `signature_subtitle_${index}`;
        const titleKey = `signature_title_${index}`;
        const descKey = `signature_description_${index}`;
        const isSelected = selectedKey === imageKey;

        return (
          <div 
            key={index} 
            className="flex flex-col space-y-6 group text-left"
          >
            {/* Cadre Marie-Louise cliquable et modifiable de manière autonome */}
            <div 
              onClick={() => {
                if (isEditing) {
                  onSelectKey(imageKey);
                  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                  fileInput?.click(); // Déclenche l'upload local
                }
              }}
              className={`bg-white p-4 shadow-sm border transition-all duration-500 cursor-pointer ${
                isEditing ? 'hover:shadow-md' : 'hover:shadow-md'
              } ${isEditing && isSelected ? 'ring-4 ring-neutral-400 ring-inset border-transparent' : 'border-neutral-200/10'}`}
            >
              <div className="overflow-hidden aspect-[3/4] relative">
                <img
                  src={getContent(imageKey, 'value_fr', item.imageUrl)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-neutral-900/5 pointer-events-none" />
              </div>
            </div>

            {/* Descriptif simple, ultra-lisible et éditable au clic */}
            <div className="space-y-2 px-1">
              
              {/* Sous-titre éditable */}
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => onUpdateText(subtitleKey, e.currentTarget.innerText || '')}
                onClick={() => isEditing && onSelectKey(subtitleKey)}
                style={getInlineStyle(subtitleKey)}
                className={`font-sans text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block outline-none rounded-xs whitespace-pre-wrap ${
                  isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
                } ${isEditing && selectedKey === subtitleKey ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
              >
                {getContent(subtitleKey, language === 'fr' ? 'value_fr' : 'value_en', item.subtitle)}
              </span>

              {/* Titre éditable */}
              <h3
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => onUpdateText(titleKey, e.currentTarget.innerText || '')}
                onClick={() => isEditing && onSelectKey(titleKey)}
                style={getInlineStyle(titleKey)}
                className={`font-serif text-xl md:text-2xl tracking-wide font-light text-neutral-900 leading-snug outline-none rounded-xs whitespace-pre-wrap block ${
                  isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
                } ${isEditing && selectedKey === titleKey ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
              >
                {getContent(titleKey, language === 'fr' ? 'value_fr' : 'value_en', item.title)}
              </h3>

              {/* Description longue éditable */}
              <p
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => onUpdateText(descKey, e.currentTarget.innerText || '')}
                onClick={() => isEditing && onSelectKey(descKey)}
                style={getInlineStyle(descKey)}
                className={`font-sans text-xs md:text-sm font-light text-neutral-500 leading-relaxed tracking-wide pt-2 outline-none rounded-xs whitespace-pre-wrap block ${
                  isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
                } ${isEditing && selectedKey === descKey ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
              >
                {getContent(descKey, language === 'fr' ? 'value_fr' : 'value_en', item.description)}
              </p>

            </div>

          </div>
        );
      })}
    </div>

  </div>
</section>

{/* SECTION : CALL TO ACTION D'À PROPOS (L'INVITATION SACRÉE DYNAMIQUE SUR GRANDE PHOTO PANORAMIQUE) */}
<section className="relative h-[65vh] md:h-[75vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white">
  
  {/* Grande image panoramique spirituelle en arrière-plan (Cliquable et modifiable de manière autonome d'À Propos) */}
  <div
    onClick={() => {
      if (isEditing) {
        onSelectKey('about_cta_bg_image');
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        fileInput?.click(); // Déclenche l'upload local
      }
    }}
    className={`absolute inset-0 transition-transform duration-[4000ms] ease-out group-hover:scale-105 bg-cover bg-center ${
      isEditing ? 'cursor-pointer hover:brightness-90' : ''
    } ${isEditing && selectedKey === 'about_cta_bg_image' ? 'ring-4 ring-white/40 ring-inset' : ''}`}
    style={{
      backgroundImage: `url(${getContent('about_cta_bg_image', 'value_fr', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80')})`,
    }}
  />

  {/* Double couche d'assombrissement renforcée pour faire ressortir le texte blanc */}
  <div className="absolute inset-0 bg-neutral-950/50 pointer-events-none" />
  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/10 via-black/10 to-neutral-950/10 pointer-events-none" />

  {/* Contenu de l'invitation */}
  <div className="relative z-10 text-center max-w-3xl space-y-6 md:space-y-8 px-4">
    
    {/* Tagline éditable en direct */}
    <span
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={(e) => onUpdateText('about_cta_tagline', e.currentTarget.innerText || '')}
      onClick={() => isEditing && onSelectKey('about_cta_tagline')}
      style={getInlineStyle('about_cta_tagline')}
      className={`font-sans text-xs md:text-sm tracking-[0.35em] uppercase font-light text-neutral-300 block outline-none rounded-xs whitespace-pre-wrap ${
        isEditing ? 'hover:bg-white/10 cursor-text animate-none' : 'animate-pulse'
      } ${isEditing && selectedKey === 'about_cta_tagline' ? 'border border-dashed border-white bg-white/10' : ''}`}
    >
      {getContent('about_cta_tagline', language === 'fr' ? 'value_fr' : 'value_en', ctaSectionTranslations[language].tagline)}
    </span>

    {/* Grand Titre artistique bien visible (Cormorant Garamond) éditable */}
    <h2
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={(e) => onUpdateText('about_cta_heading', e.currentTarget.innerText || '')}
      onClick={() => isEditing && onSelectKey('about_cta_heading')}
      style={getInlineStyle('about_cta_heading')}
      className={`font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide font-light leading-tight text-white outline-none rounded-xs whitespace-pre-wrap ${
        isEditing ? 'hover:bg-white/10 cursor-text' : ''
      } ${isEditing && selectedKey === 'about_cta_heading' ? 'border border-dashed border-white bg-white/10' : ''}`}
    >
      {getContent('about_cta_heading', language === 'fr' ? 'value_fr' : 'value_en', ctaSectionTranslations[language].heading)}
    </h2>

    {/* Descriptif poétique éditable */}
    <p
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={(e) => onUpdateText('about_cta_description', e.currentTarget.innerText || '')}
      onClick={() => isEditing && onSelectKey('about_cta_description')}
      style={getInlineStyle('about_cta_description')}
      className={`font-sans text-sm md:text-base tracking-[0.12em] leading-relaxed font-light text-neutral-200 max-w-2xl mx-auto outline-none rounded-xs whitespace-pre-wrap ${
        isEditing ? 'hover:bg-white/10 cursor-text' : ''
      } ${isEditing && selectedKey === 'about_cta_description' ? 'border border-dashed border-white bg-white/10' : ''}`}
    >
      {getContent('about_cta_description', language === 'fr' ? 'value_fr' : 'value_en', ctaSectionTranslations[language].description)}
    </p>

    {/* Bouton d'action minimaliste et élégant (Texte du bouton éditable au clic) */}
    <div className="pt-4">
      <Link
        href="/contact"
        onClick={(e) => {
          if (isEditing) {
            e.preventDefault(); // Évite la redirection de page lors de l'édition
          }
        }}
        className="bg-white/10 backdrop-blur-md border border-white/40 text-white text-[10px] md:text-xs uppercase tracking-[0.25em] font-light px-10 py-4 hover:bg-white hover:text-neutral-900 hover:border-white transition-all duration-500 inline-block rounded-none shadow-md cursor-pointer"
      >
        <span
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('about_cta_button_text', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('about_cta_button_text')}
          style={getInlineStyle('about_cta_button_text')}
          className={`outline-none whitespace-pre-wrap ${isEditing ? 'cursor-text' : ''}`}
        >
          {getContent('about_cta_button_text', language === 'fr' ? 'value_fr' : 'value_en', ctaSectionTranslations[language].buttonText)}
        </span>
      </Link>
    </div>

  </div>
</section>

{/* SECTION : INTEGRATION INSTAGRAM D'À PROPOS (LUMIÈRE & COMMUNION GLOBALE) */}
<section className="bg-[#FAF9F6] pt-12 pb-8 md:pb-12 px-4 md:px-8 border-t border-neutral-200/40">
  <div className="w-full space-y-16">
    
    {/* En-tête de section avec votre nom de compte IG mis en valeur et éditable */}
    <div className="text-center space-y-4 max-w-xl mx-auto">
      
      {/* Tagline éditable */}
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
      
      {/* Votre lien de compte Instagram artistique éditable en direct */}
      <div className="pt-2">
        <a 
          href="https://www.instagram.com/animaelumen" 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => {
            if (isEditing) {
              e.preventDefault(); // Évite la redirection lors du clic en mode édition
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

      {/* Paragraphe descriptif éditable sous le lien */}
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

    {/* CONTAINER DU WIDGET FOUITA (Intact et sécurisé) */}
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

    {/* Bouton d'invitation à s'abonner (Texte du bouton éditable au clic) */}
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