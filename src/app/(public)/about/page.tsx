'use client';

import { useState, useEffect } from 'react'; 
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { fontFamilyWithFallback, isHiddenKey, isUntranslated } from '@/lib/content';

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

  // Masquage choisis par l'administrateur : un bloc disparait du site
  // public quand TOUS ses contenus sont masques. La condition 'every'
  // evite de laisser un trou de mise en page si un seul element reste.
  const hidden = (...keys: string[]) => keys.every((k) => isHiddenKey(activeContent, k));

  const getContent = (key: string, field: 'value_fr' | 'value_en', defaultValue: string) => {
    const item = activeContent.find((i: any) => i.key === key);
    if (item?.is_deleted) return '';
    // EN identique au FR (traduction jamais faite) → repli anglais codé en dur.
    // Côté FR, value_fr fait toujours foi.
    if (!item || (field === 'value_en' && isUntranslated(item))) return defaultValue;
    return ((item[field] as string) || '').trim() || defaultValue;
  };

  const getImage = (key: string, defaultValue: string) => {
    const item = activeContent.find((i: { key: string }) => i.key === key) as
      | { value_fr?: string; value_en?: string; is_deleted?: boolean }
      | undefined;
    if (item?.is_deleted) return '';
    // Les URL d'images sont identiques dans les deux colonnes : on accepte les deux.
    return item?.value_en || item?.value_fr || defaultValue;
  };

  const getInlineStyle = (key: string) => {
    const item = activeContent.find((i: any) => i.key === key);
    if (!item) return {};
    return {
      fontFamily: fontFamilyWithFallback(item.font_family),
      fontSize: item.font_size,
      fontWeight: item.is_bold ? 'bold' : 'light' as const,
    };
  };

  const getStampClass = (key: string): string => {
    const item = activeContent.find((i: any) => i.key === key);
    return item?.is_stamped ? 'effect-letterpress' : '';
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

  return (
    <main className="min-h-screen bg-[#fcf7f3]">
      
      {/* SECTION HERO */}
      <section className={`relative h-[50vh] md:h-[58vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white ${hidden('about_hero_image', 'about_hero_tagline', 'about_hero_heading', 'about_hero_subheading') ? 'hidden' : ''}`}>
        
        <div
          onClick={() => handleImageClick('about_hero_image')}
          className={`absolute inset-0 bg-cover bg-center grayscale ${
            isEditing ? 'cursor-pointer hover:brightness-90' : ''
          } ${isEditing && selectedKey === 'about_hero_image' ? 'ring-4 ring-white/40 ring-inset' : ''}`}
          style={{
            backgroundImage: `url(${getImage('about_hero_image', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80')})`,
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

     {/* SECTION 1 : L'ESSENCE DE L'INSTANT — Intro éditoriale + grille plein cadre serrée */}
<section className={`relative overflow-hidden bg-[#fcf7f3] py-20 md:py-32 px-6 lg:px-12 text-neutral-950 ${hidden('about_tagline', 'about_subtitle', 'about_heading', 'about_paragraph_1', 'about_paragraph_2', 'about_paragraph_3') ? 'hidden' : ''}`}>
  <div className="max-w-4xl mx-auto text-center">

    {/* INTRO ÉDITORIALE (style souls) */}
    <div className="space-y-6 md:space-y-8">
      
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
        className={`font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide font-light text-neutral-900 leading-tight outline-none rounded-xs whitespace-pre-wrap block art-letterpress ${getStampClass('about_heading')} ${
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

      <div className="w-12 h-[1px] bg-neutral-300 mx-auto" />
      
      <div className="space-y-5 font-sans text-sm md:text-base font-light text-neutral-600 leading-relaxed tracking-wide max-w-3xl mx-auto">
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

  {/* GRILLE PLEIN CADRE (3 photos seulement, largeur réduite) */}
  <div className="mt-16 md:mt-20 max-w-4xl mx-auto grid grid-cols-3 gap-1 md:gap-3">
    {[0, 1, 2].map((i) => {
      const aspect = 'aspect-[3/4]';
      const selected = isEditing && selectedKey === IMAGE_KEYS[i];
      return (
        <div
          key={i}
          onClick={() => handleImageClick(IMAGE_KEYS[i])}
          className={`group relative overflow-hidden cursor-pointer ${aspect} ${
            selected ? 'ring-4 ring-neutral-400' : ''
          }`}
        >
          <img
            src={getImage(IMAGE_KEYS[i], IMAGE_FALLBACKS[i])}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
          />
        </div>
      );
    })}
  </div>
</section>

{/* SECTION 2 : L'EXPÉRIENCE DE L'ESPACE SACRÉ — Arche éditoriale, composition asymétrique */}
<section className={`relative overflow-hidden bg-[#fcf7f3] py-20 md:py-32 px-6 lg:px-12 ${hidden('experience_tagline', 'experience_heading', 'experience_desc1', 'experience_desc2', 'experience_image_1', 'experience_image_2') ? 'hidden' : ''}`}>
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
        className={`font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide font-light text-neutral-900 leading-tight outline-none rounded-xs whitespace-pre-wrap block ${getStampClass('experience_heading')} ${
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

    {/* COLONNE DROITE (7/12) : Grille plein cadre serrée (style souls) */}
    <div className="lg:col-span-7">
      
      <div className="grid grid-cols-2 gap-1">
        
        {/* Grande image plein cadre */}
        <div
          onClick={() => handleImageClick('experience_image_1')}
          className={`group relative aspect-[3/4] overflow-hidden ${
            isEditing ? 'cursor-pointer hover:brightness-95' : ''
          } ${isEditing && selectedKey === 'experience_image_1' ? 'ring-4 ring-neutral-400' : ''}`}
        >
          <img
            src={getImage('experience_image_1', 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=800&q=80')}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
          />
        </div>

        {/* Image carrée plein cadre */}
        <div
          onClick={() => handleImageClick('experience_image_2')}
          className={`group relative aspect-[3/4] overflow-hidden ${
            isEditing ? 'cursor-pointer hover:brightness-95' : ''
          } ${isEditing && selectedKey === 'experience_image_2' ? 'ring-4 ring-neutral-400' : ''}`}
        >
          <img
            src={getImage('experience_image_2', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80')}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
          />
        </div>

      </div>

    </div>

  </div>
</section>


{/* SECTION CTA */}
<section className={`relative h-[65vh] md:h-[75vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-neutral-950 text-white ${hidden('about_cta_bg_image', 'about_cta_tagline', 'about_cta_heading', 'about_cta_description', 'about_cta_button_text') ? 'hidden' : ''}`}>
  
  <div
    onClick={() => handleImageClick('about_cta_bg_image')}
    className={`absolute inset-0 bg-cover bg-center grayscale transition-transform duration-[4000ms] ease-out ${
      isEditing ? 'cursor-pointer hover:brightness-90' : ''
    } ${isEditing && selectedKey === 'about_cta_bg_image' ? 'ring-4 ring-white/40 ring-inset' : ''}`}
    style={{
      backgroundImage: `url(${getImage('about_cta_bg_image', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80')})`,
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

    </main>
  );
}
