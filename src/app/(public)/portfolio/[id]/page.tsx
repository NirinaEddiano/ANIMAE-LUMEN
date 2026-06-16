'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import InstagramSection from '@/components/InstagramSection';

const CATEGORY_LABELS: Record<string, { fr: string; en: string }> = {
  retreats: { fr: 'Retraites Spirituelles', en: 'Spiritual Retreats' },
  festivals: { fr: 'Festivals Conscients', en: 'Conscious Festivals' },
  ceremonies: { fr: 'Cérémonies Sacrées', en: 'Sacred Ceremonies' },
  portraits: { fr: 'Portraits Thérapeutiques', en: 'Therapeutic Portraits' },
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
  const carouselRef = useRef<HTMLDivElement>(null); // Définition du Ref ici

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase.from('portfolios').select('*');
      if (data) setPortfolios(data);
    };
    fetchAll();
  },[]); // <--- J'ai ajouté le crochet fermant ici

   if (loading) return <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">Loading...</div>;
  if (!project) return <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">Projet non trouvé.</div>;
  return (
    <main className="min-h-screen bg-[#FAF9F6] relative">
      {/* 1. SPLIT-SCREEN HERO : Image 50% / Texte 50% */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[70vh] md:min-h-screen">
        {/* Colonne gauche : Image plein format */}
        <div className="relative w-full h-[50vh] md:h-full overflow-hidden bg-neutral-100">
          <img
            src={project.images[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80'}
            alt={language === 'fr' ? project.title_fr : project.title_en}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Colonne droite : Bloc texte fond beige */}
        <div className="bg-[#EBE9E1] flex flex-col justify-center items-center md:items-start p-10 md:p-16 lg:p-24 text-center md:text-left">
          <span className="font-sans text-xs tracking-[0.25em] uppercase text-neutral-500 mb-4">
            {CATEGORY_LABELS[project.category]?.[language === 'fr' ? 'fr' : 'en'] || project.category}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-6 leading-tight">
            {language === 'fr' ? project.title_fr : project.title_en}
          </h1>
          <p className="font-sans text-sm md:text-base font-light text-neutral-600 leading-relaxed max-w-md">
            {language === 'fr' ? project.description_fr : project.description_en}
          </p>
        </div>
      </section>

      {/* 2. GALERIE PHOTO (Style Masonry Épuré) */}
      <section className="px-4 md:px-12 pb-24">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {project.images.map((img: string, idx: number) => (
            <div key={idx} className="break-inside-avoid overflow-hidden shadow-sm bg-white p-1">
              <img src={img} alt={`Photo ${idx}`} className="w-full h-auto hover:scale-[1.02] transition-transform duration-700" />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION : AUTRES RÉALISATIONS (CARROUSEL INFINI DYNAMIQUE) */}
  <section className="bg-[#E2E0D5] py-20 px-6 lg:px-12 overflow-hidden">
    <div className="max-w-7xl mx-auto space-y-12">
      
      <div className="flex items-end justify-between">
        <h3 className="font-serif text-2xl md:text-3xl font-light text-neutral-900">
          {language === 'fr' ? "Autres projets" : "Other projects"}
        </h3>
        
        {/* Boutons de navigation */}
        <div className="flex space-x-4">
          <button onClick={() => carouselRef.current?.scrollBy({left: -300, behavior: 'smooth'})} className="w-10 h-10 border border-neutral-900/30 rounded-full flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-[#E2E0D5] transition-all">←</button>
          <button onClick={() => carouselRef.current?.scrollBy({left: 300, behavior: 'smooth'})} className="w-10 h-10 border border-neutral-900/30 rounded-full flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-[#E2E0D5] transition-all">→</button>
        </div>
      </div>

      {/* Carrousel dynamique */}
      <div 
        ref={carouselRef} 
        className="flex overflow-x-auto space-x-6 pb-6 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Filtrer pour ne pas afficher le projet actuel dans la liste des "autres" */}
        {portfolios.filter(p => p.id !== id).map((p) => (
          <div key={p.id} className="w-[240px] shrink-0 snap-start flex flex-col space-y-4 group">
            <Link href={`/portfolio/${p.id}`}>
              <div className="overflow-hidden aspect-[3/4] bg-neutral-100 shadow-sm">
                <img src={p.images[0]} alt={language === 'fr' ? p.title_fr : p.title_en || p.title_fr} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
            </Link>
            <div className="space-y-1">
              <h4 className="font-serif text-lg text-neutral-900">
                {language === 'fr' ? p.title_fr : p.title_en || p.title_fr}
              </h4>
              <Link href={`/portfolio/${p.id}`} className="text-[10px] uppercase tracking-widest text-neutral-900/60 border-b border-neutral-900/30">
                {language === 'fr' ? "Voir →" : "View →"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>


      <InstagramSection />
      

    </main>
  );
}