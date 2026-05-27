'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Script from 'next/script';

// 1. Définition des données pour les 4 services (Diaporama & Carrousel)
const servicesData = {
  fr: [
    {
      id: 0,
      title: 'Retraites Spirituelles',
      description: "Capturer l'énergie collective et les moments de silence profond lors de vos retraites de transformation.",
      imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1600&q=80', // Méditation / Yoga nature
    },
    {
      id: 1,
      title: 'Cérémonies Sacrées',
      description: "Une présence discrète pour immortaliser la magie des rituels et des unions d'âmes.",
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80', // Cérémonie / Rituels extérieurs
    },
    {
      id: 2,
      title: 'Portraits Introspectifs',
      description: "Une séance tête-à-tête pour révéler votre essence véritable à travers le portrait.",
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80', // Portrait artistique lumière naturelle
    },
    {
      id: 3,
      title: 'Éveil Artistique',
      description: "Collaboration visuelle pour les créateurs, guérisseurs et visionnaires de demain.",
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80', // Mains créatives / Éléments naturels
    },
  ],
  en: [
    {
      id: 0,
      title: 'Spiritual Retreats',
      description: 'Capturing collective energy and moments of profound silence during your transformational retreats.',
      imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 1,
      title: 'Sacred Ceremonies',
      description: 'A discreet presence to immortalize the magic of rituals and unions of souls.',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 2,
      title: 'Introspective Portraits',
      description: 'A one-on-one session to reveal your true essence through thoughtful portraiture.',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 3,
      title: 'Artistic Awakening',
      description: 'Visual collaboration for the creators, healers, and visionaries of tomorrow.',
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
    },
  ],
};

const commonUiTranslations = {
  fr: {
    btnPortfolio: 'Découvrir',
    btnApproach: 'En savoir plus',
    philosophyTitle: 'Notre Vision',
    philosophyText: 'Chaque lumière est une histoire, chaque silence un murmure de l\'âme. Notre objectif est de traduire ces vibrations invisibles en textures visuelles pures et intemporelles.',
  },
  en: {
    btnPortfolio: 'Portfolio',
    btnApproach: 'Approach',
    philosophyTitle: 'Our Vision',
    philosophyText: 'Every light is a story, every silence a whisper of the soul. Our purpose is to translate these invisible vibrations into pure and timeless visual textures.',
  },
};

const visionTranslations = {
  fr: {
    tagline: "L'essence de l'instant",
    heading: "Une quête de présence, d'émotion et de lumière.",
    text: "Ma photographie est une démarche spirituelle et introspective, presque thérapeutique. Je cherche à capturer l'invisible : honorer l'âme des êtres et des lieux, figer l'énergie collective et les instants de silence profond lors des retraites, ou immortaliser la magie intemporelle des rituels et des cérémonies sacrées.",
    caption1: "L'introspection à travers le regard",
    caption2: "La synergie des retraites et des espaces sacrés",
  },
  en: {
    tagline: "The essence of the moment",
    heading: "A quest for presence, emotion, and light.",
    text: "My photography is a spiritual and introspective path, almost therapeutic. I seek to capture the unseen: honoring the soul of beings and places, freezing collective energy and moments of profound silence during retreats, or immortalizing the timeless magic of sacred rituals and ceremonies.",
    caption1: "Introspection through the gaze",
    caption2: "The synergy of retreats and sacred spaces",
  }
}

const servicesSectionTranslations = {
  fr: {
    sectionTagline: "Champs d'exploration",
    sectionHeading: "Honorer l'invisible à travers mes spécialités",
    services: [
      {
        num: "01",
        title: "Retraites Spirituelles",
        description: "Capturer la synergie, la reconnexion et les instants de recueillement collectif au cœur de vos bulles de transformation.",
        imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80"
      },
      {
        num: "02",
        title: "Cérémonies Sacrées",
        description: "Une présence silencieuse et bienveillante pour figer la beauté pure des rituels de passage et des unions d'âmes.",
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80"
      },
      {
        num: "03",
        title: "Festivals Conscients",
        description: "Saisir l'extase libre, la danse libératrice et les vibrations profondes des rassemblements artistiques et alternatifs.",
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80"
      },
      {
        num: "04",
        title: "Portraits Thérapeutiques",
        description: "Un espace d'écoute et de douceur en tête-à-tête pour vous guider vers la rencontre et l'acceptation de votre image véritable.",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  },
  en: {
    sectionTagline: "Fields of exploration",
    sectionHeading: "Honoring the unseen through my specialties",
    services: [
      {
        num: "01",
        title: "Spiritual Retreats",
        description: "Capturing synergy, reconnection, and moments of collective mindfulness at the heart of your transformational journeys.",
        imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80"
      },
      {
        num: "02",
        title: "Sacred Ceremonies",
        description: "A silent, benevolent presence to freeze the pure beauty of rites of passage and unions of souls.",
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80"
      },
      {
        num: "03",
        title: "Conscious Festivals",
        description: "Seizing free ecstasy, liberating dance, and the deep vibrations of artistic and alternative gatherings.",
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80"
      },
      {
        num: "04",
        title: "Therapeutic Portraits",
        description: "A space of gentle listening and one-on-one presence to guide you toward meeting and embracing your true self.",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  }
};

const portfolioGalleryTranslations = {
  fr: {
    tagline: "Le souffle de l'instant",
    heading: "La Galerie Respirante",
    subheading: "Une immersion organique à travers 16 fragments de lumière, de silence et de présence sauvage.",
  },
  en: {
    tagline: "The breath of the moment",
    heading: "The Breathing Gallery",
    subheading: "An organic immersion through 16 fragments of light, silence, and wild presence.",
  }
};

const portfolioCarouselTranslations = {
  fr: {
    tagline: "Le fil des souvenirs",
    heading: "Toutes nos réalisations",
    viewProject: "Découvrir la galerie",
    projects: [
      {
        id: "sisterhood-ibiza",
        title: "Sensitive Sisterhood",
        imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "union-chamonix",
        title: "L'Union d'Âmes",
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "son-pyrenees",
        title: "Le Chant du Tambour",
        imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "portrait-valerie",
        title: "Portraits Thérapeutiques",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ecstatic-dance",
        title: "Ecstatic Gathering",
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "breathwork-bali",
        title: "Somatic Breathwork",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "incense-circles",
        title: "Cercles d'Encens",
        imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ocean-serenity",
        title: "Serenité Océane",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  en: {
    tagline: "The thread of memories",
    heading: "All realisations",
    viewProject: "Explore the gallery",
    projects: [
      {
        id: "sisterhood-ibiza",
        title: "Sensitive Sisterhood",
        imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "union-chamonix",
        title: "Soul Union",
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "son-pyrenees",
        title: "The Song of the Drum",
        imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "portrait-valerie",
        title: "Therapeutic Portraits",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ecstatic-dance",
        title: "Ecstatic Gathering",
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "breathwork-bali",
        title: "Somatic Breathwork",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "incense-circles",
        title: "Incense Circles",
        imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ocean-serenity",
        title: "Ocean Serenity",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }
};

const testimonialsTranslations = {
  fr: {
    tagline: "Notes d'amour & de gratitude",
    heading: "Échos d'Âmes",
    subheading: "Quelques mots déposés par ceux qui ont partagé l'espace et la lumière d'Animae Lumen.",
    list: [
      {
        quote: "« Je ne me suis jamais sentie aussi vue de toute ma vie. Tina a cette capacité rare de se fondre dans le silence pour capturer l'invisible. Quand j'ai découvert les photos de la retraite, j'ai pleuré de gratitude. C'est bien plus que de la photographie, c'est un soin de l'âme. »",
        author: "Clara",
        context: "Retraite Wild Soul — Ibiza"
      },
      {
        quote: "« J'appréhendais beaucoup la séance de portraits thérapeutiques. Mais la douceur et la présence de Tina ont immédiatement installé un espace de sécurité totale. J'ai déposé mes masques, j'ai honoré ma vulnérabilité. Les images révèlent mon essence véritable. »",
        author: "Gabriel",
        context: "Séance Introspective — Genève"
      },
      {
        quote: "« Une présence si humble, discrète et pourtant si vibrante. Tina a immortalisé notre cérémonie d'union avec une poésie infinie. Elle ne photographie pas seulement ce qui est visible aux yeux, elle capture l'amour et l'énergie qui circulent entre les êtres. »",
        author: "Sarah & David",
        context: "Cérémonie d'Union — Chamonix"
      },
      {
        quote: "« Tina a capturé l'extase collective de notre festival avec une justesse incroyable. Ses images transmettent le rythme, la poussière dorée et la joie pure. C'est un témoignage vivant de notre communion. »",
        author: "Liam",
        context: "Festival de l'Éveil — Wanroij"
      },
      {
        quote: "« Je me suis réconciliée avec mon corps grâce au regard bienveillant de Tina. La séance de portrait a agi comme une véritable thérapie par l'image. Je me trouve enfin belle, brute et sereine. »",
        author: "Maëlys",
        context: "Portrait Intime — Bretagne"
      },
      {
        quote: "« Les photos de Tina vibrent encore de l'énergie de notre cercle. Elle sait capter le moment exact où l'esprit s'apaise et où le cœur s'ouvre. Un travail d'une sensibilité et d'une pureté rares. »",
        author: "Inès",
        context: "Cercle de Reconnexion — Larzac"
      }
    ]
  },
  en: {
    tagline: "Notes of love & gratitude",
    heading: "Soul Echoes",
    subheading: "A few words left by those who shared the space and light of Animae Lumen.",
    list: [
      {
        quote: "“I have never felt so deeply seen in my entire life. Tina has this rare gift of dissolving into the silence to capture the unseen. When I saw the retreat photos, I cried tears of pure gratitude. This is so much more than photography; it is healing for the soul.”",
        author: "Clara",
        context: "Wild Soul Retreat — Ibiza"
      },
      {
        quote: "“I was very anxious about the therapeutic portrait session. But Tina's gentleness and presence instantly established a space of total safety. I let go of my masks, I honored my vulnerability. The images reveal my true essence.”",
        author: "Gabriel",
        context: "Introspective Session — Geneva"
      },
      {
        quote: "“A presence so humble, discreet, and yet so vibrant. Tina captured our union ceremony with infinite poetry. She doesn't just photograph what is visible to the eyes; she captures the love and energy flowing between souls.”",
        author: "Sarah & David",
        context: "Soul Union Ceremony — Chamonix"
      },
      {
        quote: "“Tina captured the collective ecstasy of our festival with incredible accuracy. Her images transmit the rhythm, the golden dust, and pure joy. It is a living testament to our communion.”",
        author: "Liam",
        context: "Awakening Festival — Wanroij"
      },
      {
        quote: "“I reconciled with my body thanks to Tina's benevolent gaze. The portrait session acted as a real image therapy. I finally find myself beautiful, raw, and serene.”",
        author: "Maëlys",
        context: "Intimate Portrait — Brittany"
      },
      {
        quote: "“Tina's photos still vibrate with the energy of our circle. She knows how to capture the exact moment when the mind calms down and the heart opens. A work of rare sensitivity and purity.”",
        author: "Inès",
        context: "Reconnection Circle — Larzac"
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


export default function HomePage() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const services = servicesData[language];
  const ui = commonUiTranslations[language];

  // Gestion du diaporama automatique (défilement toutes les 6 secondes)
  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
    }, 6000);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  // Sélection manuelle depuis le carrousel
  const handleSelectService = (index: number) => {
    setActiveIndex(index);
    startAutoPlay(); // Réinitialise le timer après clic manuel
  };

  // Calcul du style 3D de chaque carte du carrousel pour créer l'arche circulaire concave
  const getCardStyle = (index: number) => {
    // Calcul de la distance relative circulaire pour 4 cartes
    let diff = index - activeIndex;
    if (diff > 2) diff -= 4;
    if (diff < -1) diff += 4; // Contraint la différence dans l'intervalle [-1, 0, 1, 2]

    const isActive = diff === 0;

    // Définition des transformations (Echelles, Translations, Rotations 3D)
    if (isActive) {
      // Carte Active (au centre, légèrement abaissée pour former l'arche)
      return {
        transform: 'translateY(16px) scale(1.05) rotate(0deg)',
        zIndex: 30,
        opacity: 1,
      };
    } else if (diff === 1) {
      // Carte Droite (inclinée vers la gauche, remonte vers le bord)
      return {
        transform: 'translateX(90%) translateY(-10px) scale(0.9) rotate(-7deg)',
        zIndex: 20,
        opacity: 0.65,
      };
    } else if (diff === -1) {
      // Carte Gauche (inclinée vers la droite, remonte vers le bord)
      return {
        transform: 'translateX(-90%) translateY(-10px) scale(0.9) rotate(7deg)',
        zIndex: 20,
        opacity: 0.65,
      };
    } else {
      // Carte à l'Arrière (opposée à la carte active, masquée ou très estompée)
      return {
        transform: 'translateY(-30px) scale(0.7) rotate(0deg)',
        zIndex: 10,
        opacity: 0,
        pointerEvents: 'none' as const,
      };
    }
  };

  const carouselRef = useRef<HTMLDivElement>(null);

const scrollCarousel = (direction: 'left' | 'right') => {
  if (carouselRef.current) {
    const scrollAmount = 400; // Force du glissement à chaque clic
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
};

const testimonialsRef = useRef<HTMLDivElement>(null);

const scrollTestimonials = (direction: 'left' | 'right') => {
  if (testimonialsRef.current) {
    const cardWidth = testimonialsRef.current.offsetWidth / 3; // Défilement d'une carte à la fois sur PC
    testimonialsRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth'
    });
  }
};

  return (
    <main className="min-h-screen bg-[#FAF9F6] overflow-x-hidden">
      
      {/* SECTION HERO : Diaporama de fond plein écran */}
      {/* SECTION HERO : Diaporama de fond plein écran */}
      <section className="relative h-screen w-full flex flex-col justify-between items-center px-6 pt-28 pb-12 overflow-hidden bg-neutral-900 text-white">
        
        {/* Images de fond superposées avec une opacité plus élevée (80%) pour révéler les couleurs */}
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${service.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}

        {/* Overlay d'assombrissement beaucoup plus léger et transparent */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-black/10 pointer-events-none" />

        {/* 1. TEXTE CENTRAL : Titre & Description du service actif */}
        <div className="relative z-10 text-center max-w-3xl mt-auto mb-6 px-4">
          <div className="min-h-[160px] md:min-h-[140px] flex flex-col justify-center items-center space-y-4">
            {/* Titre artistique (Cormorant Garamond) */}
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide font-light leading-tight transition-all duration-700">
              {services[activeIndex].title}
            </h1>
            {/* Description épurée (Inter) */}
            <p className="font-sans text-xs md:text-sm tracking-[0.15em] leading-relaxed font-light opacity-80 max-w-xl transition-all duration-700">
              {services[activeIndex].description}
            </p>
          </div>

          {/* Boutons d'action épurés */}
          <div className="flex items-center justify-center space-x-6 mt-6">
            <button className="bg-white text-neutral-900 text-xs uppercase tracking-[0.2em] font-medium px-8 py-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
              {ui.btnPortfolio}
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs uppercase tracking-[0.2em] font-light px-8 py-3 rounded-full hover:bg-white hover:text-neutral-900 transition-all duration-300">
              {ui.btnApproach}
            </button>
          </div>
        </div>

        {/* 2. CARROUSEL EN ARCHE (Bas de la section Hero) */}
        <div className="relative z-20 w-full max-w-4xl h-[180px] md:h-[220px] flex items-center justify-center pointer-events-auto">
          <div className="relative w-[130px] md:w-[170px] h-full flex items-center justify-center">
            
            {services.map((service, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={service.id}
                  onClick={() => handleSelectService(index)}
                  style={getCardStyle(index)}
                  className={`absolute w-full h-[150px] md:h-[190px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-out focus:outline-none group ${
                    isActive ? 'cursor-default ring-1 ring-white/30' : 'cursor-pointer'
                  }`}
                >
                  {/* Image de la carte */}
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isActive ? 'scale-100' : 'scale-110 group-hover:scale-115'
                    }`}
                  />
                  {/* Surcouche d'assombrissement sur les cartes inactives */}
                  <div
                    className={`absolute inset-0 bg-neutral-950/30 transition-opacity duration-500 ${
                      isActive ? 'opacity-0' : 'opacity-40 group-hover:opacity-20'
                    }`}
                  />
                  {/* Titre discret sur la carte */}
                  <div className="absolute bottom-3 left-0 w-full text-center px-2">
                    <p className="text-[9px] md:text-xxs tracking-[0.25em] uppercase font-light text-white drop-shadow-md">
                      
                    </p>
                  </div>
                </button>
              );
            })}

          </div>
        </div>

      </section>

      {/* SECTION PHILOSOPHIE / UNIVERS ARTISTIQUE ASYMÉTRIQUE */}
<section className="bg-[#FAF9F6] py-24 md:py-36 px-6 lg:px-12">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
    
    {/* COLONNE GAUCHE (5/12) : Une grande image verticale artistique */}
    <div className="lg:col-span-5 space-y-4">
      <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative group">
        <img
          src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=80"
          alt={visionTranslations[language].caption1}
          className="w-full h-full object-cover grayscale-25 transition-transform duration-[2000ms] ease-out group-hover:scale-105"
        />
        {/* Voile de lumière douce au survol */}
        <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      </div>
      <p className="font-sans text-[10px] tracking-[0.25em] uppercase font-light text-neutral-400">
        [ {visionTranslations[language].caption1} ]
      </p>
    </div>

    {/* COLONNE DROITE (7/12) : Titres, philosophie et une seconde photo horizontale décalée */}
    <div className="lg:col-span-7 flex flex-col justify-center space-y-12 lg:pl-8">
      
      {/* Textes de présentation */}
      <div className="space-y-6 max-w-xl">
        <span className="font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block animate-fade-in">
          {visionTranslations[language].tagline}
        </span>
        <h2 className="font-serif text-3xl md:text-5xl tracking-wide font-light text-neutral-800 leading-tight">
          {visionTranslations[language].heading}
        </h2>
        <div className="w-16 h-[1px] bg-neutral-300" />
        <p className="font-sans text-sm md:text-base font-light text-neutral-600 leading-relaxed tracking-wide">
          {visionTranslations[language].text}
        </p>
        <div className="pt-4">
          <Link
            href="/about"
            className="text-xs uppercase tracking-[0.25em] font-light text-neutral-800 border-b border-neutral-800/20 pb-2 hover:border-neutral-800/80 transition-all duration-300 inline-block"
          >
            {language === 'fr' ? "Découvrir mon histoire →" : "Discover my journey →"}
          </Link>
        </div>
      </div>

      {/* Seconde image horizontale asymétrique (Rituels / Cérémonies) */}
      <div className="space-y-4 self-end w-full md:w-[85%]">
        <div className="overflow-hidden bg-neutral-100 aspect-[16/10] relative group">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80"
            alt={visionTranslations[language].caption2}
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        </div>
        <div className="flex justify-end">
          <p className="font-sans text-[10px] tracking-[0.25em] uppercase font-light text-neutral-400">
            [ {visionTranslations[language].caption2} ]
          </p>
        </div>
      </div>

    </div>

  </div>
</section>

{/* SECTION PRÉSENTATION DES 4 SERVICES / SPÉCIALISATIONS (GRILLE DOUBLE COLONNE SANS VIDE) */}
<section className="bg-[#FAF9F6] pt-12 pb-36 md:pb-52 px-6 lg:px-12 border-t border-neutral-200/40">
  <div className="max-w-7xl mx-auto">
    
    {/* En-tête de section minimaliste */}
    <div className="mb-20 md:mb-32 space-y-4 max-w-2xl">
      <span className="font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block">
        {servicesSectionTranslations[language].sectionTagline}
      </span>
      <h2 className="font-serif text-3xl md:text-5xl tracking-wide font-light text-neutral-800 leading-tight">
        {servicesSectionTranslations[language].sectionHeading}
      </h2>
    </div>

    {/* Séparation en 2 colonnes verticales indépendantes pour éviter les hauteurs de ligne forcées */}
    {/* Séparation en 2 colonnes verticales indépendantes pour éviter les hauteurs de ligne forcées */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-20 md:gap-y-0">
      
      {/* COLONNE GAUCHE (Services 1 & 3) */}
      <div className="flex flex-col space-y-20 md:space-y-28">
        {[servicesSectionTranslations[language].services[0], servicesSectionTranslations[language].services[2]].map((service, idx) => (
          <div key={service.num} className="flex flex-col space-y-6">
            {/* Format d'image */}
            <div className={`overflow-hidden bg-neutral-100 relative group cursor-pointer shadow-sm ${
              idx === 0 ? 'aspect-[3/2]' : 'aspect-[3/4]'
            }`}>
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>

            {/* Descriptif typographique ajusté */}
            <div className="space-y-4 pt-3">
              <div className="flex items-center space-x-4">
                <span className="font-serif text-xl md:text-2xl italic font-light text-neutral-400/80">
                  {service.num}
                </span>
                <span className="w-6 h-[1px] bg-neutral-300 block" /> {/* Trait d'union minimaliste */}
                <h3 className="font-serif text-2xl md:text-3xl tracking-wide font-light text-neutral-800">
                  {service.title}
                </h3>
              </div>
              <p className="font-sans text-sm md:text-[15px] font-light text-neutral-500 leading-relaxed tracking-wide max-w-lg">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* COLONNE DROITE (Services 2 & 4 - Décalés légèrement vers le bas) */}
      <div className="flex flex-col space-y-20 md:space-y-28 md:pt-20">
        {[servicesSectionTranslations[language].services[1], servicesSectionTranslations[language].services[3]].map((service, idx) => (
          <div key={service.num} className="flex flex-col space-y-6">
            {/* Format d'image */}
            <div className={`overflow-hidden bg-neutral-100 relative group cursor-pointer shadow-sm ${
              idx === 0 ? 'aspect-[3/4]' : 'aspect-[3/2]'
            }`}>
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>

            {/* Descriptif typographique ajusté */}
            <div className="space-y-4 pt-3">
              <div className="flex items-center space-x-4">
                <span className="font-serif text-xl md:text-2xl italic font-light text-neutral-400/80">
                  {service.num}
                </span>
                <span className="w-6 h-[1px] bg-neutral-300 block" /> {/* Trait d'union minimaliste */}
                <h3 className="font-serif text-2xl md:text-3xl tracking-wide font-light text-neutral-800">
                  {service.title}
                </h3>
              </div>
              <p className="font-sans text-sm md:text-[15px] font-light text-neutral-500 leading-relaxed tracking-wide max-w-lg">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>

  </div>
</section>

{/* SECTION : GALERIE RESPIRANTE EN PLEIN ÉCRAN (FRESQUE DE 24 IMAGES EN COULEURS NATURELLES) */}
{/* SECTION : GALERIE RESPIRANTE EN PLEIN ÉCRAN */}
<section className="bg-[#FAF9F6] pb-12 md:pb-16 border-t border-neutral-200/40 overflow-hidden relative">
  
  {/* Injection des animations de respiration organique accélérées et amplifiées */}
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes fastBreathe1 {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-16px); }
    }
    @keyframes fastBreathe2 {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-26px); }
    }
    @keyframes fastBreathe3 {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    @keyframes fastBreathe4 {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-22px); }
    }
    .animate-breathe-1 { animation: fastBreathe1 6s ease-in-out infinite; }
    .animate-breathe-2 { animation: fastBreathe2 8s ease-in-out infinite; }
    .animate-breathe-3 { animation: fastBreathe3 5s ease-in-out infinite; }
    .animate-breathe-4 { animation: fastBreathe4 7s ease-in-out infinite; }
  `}} />

  {/* En-tête de section minimaliste */}
  <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-4 pt-16 mb-20 md:mb-28">
    <span className="font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block">
      {portfolioGalleryTranslations[language].tagline}
    </span>
    <h2 className="font-serif text-3xl md:text-5xl tracking-wide font-light text-neutral-800 leading-tight">
      {portfolioGalleryTranslations[language].heading}
    </h2>
    <p className="font-sans text-xs md:text-sm font-light text-neutral-500 tracking-wide max-w-sm mx-auto">
      {portfolioGalleryTranslations[language].subheading}
    </p>
    <div className="w-12 h-[1px] bg-neutral-300 mx-auto mt-6" />
  </div>

  {/* FRESQUE PHOTO MASONRY RESPIRANTE EN COULEURS NATURELLES (24 PHOTOS) */}
  <div className="w-full px-0">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
      
      {/* COLONNE 1 : Photos 1 à 6 */}
      <div className="flex flex-col gap-2 lg:gap-3">
        {/* Photo 1 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative group shadow-xs cursor-pointer animate-breathe-1">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
            alt="Portrait"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 2 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[1/1] relative group shadow-xs cursor-pointer animate-breathe-2">
          <img
            src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80"
            alt="Rituels"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 3 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[16/9] relative group shadow-xs cursor-pointer animate-breathe-4">
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80"
            alt="Coucher soleil eau"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 4 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative group shadow-xs cursor-pointer animate-breathe-4">
          <img
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80"
            alt="Nature sauvage"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 5 (Nouvelle) */}
        <div className="overflow-hidden bg-neutral-100 aspect-[1/1] relative group shadow-xs cursor-pointer animate-breathe-1">
          <img
            src="https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&w=600&q=80"
            alt="Portrait"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 6 (Nouvelle) */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/2] relative group shadow-xs cursor-pointer animate-breathe-2">
          <img
            src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80"
            alt="Fumée sacrée"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
      </div>

      {/* COLONNE 2 : Photos 7 à 12 (Décalée vers le bas) */}
      <div className="flex flex-col gap-2 lg:gap-3 md:translate-y-6">
        {/* Photo 7 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/2] relative group shadow-xs cursor-pointer animate-breathe-3">
          <img
            src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80"
            alt="Sororité"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 8 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative group shadow-xs cursor-pointer animate-breathe-4">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
            alt="Méditation"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 9 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[1/1] relative group shadow-xs cursor-pointer animate-breathe-1">
          <img
            src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80"
            alt="Étreinte"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 10 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/2] relative group shadow-xs cursor-pointer animate-breathe-2">
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
            alt="Énergie sauvage"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 11 (Nouvelle) */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative group shadow-xs cursor-pointer animate-breathe-3">
          <img
            src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80"
            alt="Nature/Rochers"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 12 (Nouvelle) */}
        <div className="overflow-hidden bg-neutral-100 aspect-[1/1] relative group shadow-xs cursor-pointer animate-breathe-4">
          <img
            src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80"
            alt="Forêt"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
      </div>

      {/* COLONNE 3 : Photos 13 à 18 */}
      <div className="flex flex-col gap-2 lg:gap-3">
        {/* Photo 13 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative group shadow-xs cursor-pointer animate-breathe-2">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
            alt="Cérémonie"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 14 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/2] relative group shadow-xs cursor-pointer animate-breathe-1">
          <img
            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80"
            alt="Tambour"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 15 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative group shadow-xs cursor-pointer animate-breathe-4">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
            alt="Portrait"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 16 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[1/1] relative group shadow-xs cursor-pointer animate-breathe-3">
          <img
            src="https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=600&q=80"
            alt="Fleurs sauvages"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 17 (Nouvelle) */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative group shadow-xs cursor-pointer animate-breathe-2">
          <img
            src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80"
            alt="Arbre soleil"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 18 (Nouvelle) */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/2] relative group shadow-xs cursor-pointer animate-breathe-1">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
            alt="Eau sereine"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
      </div>

      {/* COLONNE 4 : Photos 19 à 24 (Décalée vers le bas) */}
      <div className="flex flex-col gap-2 lg:gap-3 md:translate-y-12">
        {/* Photo 19 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[16/9] relative group shadow-xs cursor-pointer animate-breathe-4">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
            alt="Montagnes"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 20 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative group shadow-xs cursor-pointer animate-breathe-3">
          <img
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80"
            alt="Ancrage"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 21 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/2] relative group shadow-xs cursor-pointer animate-breathe-2">
          <img
            src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80"
            alt="Portrait"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 22 (Nouvelle) */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative group shadow-xs cursor-pointer animate-breathe-1">
          <img
            src="https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=600&q=80"
            alt="Fumigation main"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 23 (Nouvelle) */}
        {/* Photo 4.5 */}
        <div className="overflow-hidden bg-neutral-100 aspect-[16/9] relative group shadow-xs cursor-pointer animate-breathe-4">
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80"
            alt="Coucher soleil eau"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
        {/* Photo 24 (Nouvelle) */}
        <div className="overflow-hidden bg-neutral-100 aspect-[3/4] relative group shadow-xs cursor-pointer animate-breathe-3">
          <img
            src="https://images.unsplash.com/photo-1520262494112-9fe481d36ec3?auto=format&fit=crop&w=600&q=80"
            alt="Café nature"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
          />
        </div>
      </div>

    </div>
  </div>
</section>

{/* SECTION : TOUTES LES RÉALISATIONS (DÉFILÉ CONTINU ET INFINI EN PLEIN ÉCRAN) */}
{/* SECTION : TOUTES LES RÉALISATIONS (DÉFILÉ CONTINU ET INFINI EN PLEIN ÉCRAN) */}
<section className="bg-[#FAF9F6] pt-2 pb-32 md:pt-4 md:pb-44 border-t border-neutral-200/40 overflow-hidden relative">
  
  {/* Styles CSS pour gérer le défilement infini fluide sans coupure */}
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes marqueeScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee-infinite {
      display: flex;
      width: max-content;
      animation: marqueeScroll 45s linear infinite;
    }
    /* Met en pause le défilement au survol de la souris sur n'importe quel projet */
    .animate-marquee-infinite:hover {
      animation-play-state: paused;
    }
  `}} />

  <div className="w-full space-y-12">
    
    {/* En-tête minimaliste centré (Aligné aux grilles du site) */}
    <div className="max-w-7xl mx-auto px-6 lg:px-12 text-left space-y-4">
      <span className="font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block animate-fade-in">
        {portfolioCarouselTranslations[language].tagline}
      </span>
      <h2 className="font-serif text-3xl md:text-5xl tracking-wide font-light text-neutral-800 leading-tight">
        {portfolioCarouselTranslations[language].heading}
      </h2>
      <div className="w-12 h-[1px] bg-neutral-300" />
    </div>

    {/* CONTAINER PLEIN ÉCRAN SANS MARGES (Pellicule de défilement) */}
    <div className="w-full relative py-4">
      {/* 
        On duplique la liste des projets ([...projects, ...projects]) 
        pour que la transition de fin de boucle soit totalement invisible.
      */}
      <div className="animate-marquee-infinite space-x-5">
        {[
          ...portfolioCarouselTranslations[language].projects, 
          ...portfolioCarouselTranslations[language].projects
        ].map((project, index) => (
          <div
            key={`${project.id}-${index}`}
            className="w-[260px] md:w-[310px] shrink-0 flex flex-col space-y-4 group"
          >
            {/* Cadre photo au format vertical d'art (Aspect 4/5 pour s'adapter à l'alignement rectiligne) */}
            <Link href={`/portfolio/${project.id}`}>
              <div className="overflow-hidden bg-neutral-100 aspect-[4/5] relative cursor-pointer shadow-sm">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              </div>
            </Link>

            {/* Titre & Lien de découverte (Textes de taille confortable et très lisibles) */}
            <div className="space-y-2 px-1">
              <h3 className="font-serif text-lg md:text-xl tracking-wide font-light text-neutral-800 leading-snug">
                {project.title}
              </h3>
              <div className="pt-0.5">
                <Link
                  href={`/portfolio/${project.id}`}
                  className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-light text-neutral-500 group-hover:text-neutral-800 border-b border-neutral-300 group-hover:border-neutral-800 pb-1 transition-all duration-500 inline-block"
                >
                  {portfolioCarouselTranslations[language].viewProject} →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
</section>

{/* SECTION : TÉMOIGNAGES (CARROUSEL HORIZONTAL À NAVIGATION LATÉRALE ET OMBRES APPARENTES) */}
<section className="bg-[#FAF9F6] pt-0 pb-32 md:pb-44 px-4 md:px-6 relative border-t border-neutral-200/40">
  <div className="max-w-7xl mx-auto space-y-12">
    
    {/* En-tête de section centré et minimaliste */}
    <div className="text-center space-y-4 max-w-xl mx-auto pt-16">
      <span className="font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block animate-fade-in">
        {testimonialsTranslations[language].tagline}
      </span>
      <h2 className="font-serif text-3xl md:text-5xl tracking-wide font-light text-neutral-800 leading-tight">
        {testimonialsTranslations[language].heading}
      </h2>
      <p className="font-sans text-xs md:text-sm font-light text-neutral-500 tracking-wide max-w-sm mx-auto">
        {testimonialsTranslations[language].subheading}
      </p>
      <div className="w-12 h-[1px] bg-neutral-300 mx-auto mt-6" />
    </div>

    {/* CARROUSEL AVEC BOUTONS AJUSTÉS AUX EXTRÉMITÉS */}
    <div className="relative w-full px-2 md:px-4">
      
      {/* BOUTON PRÉCÉDENT */}
      <button
        onClick={() => scrollTestimonials('left')}
        className="absolute left-[-10px] md:left-[-16px] top-1/2 -translate-y-1/2 z-10 w-11 h-11 border border-neutral-800/15 bg-white/95 backdrop-blur-xs rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-all duration-300 shadow-md cursor-pointer"
        aria-label="Previous testimonial"
      >
        ←
      </button>

      {/* BOUTON SUIVANT */}
      <button
        onClick={() => scrollTestimonials('right')}
        className="absolute right-[-10px] md:right-[-16px] top-1/2 -translate-y-1/2 z-10 w-11 h-11 border border-neutral-800/15 bg-white/95 backdrop-blur-xs rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-all duration-300 shadow-md cursor-pointer"
        aria-label="Next testimonial"
      >
        →
      </button>

      {/* ZONE DE DÉFILEMENT HORIZONTAL (Largeur maximisée) */}
      <div
        ref={testimonialsRef}
        className="flex overflow-x-auto space-x-6 pb-6 scrollbar-hide snap-x snap-mandatory pointer-events-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Masque la barre de défilement pour les navigateurs webkit */}
        <style dangerouslySetInnerHTML={{__html: `
          div::-webkit-scrollbar {
            display: none;
          }
        `}} />

        {testimonialsTranslations[language].list.map((item, index) => (
          <div 
            key={index} 
            className="w-[280px] md:w-[340px] lg:w-[calc(33.333%-1rem)] shrink-0 snap-start flex flex-col justify-between space-y-8 bg-white/60 backdrop-blur-xs p-6 md:p-8 border border-neutral-200/30 shadow-md"
          >
            {/* Texte du témoignage : Citation noire pure et de taille confortable (20px sur PC) */}
            <p className="font-serif text-[17px] md:text-[20px] italic font-light leading-relaxed text-neutral-950">
              {item.quote}
            </p>

            {/* Auteur & Contexte : Contrastes améliorés */}
            <div className="space-y-2 pt-4 border-t border-neutral-200/30">
              <h4 className="font-serif text-lg tracking-wide font-light text-neutral-900">
                {item.author}
              </h4>
              <span className="font-sans text-[10px] md:text-xxs tracking-[0.25em] uppercase text-neutral-500 font-normal block">
                {item.context}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>

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