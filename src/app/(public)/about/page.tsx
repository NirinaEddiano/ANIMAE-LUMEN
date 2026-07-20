'use client';

import { useState, useEffect } from 'react'; 
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import InstagramSection from '@/components/InstagramSection';

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
    heading: "L'expérience de l'espace sacré",
    description1: "Pour que l'âme accepte de se révéler, elle a besoin d'une sécurité absolue. C'est pourquoi je n'interviens jamais comme une simple observatrice extérieure. Je marche à vos côtés, je respire au rythme de vos rituels, et je me fonds doucement dans le silence de votre espace.",
    description2: "Sans flash, sans staging ni mise en scène artificielle, je travaille exclusivement en lumière naturelle. J'utilise un obturateur totalement silencieux pour préserver la pureté de vos instants de recueillement et la synergie de vos cercles. Vous êtes libre d'être, de pleurer, de danser, d'exister. Je me fais simplement gardienne de votre vérité.",
  },
  en: {
    tagline: "The experience & process",
    heading: "The sacred space experience",
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
        imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Le Grain Organique",
        subtitle: "Texture & Intemporalité",
        description: "Mes images intègrent un grain doux et une texture organique inspirée de la pellicule argentique. Cela donne à l'image numérique une dimension intemporelle, brute et presque palpable au toucher.",
        imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "L'Obturateur Silencieux",
        subtitle: "Présence & Discrétion",
        description: "Le silence est mon outil le plus précieux. Grâce à un équipement haut de gamme sans aucun bruit de déclenchement, je me fonds dans vos rituels pour préserver la vérité pure de vos cercles.",
        imageUrl: "https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=600&q=80"
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

  const [localDbContent, setLocalDbContent] = useState<any[]>([]);

  useEffect(() => {
    if (isEditing) return;
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

  const t = aboutHeroTranslations[language];

  const IMAGE_KEYS = ['about_image_0', 'about_image_1', 'about_image_2', 'about_image_3', 'about_image_4', 'about_image_5', 'about_image_6'];
  const IMAGE_FALLBACKS = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  ];

  const handleImageClick = (key: string) => {
    if (isEditing) {
      onSelectKey(key);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      fileInput?.click();
    }
  };

  const bgTexture = getContent('portfolio_grid_bg_texture', 'value_fr', '');

  const BLOB_RADII = [
    '60% 40% 30% 70% / 60% 30% 70% 40%',
    '40% 60% 70% 30% / 50% 60% 40% 50%',
    '55% 45% 65% 35% / 45% 65% 35% 55%',
  ];

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      
      {/* SECTION HERO */}
      <section className="relative h-[50vh] md:h-[58vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white">
        
        <div
          onClick={() => handleImageClick('about_hero_image')}
          className={`absolute inset-0 bg-cover bg-center ${
            isEditing ? 'cursor-pointer hover:brightness-90' : ''
          } ${isEditing && selectedKey === 'about_hero_image' ? 'ring-4 ring-white/40 ring-inset' : ''}`}
          style={{
            backgroundImage: `url(${getContent('about_hero_image', 'value_fr', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80')})`,
          }}
        />

        <div className="absolute inset-0 bg-neutral-950/15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-neutral-950/15 pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl space-y-4 md:space-y-6 px-4 pt-12 md:pt-16">
          
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

     {/* SECTION 1 : L'ESSENCE DE L'INSTANT — Collage asymétrique avec tirages encadrés */}
<section className="relative overflow-hidden bg-[#E6E3DB] py-20 md:py-32 px-6 lg:px-12 text-neutral-950 border-t border-neutral-200/40">
  <div
    className="absolute inset-0 z-0 pointer-events-none opacity-[0.55] mix-blend-multiply"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3' result='noise'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23ffffff' surfaceScale='1.2'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '180px 180px',
    }}
  />
  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
    
    {/* COLONNE GAUCHE : 7 tirages éparpillés avec cadre blanc (passe-partout) */}
    <div className="lg:col-span-6 relative w-full h-[450px] md:h-[580px] select-none">
      
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const positions = [
          'top-12 left-0 w-[44%] aspect-[3/4] -rotate-3',
          'bottom-6 right-0 w-[55%] aspect-[3/2] rotate-3',
          'top-45 left-[35%] w-[33%] aspect-[1/1] -rotate-6 opacity-75',
          'bottom-2 left-6 w-[39%] aspect-[3/4] rotate-6',
          'top-4 right-2 w-[46%] aspect-[3/2] -rotate-2',
          'top-[30%] right-2 w-[52%] aspect-[3/2] -rotate-1',
          'top-[-10%] left-[30%] w-[32%] aspect-[3/4] rotate-6',
        ];
        const selected = isEditing && selectedKey === IMAGE_KEYS[i];
        return (
          <div
            key={i}
            onClick={() => handleImageClick(IMAGE_KEYS[i])}
            className={`absolute ${positions[i]} overflow-hidden transition-all duration-500 cursor-pointer ${
              selected ? 'z-40 ring-4 ring-neutral-400' : 'hover:z-40 hover:rotate-0'
            }`}
          >
            {/* Cadre blanc (passe-partout) */}
            <div className="bg-white p-2 shadow-md">
              <div className="aspect-[3/4] overflow-hidden bg-neutral-100 relative">
                <img
                  src={getContent(IMAGE_KEYS[i], 'value_fr', IMAGE_FALLBACKS[i])}
                  alt=""
                  className={`w-full h-full object-cover ${i === 2 || i === 6 ? 'grayscale contrast-110' : ''}`}
                />
              </div>
            </div>
          </div>
        );
      })}

    </div>

    {/* COLONNE DROITE : Textes */}
    <div className="lg:col-span-6 space-y-6 lg:pl-4 text-left">
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

      <h2
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('about_heading', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('about_heading')}
        style={getInlineStyle('about_heading')}
        className={`font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide font-light text-neutral-900 leading-tight outline-none rounded-xs whitespace-pre-wrap block ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'about_heading' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('about_heading', language === 'fr' ? 'value_fr' : 'value_en', aboutVisionTranslations[language].heading)}
      </h2>

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

{/* SECTION 2 : L'EXPÉRIENCE DE L'ESPACE SACRÉ — Arche éditoriale, composition asymétrique */}
<section className="relative overflow-hidden bg-[#D4D5C8] py-20 md:py-32 px-6 lg:px-12 border-t border-neutral-300/40">
  <div
    className="absolute inset-0 z-0 pointer-events-none opacity-[0.55] mix-blend-multiply"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3' result='noise'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23ffffff' surfaceScale='1.2'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '180px 180px',
    }}
  />
  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
    
    {/* COLONNE GAUCHE (5/12) : Texte ajusté */}
    <div className="lg:col-span-5 space-y-5">
      
      <span
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('experience_tagline', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('experience_tagline')}
        style={getInlineStyle('experience_tagline')}
        className={`font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-500 block outline-none rounded-xs whitespace-pre-wrap ${
          isEditing ? 'hover:bg-black/5 cursor-text' : ''
        } ${isEditing && selectedKey === 'experience_tagline' ? 'border border-dashed border-neutral-400 bg-black/5' : ''}`}
      >
        {getContent('experience_tagline', language === 'fr' ? 'value_fr' : 'value_en', aboutExperienceTranslations[language].tagline)}
      </span>

      <h2
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('experience_heading', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('experience_heading')}
        style={getInlineStyle('experience_heading')}
        className={`font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide font-light text-neutral-900 leading-tight outline-none rounded-xs whitespace-pre-wrap block ${
          isEditing ? 'hover:bg-black/5 cursor-text' : ''
        } ${isEditing && selectedKey === 'experience_heading' ? 'border border-dashed border-neutral-400 bg-black/5' : ''}`}
      >
        {getContent('experience_heading', language === 'fr' ? 'value_fr' : 'value_en', aboutExperienceTranslations[language].heading)}
      </h2>

      <div className="w-12 h-[1px] bg-neutral-400/50" />
      
      <div className="space-y-4 font-sans text-sm md:text-base font-light text-neutral-700 leading-relaxed tracking-wide text-left">
        <p
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('experience_desc1', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('experience_desc1')}
          style={getInlineStyle('experience_desc1')}
          className={`font-medium text-neutral-800 outline-none rounded-xs whitespace-pre-wrap ${
            isEditing ? 'hover:bg-black/5 cursor-text' : ''
          } ${isEditing && selectedKey === 'experience_desc1' ? 'border border-dashed border-neutral-400 bg-black/5' : ''}`}
        >
          {getContent('experience_desc1', language === 'fr' ? 'value_fr' : 'value_en', aboutExperienceTranslations[language].description1)}
        </p>

        <p
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateText('experience_desc2', e.currentTarget.innerText || '')}
          onClick={() => isEditing && onSelectKey('experience_desc2')}
          style={getInlineStyle('experience_desc2')}
          className={`outline-none rounded-xs whitespace-pre-wrap block ${
            isEditing ? 'hover:bg-black/5 cursor-text' : ''
          } ${isEditing && selectedKey === 'experience_desc2' ? 'border border-dashed border-neutral-400 bg-black/5' : ''}`}
        >
          {getContent('experience_desc2', language === 'fr' ? 'value_fr' : 'value_en', aboutExperienceTranslations[language].description2)}
        </p>
      </div>
    </div>

    {/* COLONNE DROITE (7/12) : Arche + carré chevauchant */}
    <div className="lg:col-span-7 flex items-center justify-center">
      
      {/* Conteneur de la composition */}
      <div className="relative w-full max-w-[500px]">
        
        {/* Grande image en arche (rounded-t-full) */}
        <div
          onClick={() => handleImageClick('experience_image_1')}
          className={`relative w-[65%] h-[500px] md:h-[550px] mx-auto overflow-hidden shadow-sm rounded-t-full ${
            isEditing ? 'cursor-pointer hover:brightness-95' : ''
          } ${isEditing && selectedKey === 'experience_image_1' ? 'ring-4 ring-neutral-400' : ''}`}
        >
          <img
            src={getContent('experience_image_1', 'value_fr', 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=800&q=80')}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900/5 pointer-events-none" />
        </div>

        {/* Petite image carrée chevauchant le bas droit de l'arche */}
        <div
          onClick={() => handleImageClick('experience_image_2')}
          className={`absolute bottom-0 right-0 w-[45%] aspect-square z-20 bg-white p-1 shadow-lg ${
            isEditing ? 'cursor-pointer hover:brightness-95' : ''
          } ${isEditing && selectedKey === 'experience_image_2' ? 'ring-4 ring-neutral-400' : ''}`}
        >
          <img
            src={getContent('experience_image_2', 'value_fr', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80')}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

      </div>

    </div>

  </div>
</section>

{/* SECTION 3 : LES OUTILS DE L'INVISIBLE — Formes organiques "blob", fond bicolore */}
<section className="relative overflow-hidden bg-[#FAF9F6] py-20 md:py-32 px-6 lg:px-12 text-neutral-950 border-t border-neutral-200/40">

  {/* Moitié haute beige sable */}
  <div className="absolute inset-x-0 top-0 h-1/2 bg-[#E6E3DB] z-[1]" />

  {/* Texture d'art neutre diffusée sur l'ensemble des deux moitiés */}
  <div
    className="absolute inset-0 z-[2] pointer-events-none opacity-[0.55] mix-blend-multiply"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3' result='noise'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23ffffff' surfaceScale='1.2'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '180px 180px',
    }}
  />

  <div className="relative z-10 max-w-6xl mx-auto space-y-16 md:space-y-24">
    
    <div className="text-center space-y-4 max-w-xl mx-auto">
      
      <span
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdateText('signature_tagline', e.currentTarget.innerText || '')}
        onClick={() => isEditing && onSelectKey('signature_tagline')}
        style={getInlineStyle('signature_tagline')}
        className={`font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block outline-none rounded-xs whitespace-pre-wrap ${
          isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
        } ${isEditing && selectedKey === 'signature_tagline' ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
      >
        {getContent('signature_tagline', language === 'fr' ? 'value_fr' : 'value_en', aboutSignatureTranslations[language].tagline)}
      </span>

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

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
      {[0, 1, 2].map((index) => {
        const item = aboutSignatureTranslations[language].items[index];
        const imageKey = `signature_image_${index}`;
        const subtitleKey = `signature_subtitle_${index}`;
        const titleKey = `signature_title_${index}`;
        const descKey = `signature_description_${index}`;
        const isSelected = selectedKey === imageKey;

        return (
          <div key={index} className="flex flex-col items-center text-center group">
            {/* Forme organique "blob" */}
            <div
              onClick={() => handleImageClick(imageKey)}
              className={`overflow-hidden shadow-sm transition-all duration-500 cursor-pointer w-full ${
                isEditing ? 'hover:shadow-md' : 'hover:shadow-md'
              } ${isEditing && isSelected ? 'ring-4 ring-neutral-400' : ''}`}
              style={{ borderRadius: BLOB_RADII[index] }}
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={getContent(imageKey, 'value_fr', item.imageUrl)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-neutral-900/5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2 px-1 mt-8">
              
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => onUpdateText(subtitleKey, e.currentTarget.innerText || '')}
                onClick={() => isEditing && onSelectKey(subtitleKey)}
                style={getInlineStyle(subtitleKey)}
                className={`font-sans text-xs tracking-[0.25em] uppercase text-neutral-800 font-light block outline-none rounded-xs whitespace-pre-wrap ${
                  isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
                } ${isEditing && selectedKey === subtitleKey ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
              >
                {getContent(subtitleKey, language === 'fr' ? 'value_fr' : 'value_en', item.subtitle)}
              </span>

              <h3
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => onUpdateText(titleKey, e.currentTarget.innerText || '')}
                onClick={() => isEditing && onSelectKey(titleKey)}
                style={getInlineStyle(titleKey)}
                className={`font-serif text-2xl md:text-3xl tracking-wide font-light text-black leading-snug outline-none rounded-xs whitespace-pre-wrap block ${
                  isEditing ? 'hover:bg-neutral-100 cursor-text' : ''
                } ${isEditing && selectedKey === titleKey ? 'border border-dashed border-neutral-400 bg-neutral-100' : ''}`}
              >
                {getContent(titleKey, language === 'fr' ? 'value_fr' : 'value_en', item.title)}
              </h3>

              <p
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => onUpdateText(descKey, e.currentTarget.innerText || '')}
                onClick={() => isEditing && onSelectKey(descKey)}
                style={getInlineStyle(descKey)}
                className={`font-sans text-sm md:text-base font-light text-neutral-900 leading-relaxed tracking-wide pt-2 outline-none rounded-xs whitespace-pre-wrap block ${
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

{/* SECTION CTA */}
<section className="relative h-[65vh] md:h-[75vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white">
  
  <div
    onClick={() => handleImageClick('about_cta_bg_image')}
    className={`absolute inset-0 bg-cover bg-center transition-transform duration-[4000ms] ease-out ${
      isEditing ? 'cursor-pointer hover:brightness-90' : ''
    } ${isEditing && selectedKey === 'about_cta_bg_image' ? 'ring-4 ring-white/40 ring-inset' : ''}`}
    style={{
      backgroundImage: `url(${getContent('about_cta_bg_image', 'value_fr', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80')})`,
    }}
  />

  <div className="absolute inset-0 bg-neutral-950/50 pointer-events-none" />
  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/10 via-black/10 to-neutral-950/10 pointer-events-none" />

  <div className="relative z-10 text-center max-w-3xl space-y-6 md:space-y-8 px-4">
    
    <span
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={(e) => onUpdateText('about_cta_tagline', e.currentTarget.innerText || '')}
      onClick={() => isEditing && onSelectKey('about_cta_tagline')}
      style={getInlineStyle('about_cta_tagline')}
      className={`font-sans text-xs md:text-sm tracking-[0.35em] uppercase font-light text-neutral-300 block outline-none rounded-xs whitespace-pre-wrap ${
        isEditing ? 'hover:bg-white/10 cursor-text' : ''
      } ${isEditing && selectedKey === 'about_cta_tagline' ? 'border border-dashed border-white bg-white/10' : ''}`}
    >
      {getContent('about_cta_tagline', language === 'fr' ? 'value_fr' : 'value_en', ctaSectionTranslations[language].tagline)}
    </span>

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

    <div className="pt-4">
      <Link
        href="/contact"
        onClick={(e) => {
          if (isEditing) e.preventDefault();
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
