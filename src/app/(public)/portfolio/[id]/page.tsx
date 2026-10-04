'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const CATEGORY_LABELS: Record<string, { fr: string; en: string }> = {
  souls: { fr: 'Âmes', en: 'Souls' },
  events: { fr: 'Événements', en: 'Events' },
  retreats: { fr: 'Retraites', en: 'Retreats' },
  portraits: { fr: 'Âmes', en: 'Souls' },
  festivals: { fr: 'Événements', en: 'Events' },
  ceremonies: { fr: 'Retraites', en: 'Retreats' },
};



export default function ProjectPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      // On récupère le projet depuis Supabase via l'ID
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data && !error) setProject(data);
      setLoading(false);
    };
    fetchProject();
  }, [id]);

 

  const [portfolios, setPortfolios] = useState<any[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase.from('portfolios').select('*');
      if (data) setPortfolios(data);
    };
    fetchAll();
  },[]); // <--- J'ai ajouté le crochet fermant ici

  const scrollCarousel = (dir: number) => {
    const el = carouselRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.32, behavior: 'smooth' });
  };

  const stripRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ down: false, startX: 0, startScroll: 0 });

  const onStripPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    dragState.current = { down: true, startX: e.clientX, startScroll: stripRef.current?.scrollLeft ?? 0 };
  };

  const onStripPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.down || !stripRef.current) return;
    stripRef.current.scrollLeft = dragState.current.startScroll - (e.clientX - dragState.current.startX);
  };

  const onStripPointerUp = () => {
    dragState.current.down = false;
  };

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const imageCount = project?.images?.length ?? 0;

  const scrollStripToActive = (idx: number) => {
    const el = stripRef.current;
    if (!el) return;
    const thumb = el.children[idx] as HTMLElement | undefined;
    if (!thumb) return;
    const target = thumb.offsetLeft - (el.clientWidth - thumb.clientWidth) / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  };

  const prevImage = () => {
    if (lightboxIndex === null || imageCount === 0) return;
    const next = (lightboxIndex - 1 + imageCount) % imageCount;
    setLightboxIndex(next);
    scrollStripToActive(next);
  };

  const nextImage = () => {
    if (lightboxIndex === null || imageCount === 0) return;
    const next = (lightboxIndex + 1) % imageCount;
    setLightboxIndex(next);
    scrollStripToActive(next);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxIndex, imageCount]);

   if (loading) return <div className="min-h-screen bg-[#fcf7f3] flex items-center justify-center">Loading...</div>;
  if (!project) {
    return (
      <div className="min-h-screen bg-[#fcf7f3] flex items-center justify-center">
        {language === 'fr' ? 'Projet non trouvé.' : 'Project not found.'}
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-[#fcf7f3] relative">
      {/* 1. SPLIT-SCREEN HERO : Image 50% / Texte 50%
           pt-14 / pt-16 : le header est en position fixed sur toutes les pages
           publiques (Header.tsx). Sans cette reserve, il recouvrait le haut de
           l'image et du bloc texte, qui commencent au bord de la page. */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[70vh] md:min-h-[60vh] pt-14 md:pt-16">
        {/* Colonne gauche : Image plein format */}
        <div className="relative w-full h-[50vh] md:h-full overflow-hidden bg-neutral-100">
          <img
            src={project.images[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80'}
            alt={(language === 'fr' ? project.title_fr : project.title_en) || project.title_fr}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Colonne droite : Bloc texte */}
        <div className="bg-[#fcf7f3] flex flex-col justify-center items-center md:items-start p-10 md:p-16 lg:p-24 text-center md:text-left">
          <span className="font-sans text-xs tracking-[0.25em] uppercase text-neutral-500 mb-4">
            {CATEGORY_LABELS[project.category]?.[language === 'fr' ? 'fr' : 'en'] || project.category}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-6 leading-tight">
            {(language === 'fr' ? project.title_fr : project.title_en) || project.title_fr}
          </h1>
          <p className="font-sans text-sm md:text-base font-light text-neutral-600 leading-relaxed max-w-md">
            {(language === 'fr' ? project.description_fr : project.description_en) || project.description_fr}
          </p>
        </div>
      </section>

      {/* 2. GALERIE PHOTO (Grille 3 colonnes) */}
      <section className="px-8 md:px-16 pt-8 pb-24">
        <div className="max-w-6xl mx-auto columns-1 md:columns-3 gap-1 md:gap-2 [&>*]:mb-1 md:[&>*]:mb-2">
          {project.images.map((img: string, idx: number) => (
            <div
              key={idx}
              className="break-inside-avoid overflow-hidden bg-neutral-100 shadow-sm cursor-zoom-in group"
              onClick={() => setLightboxIndex(idx)}
            >
              <img src={img} alt={`Photo ${idx}`} className="w-full h-auto hover:scale-[1.02] transition-transform duration-700" />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION : AUTRES PROJETS (Grille 3 colonnes) */}
      <section
        style={{ backgroundColor: '#fcf7f3' }}
        className="relative w-full overflow-hidden pt-8 md:pt-12 pb-16 md:pb-24 px-8 md:px-16"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-end justify-between">
            <h3 className="font-serif text-2xl md:text-3xl font-light text-neutral-900">
              {language === 'fr' ? "Autres projets" : "Other projects"}
            </h3>

            <div className="flex space-x-4">
              <button onClick={() => scrollCarousel(-1)} className="w-10 h-10 border border-neutral-900/30 rounded-full flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all">←</button>
              <button onClick={() => scrollCarousel(1)} className="w-10 h-10 border border-neutral-900/30 rounded-full flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all">→</button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-1 md:gap-3 pb-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {portfolios.filter(p => p.id !== id).map((p) => (
              <Link
                key={p.id}
                href={`/portfolio/${p.id}`}
                className="relative group block h-[55vh] md:h-[50vh] w-[85vw] md:w-[calc((100%-1.5rem)/3)] flex-shrink-0 snap-center overflow-hidden"
              >
                <img
                  src={p.images[0]}
                  alt={language === 'fr' ? p.title_fr : p.title_en || p.title_fr}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:brightness-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-500" />

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
                  <h4 className="font-serif text-sm md:text-lg lg:text-xl tracking-[0.15em] text-white font-light">
                    {language === 'fr' ? p.title_fr : p.title_en || p.title_fr}
                  </h4>
                  <div className="w-0 group-hover:w-12 h-px bg-white/60 transition-all duration-500 mt-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LIGHTBOX : Visionneuse plein écran */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Barre du haut : bouton fermer (X) */}
          <div className="flex items-center justify-end p-3 md:p-5">
            <button
              onClick={() => setLightboxIndex(null)}
              className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300"
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {/* Image principale + boutons prev/next */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center px-14 md:px-24 pb-2">
            <img
              src={project.images[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300"
              aria-label="Précédent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300"
              aria-label="Suivant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          {/* Bandeau de miniatures : pleine largeur, une seule ligne, scroll horizontal */}
          <div
            className="w-full px-3 md:px-6 pb-4 pt-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={stripRef}
              onPointerDown={onStripPointerDown}
              onPointerMove={onStripPointerMove}
              onPointerUp={onStripPointerUp}
              onPointerLeave={onStripPointerUp}
              className="w-full flex overflow-x-auto gap-2 md:gap-3 scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
              style={{ scrollbarWidth: 'none', touchAction: 'pan-x' }}
            >
              {project.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setLightboxIndex(idx);
                    scrollStripToActive(idx);
                  }}
                  className={`w-[21vw] md:w-32 lg:w-36 flex-shrink-0 snap-start overflow-hidden rounded-xs border-2 transition-all duration-300 ${
                    idx === lightboxIndex
                      ? 'border-white opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                  aria-label={`Photo ${idx + 1}`}
                >
                  <img src={img} alt={`Photo ${idx + 1}`} draggable={false} className="w-full aspect-[3/4] object-cover pointer-events-none" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}