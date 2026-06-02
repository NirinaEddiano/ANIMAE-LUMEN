'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Script from 'next/script';

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
    <main className="min-h-screen bg-[#FAF9F6]">
      {/* 1. SECTION HERO : Style Éditorial (Image à gauche, texte à droite) */}
    <section className="pt-32 pb-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Image du projet (format 3/4) */}
        <div className="lg:col-span-6 overflow-hidden bg-neutral-100 shadow-sm">
          <img 
            src={project.images[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80'} 
            alt={language === 'fr' ? project.title_fr : project.title_en}
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Titre et Description */}
        <div className="lg:col-span-6 space-y-8 lg:pl-12">
          <h1 className="font-serif text-3xl md:text-5xl font-light text-neutral-900 tracking-wide leading-tight">
            {language === 'fr' ? project.title_fr : project.title_en}
          </h1>
          <div className="w-16 h-[1px] bg-neutral-300" />
          <p className="font-sans text-sm md:text-base text-neutral-600 font-light leading-relaxed">
            {language === 'fr' ? project.description_fr : project.description_en}
          </p>
        </div>
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
  <section className="bg-[#FAF9F6] py-20 px-6 lg:px-12 border-t border-neutral-200/40 overflow-hidden">
    <div className="max-w-7xl mx-auto space-y-12">
      
      <div className="flex items-end justify-between">
        <h3 className="font-serif text-2xl md:text-3xl font-light text-neutral-800">
          {language === 'fr' ? "Autres projets" : "Other projects"}
        </h3>
        
        {/* Boutons de navigation */}
        <div className="flex space-x-4">
          <button onClick={() => carouselRef.current?.scrollBy({left: -300, behavior: 'smooth'})} className="w-10 h-10 border border-neutral-300 rounded-full flex items-center justify-center hover:bg-neutral-800 hover:text-white transition-all">←</button>
          <button onClick={() => carouselRef.current?.scrollBy({left: 300, behavior: 'smooth'})} className="w-10 h-10 border border-neutral-300 rounded-full flex items-center justify-center hover:bg-neutral-800 hover:text-white transition-all">→</button>
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
              <Link href={`/portfolio/${p.id}`} className="text-[10px] uppercase tracking-widest text-neutral-500 border-b border-neutral-300">
                {language === 'fr' ? "Voir →" : "View →"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>


  {/* SECTION : INTEGRATION INSTAGRAM (Statique multilingue autonome) */}
  <section className="bg-[#FAF9F6] pt-12 pb-8 md:pb-12 px-4 md:px-8 border-t border-neutral-200/40">
    <div className="w-full space-y-16">
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <span className="font-sans text-xs tracking-[0.3em] uppercase font-light text-neutral-400 block">
          {language === 'fr' ? "Le voyage continue" : "The journey continues"}
        </span>
        <h2 className="font-serif text-3xl md:text-5xl tracking-wide font-light text-neutral-800 leading-tight">
          {language === 'fr' ? "Rejoindre le cercle" : "Join the circle"}
        </h2>
        <div className="pt-2">
          <a href="https://www.instagram.com/animaelumen" target="_blank" rel="noopener noreferrer" className="font-serif text-xl md:text-2xl italic font-light text-neutral-600 hover:text-neutral-900 transition-colors duration-300 underline underline-offset-8">
            @animaelumen
          </a>
        </div>
        <p className="font-sans text-xs md:text-sm font-light text-neutral-500 tracking-wide max-w-xs mx-auto pt-4">
          {language === 'fr' 
            ? "Plongez quotidiennement dans la poésie de l'invisible, du silence et de la présence pure." 
            : "Dive daily into the poetry of the unseen, silence, and pure presence."
          }
        </p>
        <div className="w-12 h-[1px] bg-neutral-300 mx-auto mt-6" />
      </div>

      <div className="max-w-[90rem] mx-auto w-full px-2 md:px-6">
        <div className="w-full h-auto">
          <div data-key="Masonry Instagram Feed" className="ft" id="ftuaxm8l1" />
          <Script src="https://wdg.fouita.com/widgets/0x48d497.js" strategy="lazyOnload" />
        </div>
      </div>

      <div className="text-center pt-4">
        <a href="https://www.instagram.com/animaelumen" target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-light text-neutral-800 border border-neutral-800/30 px-8 py-3.5 hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-all duration-500 inline-block rounded-none cursor-pointer">
          {language === 'fr' ? "Suivre sur Instagram" : "Follow on Instagram"}
        </a>
      </div>
    </div>
  </section>
      

    </main>
  );
}