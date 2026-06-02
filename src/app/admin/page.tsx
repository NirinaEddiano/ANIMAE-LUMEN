'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import HomePage from '../(public)/page'; // Importation directe de votre VRAIE page d'accueil d'origine !
import AboutPage from '../(public)/about/page'; // Importation directe de votre vraie page À Propos !
import ContactPage from '../(public)/contact/page'; // Importation directe de votre vraie page de Contact !
import PortfolioPage from '../(public)/portfolio/page'; // Importation directe de votre vraie page de Portfolio !

interface ContentItem {
  key: string;
  value_fr: string;
  value_en: string;
  font_family: string;
  font_size: string;
  is_bold: boolean;
  is_image: boolean;
}

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // États de l'éditeur en direct
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // État de l'onglet de page actif dans l'administration ('home', 'about' ou 'contact')
  // Onglet actif ('home', 'about', 'contact' ou 'portfolio')
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'portfolio'>('home');
  // État de sous-navigation pour le Portfolio ('page' pour éditer l'en-tête réel, 'list' pour créer/gérer des projets)
  const [portfolioSubTab, setPortfolioSubTab] = useState<'page' | 'list'>('list');

  // États pour le Pop-up de suppression moderne
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(null);

  // États pour la gestion des Portfolios (Espace 2)
  const [portfoliosList, setPortfoliosList] = useState<any[]>([]);
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editingPortfolio, setEditingPortfolio] = useState<any>({
    id: null,
    title_fr: '',
    description_fr: '',
    category: 'retreats',
    images: []
  });

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchContent();
      }
      setLoading(false);
    };

    checkUserAndFetch();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchContent();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('key', { ascending: true });

    if (data && !error) {
      setContentList(data);
    }
  };

  const fetchPortfolios = async () => {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setPortfoliosList(data);
    }
  };

  // Charge les portfolios au chargement s'il y a une session active
  useEffect(() => {
    if (user) {
      fetchPortfolios();
    }
  }, [user]);

  // Sauvegarder (Créer ou Modifier) un Portfolio avec Traduction Automatique du titre & description
  const handleSavePortfolio = async () => {
    setSaving(true);
    try {
      // 1. Traduction automatique gratuite (FR -> EN) avant l'envoi (Utilisation de autoTranslate)
      const titleEn = await autoTranslate(editingPortfolio.title_fr);
      const descEn = await autoTranslate(editingPortfolio.description_fr);

      const portfolioData = {
        title_fr: editingPortfolio.title_fr,
        title_en: titleEn,
        description_fr: editingPortfolio.description_fr,
        description_en: descEn,
        category: editingPortfolio.category,
        images: editingPortfolio.images
      };

    // 2. Sauvegarde Supabase (Création ou Modification)
    if (editingPortfolio.id) {
      // Modifier l'existant
      const { error } = await supabase
        .from('portfolios')
        .update(portfolioData)
        .eq('id', editingPortfolio.id);

      if (error) throw error;
    } else {
      // Créer un nouveau
      const { error } = await supabase
        .from('portfolios')
        .insert([portfolioData]);

      if (error) throw error;
    }

    // 3. Rafraîchir la liste et fermer l'interface de création
    await fetchPortfolios();
    setIsEditingPortfolio(false);

  } catch (error) {
    console.error("Erreur lors de la sauvegarde du portfolio :", error);
  } finally {
    setSaving(false);
  }
};

  // Supprimer définitivement un portfolio
  const handleDeletePortfolio = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer définitivement ce portfolio et toute sa galerie ?")) {
      await supabase.from('portfolios').delete().eq('id', id);
      await fetchPortfolios();
    }
  };

  // Envoi de PLUSIEURS photos locales en parallèle vers Supabase Storage
  const handlePortfolioMultiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSaving(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `portfolio-img-${Math.random()}.${fileExt}`;
      const filePath = `portfolios/${fileName}`;

      const { error } = await supabase.storage
        .from('site-media')
        .upload(filePath, file);

      if (error) {
        console.error("Erreur upload :", error.message);
        return null;
      }

      const { data } = supabase.storage.from('site-media').getPublicUrl(filePath);
      return data ? data.publicUrl : null;
    });

    const results = await Promise.all(uploadPromises);
    const validUrls = results.filter((url): url is string => url !== null);

    setEditingPortfolio((prev: any) => ({
      ...prev,
      images: [...prev.images, ...validUrls]
    }));
    setSaving(false);
  };

  const triggerDeleteConfirmation = (id: string) => {
    setPortfolioToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDeletePortfolio = async () => {
    if (portfolioToDelete) {
      await supabase.from('portfolios').delete().eq('id', portfolioToDelete);
      await fetchPortfolios();
      setDeleteModalOpen(false);
      setPortfolioToDelete(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message === 'Invalid login credentials' ? 'Identifiants incorrects.' : error.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setContentList([]);
    setSelectedKey(null);
  };

  // API de Traduction Automatique (FR -> EN) - Version corrigée pour les longs paragraphes
  const autoTranslate = async (text: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      
      // Correction : On rassemble toutes les phrases du tableau de traduction
      if (data && data[0]) {
        return data[0].map((slice: any) => slice[0]).join('');
      }
      
      return text;
    } catch (error) {
      console.error("Erreur de traduction :", error);
      return text;
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setSaveSuccess(false);

    for (const item of contentList) {
      let finalEnValue = item.value_en;
      if (!item.is_image) {
        finalEnValue = await autoTranslate(item.value_fr);
      }

      // Utilise .upsert() pour créer automatiquement l'élément en base de données s'il n'existait pas encore !
      await supabase
        .from('site_content')
        .upsert({
          key: item.key, // Indispensable pour l'upsert
          value_fr: item.value_fr,
          value_en: finalEnValue,
          font_family: item.font_family,
          font_size: item.font_size,
          is_bold: item.is_bold,
          is_image: item.is_image
        });
    }

    await fetchContent();
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${key}-${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('site-media')
      .upload(filePath, file);

    if (uploadError) {
      alert("Erreur : " + uploadError.message);
      setSaving(false);
      return;
    }

    const { data } = supabase.storage.from('site-media').getPublicUrl(filePath);
    if (data) {
      updateField(key, 'value_fr', data.publicUrl);
      updateField(key, 'value_en', data.publicUrl);
    }
    setSaving(false);
  };

  // Fonction de mise à jour intelligente Odoo : met à jour le champ ou le crée s'il n'existe pas encore
  const updateField = (key: string, field: keyof ContentItem, value: any) => {
    setContentList(prev => {
      const exists = prev.some(item => item.key === key);
      if (exists) {
        // Si l'élément existe, on le met à jour normalement
        return prev.map(item => (item.key === key ? { ...item, [field]: value } : item));
      } else {
        // S'il n'existe pas encore en base de données, on le crée à la volée dans l'état local !
        const newItem: ContentItem = {
          key,
          value_fr: field === 'value_fr' ? value : '',
          value_en: field === 'value_en' ? value : '',
          font_family: 'Inter',
          font_size: '16px',
          is_bold: false,
          is_image: key.includes('image')
        };
        return [...prev, newItem];
      }
    });
  };

  // Si l'élément cliqué n'est pas encore en base de données, on génère un profil temporaire pour pouvoir l'éditer et le créer à la volée !
  // --- NOUVEAU : Résolveur d'images d'origine pour éviter tout décalage à droite ---
  const getDefaultImage = (key: string): string => {
    if (key === 'portfolio_cta_image') return 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80';
  // AJOUTER CETTE LIGNE :
  if (key === 'portfolio_hero_image') return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80';
  
  if (key === 'contact_hero_image') return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80';
  // ... reste de votre code inchangé ...
  // AJOUTER CES DEUX LIGNES :
  if (key === 'contact_image_1') return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80';
  if (key === 'contact_image_2') return 'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=600&q=80';
  
  if (key === 'contact_hero_image') return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80';
  // ... reste de votre code inchangé ...
  // AJOUTER CETTE LIGNE :
  if (key === 'contact_hero_image') return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80';
  
  if (key === 'about_hero_image') return 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80';
  // ... reste de votre code inchangé ...
  // AJOUTER CETTE LIGNE :
  if (key === 'about_cta_bg_image') return 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80';
  
  // AJOUTER CE BLOC :
  if (key.startsWith('signature_image_')) {
    const index = parseInt(key.replace('signature_image_', ''), 10);
    const signatureFallbacks = [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=600&q=80'
    ];
    return signatureFallbacks[index] || "";
  }
  
  if (key === 'experience_image_1') return 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=800&q=80';
  // ... reste de votre code inchangé ...
  // AJOUTER CES DEUX LIGNES :
  if (key === 'experience_image_1') return 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=800&q=80';
  if (key === 'experience_image_2') return 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80';
  
  if (key === 'about_hero_image') return 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80';
  // ... reste de votre code inchangé ...
    // Détecte s'il s'agit du collage à 7 photos d'À Propos
    if (key.startsWith('about_image_')) {
      const index = parseInt(key.replace('about_image_', ''), 10);
      const aboutFallbacks = [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      ];
      return aboutFallbacks[index] || "";
    }
    if (key === 'about_hero_image') return 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80';
  
  if (key === 'vision_image_1') return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80';
    if (key === 'vision_image_1') return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80';
    if (key === 'vision_image_2') return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80';
    
    // Détecte s'il s'agit des cartes du bas (Spécialités)
    if (key.startsWith('grid_image_')) {
      const index = parseInt(key.replace('grid_image_', ''), 10);
      const gridFallbacks = [
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80"
      ];
      return gridFallbacks[index] || "";
    }
    
    // Détecte s'il s'agit du diaporama principal
    if (key.startsWith('service_image_')) {
      const index = parseInt(key.replace('service_image_', ''), 10);
      const heroFallbacks = [
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80'
      ];
      return heroFallbacks[index] || "";
    }

    return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80";
  };

  // Fallback d'Odoo : Associe dynamiquement la vraie photo d'origine en cas de première édition !
  // Fallback d'Odoo : Associe dynamiquement la vraie photo d'origine en cas de première édition !
  const activeItem = contentList.find(item => item.key === selectedKey) || (selectedKey ? {
    key: selectedKey,
    value_fr: selectedKey.includes('image') ? getDefaultImage(selectedKey) : "Nouveau texte",
    value_en: selectedKey.includes('image') ? getDefaultImage(selectedKey) : "New text",
    font_family: "Inter",
    font_size: "16px",
    is_bold: false,
    is_image: selectedKey.includes('image')
  } : null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-neutral-500 font-light tracking-widest text-xs uppercase">
        Vérification des accès...
      </div>
    );
  }

  // A. ÉCRAN CONNECTÉ : VOTRE VRAI SITE À GAUCHE, LA PALETTE TRÈS FINE À DROITE
  if (user && contentList.length > 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-neutral-950 flex flex-col relative pb-12 overflow-hidden">
        
        {/* Barre d'administration haute ultra-fine */}
        <div className="fixed top-0 left-0 w-full bg-white/95 border-b border-neutral-200 py-3 px-6 z-50 flex items-center justify-between shadow-xs">
          
          {/* Logo gauche */}
          <div className="flex items-center space-x-4">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <h1 className="font-serif text-xs tracking-widest text-neutral-900 uppercase">
              ANIMAE LUMEN
            </h1>
          </div>

          {/* MENU DE NAVIGATION DE L'ÉDITEUR (Au Centre) */}
          {/* MENU DE NAVIGATION DE L'ÉDITEUR (Au Centre) */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => { setActiveTab('home'); setSelectedKey(null); }}
              className={`font-sans text-[10px] tracking-[0.25em] uppercase pb-1 transition-all cursor-pointer ${
                activeTab === 'home' ? 'text-neutral-950 border-b border-neutral-950 font-semibold' : 'text-neutral-400 hover:text-neutral-950'
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => { setActiveTab('about'); setSelectedKey(null); }}
              className={`font-sans text-[10px] tracking-[0.25em] uppercase pb-1 transition-all cursor-pointer ${
                activeTab === 'about' ? 'text-neutral-950 border-b border-neutral-950 font-semibold' : 'text-neutral-400 hover:text-neutral-950'
              }`}
            >
              À Propos
            </button>
            
            {/* Bouton Contact désormais actif */}
            <button
              onClick={() => { setActiveTab('contact'); setSelectedKey(null); }}
              className={`font-sans text-[10px] tracking-[0.25em] uppercase pb-1 transition-all cursor-pointer ${
                activeTab === 'contact' ? 'text-neutral-950 border-b border-neutral-950 font-semibold' : 'text-neutral-400 hover:text-neutral-950'
              }`}
            >
              Contact
            </button>
            
            {/* Bouton Portfolio désormais actif */}
            <button
              onClick={() => { setActiveTab('portfolio'); setSelectedKey(null); setIsEditingPortfolio(false); }}
              className={`font-sans text-[10px] tracking-[0.25em] uppercase pb-1 transition-all cursor-pointer ${
                activeTab === 'portfolio' ? 'text-neutral-950 border-b border-neutral-950 font-semibold' : 'text-neutral-400 hover:text-neutral-950'
              }`}
            >
              Portfolio
            </button>
          </div>

          {/* Bouton déconnexion droit */}
          <button onClick={handleLogout} className="text-[10px] uppercase tracking-[0.2em] font-light text-red-800 hover:opacity-80 transition-opacity cursor-pointer">
            Quitter l'éditeur
          </button>
        </div>

        {/* CONTAINER SPLIT : Votre vrai site à gauche, palette ultra-fine à droite */}
        <div className="flex-grow pt-14 flex flex-row h-[calc(100vh-3.5rem)] overflow-hidden">
          
          {/* LE SITE RÉEL (À Gauche - S'adapte à la largeur et affiche votre vraie page d'accueil d'origine !) */}
          {/* LE SITE RÉEL (À Gauche - Affiche l'Accueil ou l'À Propos selon l'onglet cliqué au centre) */}
          <div className="flex-grow overflow-y-auto pr-[280px]">
            <div className="bg-[#FAF9F6]">
              
              {/* INPUT INVISIBLE POUR L'UPLOAD PHOTO LOCAL */}
              <input type="file" ref={fileInputRef} onChange={(e) => handleLocalImageUpload(e, selectedKey || '')} className="hidden" accept="image/*" />

             {/* RENDER CONDITIONNEL DE LA PAGE ACTIVE (Accueil, À Propos, Contact ou Portfolios) */}
              {activeTab === 'home' ? (
                <HomePage 
                  isEditing={true}
                  selectedKey={selectedKey}
                  onSelectKey={setSelectedKey}
                  onUpdateText={(key, val) => updateField(key, 'value_fr', val)}
                  dbContent={contentList}
                />
              ) : activeTab === 'about' ? (
                <AboutPage 
                  isEditing={true}
                  selectedKey={selectedKey}
                  onSelectKey={setSelectedKey}
                  onUpdateText={(key, val) => updateField(key, 'value_fr', val)}
                  dbContent={contentList}
                />
              ) : activeTab === 'contact' ? (
                <ContactPage 
                  isEditing={true}
                  selectedKey={selectedKey}
                  onSelectKey={setSelectedKey}
                  onUpdateText={(key, val) => updateField(key, 'value_fr', val)}
                  dbContent={contentList}
                />
              ) : (
                /* --- ESPACE PORTFOLIO : Menu de jonglage entre Édition Visuelle et Gestion de projets --- */
                <div className="p-8 space-y-12">
                  
                  {/* Petit sous-menu Odoo de jonglage */}
                  <div className="flex flex-col gap-6 border-b border-neutral-200 pb-6">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center space-x-6">
                        <button onClick={() => { setPortfolioSubTab('list'); setIsEditingPortfolio(false); }} className={`font-sans text-[10px] tracking-[0.2em] uppercase pb-1 transition-all cursor-pointer ${portfolioSubTab === 'list' ? 'text-neutral-950 border-b border-neutral-950 font-semibold' : 'text-neutral-400'}`}>
                          Gérer les Galeries
                        </button>
                        <button onClick={() => { setPortfolioSubTab('page'); setIsEditingPortfolio(false); }} className={`font-sans text-[10px] tracking-[0.2em] uppercase pb-1 transition-all cursor-pointer ${portfolioSubTab === 'page' ? 'text-neutral-950 border-b border-neutral-950 font-semibold' : 'text-neutral-400'}`}>
                          Éditer l'En-tête
                        </button>
                      </div>

                      {portfolioSubTab === 'list' && !isEditingPortfolio && (
                        <button onClick={() => { setEditingPortfolio({ id: null, title_fr: '', description_fr: '', category: 'retreats', images:[] }); setIsEditingPortfolio(true); }} className="text-[10px] uppercase tracking-[0.2em] font-light bg-neutral-950 text-white px-6 py-3 hover:bg-neutral-800 transition-colors cursor-pointer">
                          + Créer un Portfolio
                        </button>
                      )}
                    </div>
                     {/* Barre de Recherche et Tri (Uniquement sur l'onglet Liste) */}
                    {portfolioSubTab === 'list' && !isEditingPortfolio && (
                      <div className="flex items-center gap-4 w-full">
                        <input 
                          type="text" 
                          placeholder="Rechercher un portfolio..." 
                          className="flex-grow bg-white border border-neutral-300 p-2.5 text-xs focus:outline-none"
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select 
                          className="bg-white border border-neutral-300 p-2.5 text-xs focus:outline-none"
                          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                        >
                          <option value="newest">Plus récents</option>
                          <option value="oldest">Plus anciens</option>
                        </select>
                      </div>
                    )}
                  </div>


                  {portfolioSubTab === 'page' ? (
                    /* RENDU DU VRAI SITE PORTFOLIO POUR L'ÉDITION DIRECTE AU CLIC */
                    <div className="bg-[#FAF9F6] border border-neutral-200">
                      <PortfolioPage 
                        isEditing={true}
                        selectedKey={selectedKey}
                        onSelectKey={setSelectedKey}
                        onUpdateText={(key, val) => updateField(key, 'value_fr', val)}
                        dbContent={contentList}
                      />
                    </div>
                  ) : isEditingPortfolio ? (
                    /* 2. FORMULAIRE DE CRÉATION EN 2 COLONNES */
                    <div className="w-full bg-white p-6 md:p-8 border border-neutral-200/40 shadow-md text-left">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-8">
                        <span className="font-sans text-[10px] tracking-widest uppercase font-semibold text-neutral-400">
                          {editingPortfolio.id ? "Modifier le Portfolio" : "Nouveau Portfolio de Création"}
                        </span>
                        <button onClick={() => setIsEditingPortfolio(false)} className="text-neutral-400 hover:text-neutral-900 text-xs cursor-pointer">Annuler</button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Colonne Gauche du formulaire : Les Textes */}
                        <div className="space-y-6">
                          <div className="flex flex-col space-y-2">
                            <label className="font-sans text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500">Titre (Français)</label>
                            <input
                              type="text"
                              required
                              value={editingPortfolio.title_fr}
                              onChange={(e) => setEditingPortfolio({ ...editingPortfolio, title_fr: e.target.value })}
                              className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <label className="font-sans text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500">Catégorie</label>
                            <select
                              value={editingPortfolio.category}
                              onChange={(e) => setEditingPortfolio({ ...editingPortfolio, category: e.target.value })}
                              className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 text-xs text-neutral-800 focus:outline-none"
                            >
                              <option value="retreats">Retraites Spirituelles</option>
                              <option value="ceremonies">Cérémonies Sacrées</option>
                              <option value="festivals">Festivals Conscients</option>
                              <option value="portraits">Portraits Thérapeutiques</option>
                            </select>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <label className="font-sans text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500">Description (Français)</label>
                            <textarea
                              rows={6}
                              value={editingPortfolio.description_fr}
                              onChange={(e) => setEditingPortfolio({ ...editingPortfolio, description_fr: e.target.value })}
                              className="w-full bg-[#FAF9F6] border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none resize-none leading-relaxed"
                            />
                          </div>
                        </div>

                        {/* Colonne Droite du formulaire : Les Médias */}
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500 block">Ajouter des photos</span>
                            <div 
                              onClick={() => {
                                const fileInput = document.getElementById('portfolio-multi-upload') as HTMLInputElement;
                                fileInput?.click();
                              }}
                              className="border border-dashed border-neutral-300 hover:border-neutral-800 bg-[#FAF9F6] p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center space-y-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" x2="12" y1="3" y2="15" />
                              </svg>
                              <span className="font-sans text-xs text-neutral-500 font-light">Glissez-déposez ou <span className="underline font-normal text-neutral-800">parcourir</span></span>
                              <input type="file" id="portfolio-multi-upload" multiple onChange={handlePortfolioMultiImageUpload} className="hidden" accept="image/*" />
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-light text-neutral-400">Ou ajouter par lien URL :</span>
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="Coller l'URL d'image ici..."
                                className="w-full bg-[#FAF9F6] border border-neutral-300 p-2 text-xs text-neutral-900 focus:outline-none h-9"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (newImageUrl) {
                                    setEditingPortfolio({ ...editingPortfolio, images: [...editingPortfolio.images, newImageUrl] });
                                    setNewImageUrl('');
                                  }
                                }}
                                className="text-xs uppercase tracking-widest bg-neutral-900 text-white px-4 py-2 hover:bg-neutral-800 h-9 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Photos de la galerie */}
                          {editingPortfolio.images.length > 0 && (
                            <div className="space-y-2">
                              <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500 block">Photos ({editingPortfolio.images.length})</span>
                              <div className="grid grid-cols-4 gap-3 max-h-[160px] overflow-y-auto pr-1">
                                {editingPortfolio.images.map((imgUrl: string, idx: number) => (
                                  <div key={idx} className="relative aspect-square bg-[#FAF9F6] group overflow-hidden border border-neutral-200">
                                    <img src={imgUrl} className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...editingPortfolio.images];
                                        updated.splice(idx, 1);
                                        setEditingPortfolio({ ...editingPortfolio, images: updated });
                                      }}
                                      className="absolute top-1 right-1 bg-red-800 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] hover:bg-red-950 transition-colors cursor-pointer shadow-sm"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-neutral-200 mt-8">
                        <button
                          onClick={handleSavePortfolio}
                          disabled={saving}
                          className="w-full text-xs uppercase tracking-[0.25em] font-light bg-neutral-950 text-white py-4 hover:bg-neutral-800 transition-all duration-300 cursor-pointer"
                        >
                          {saving ? "Sauvegarde..." : "Sauvegarder le Portfolio"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* 3. LISTE DES PORTFOLIOS */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {portfoliosList
                        .filter(p => p.title_fr.toLowerCase().includes(searchQuery.toLowerCase()))
                        .sort((a, b) => sortBy === 'newest' 
                            ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                            : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                        )
                        .map((p) => (
                        <div key={p.id} className="bg-white border border-neutral-200 p-4 shadow-xs flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="aspect-[3/2] w-full bg-[#FAF9F6] overflow-hidden">
                              {p.images[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : <div className="text-xs text-neutral-400 italic">Aucun visuel</div>}
                            </div>
                            <h4 className="font-serif text-lg">{p.title_fr}</h4>
                          </div>
                          <div className="flex justify-between pt-4 border-t border-neutral-100 mt-4">
                            <button onClick={() => { setEditingPortfolio(p); setIsEditingPortfolio(true); }} className="text-xs underline cursor-pointer">Modifier</button>
                            <button onClick={() => triggerDeleteConfirmation(p.id)} className="text-xs text-red-600 underline cursor-pointer">Supprimer</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {deleteModalOpen && (
                    <div className="fixed inset-0 bg-neutral-950/20 z-50 flex items-center justify-center p-4">
                      <div className="bg-white p-8 max-w-sm w-full border border-neutral-200 text-center space-y-6">
                        <p className="font-sans text-xs">Supprimer cette galerie ?</p>
                        <div className="flex justify-center gap-4">
                          <button onClick={() => { setDeleteModalOpen(false); setPortfolioToDelete(null); }} className="text-xs border px-4 py-2">Annuler</button>
                          <button onClick={confirmDeletePortfolio} className="text-xs bg-red-800 text-white px-4 py-2">Supprimer</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* B. LA PALETTE DE STYLE ULTRA-FINE (À Droite - Largeur 280px fixe) */}
          <div className="w-[280px] bg-white border-l border-neutral-200 p-6 fixed right-0 top-12 h-[calc(100vh-3rem)] shadow-xl flex flex-col justify-between z-40">
            <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-1">
              {activeItem ? (
                <div className="space-y-6">
                  <div className="border-b border-neutral-200 pb-3">
                    <span className="font-sans text-[9px] tracking-widest uppercase font-semibold text-neutral-400 block">Élément : {activeItem.key}</span>
                  </div>

                  {activeItem.is_image ? (
                    /* S'il s'agit d'une image : Aperçu + Téléchargement Local + Option de Coller un lien URL */
                    <div className="space-y-4">
                      <span className="font-sans text-[9px] tracking-widest uppercase font-light text-neutral-400 block">Aperçu de la Photo</span>
                      <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100 shadow-xs border border-neutral-200/50">
                        <img src={activeItem.value_fr} alt="Aperçu" className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="space-y-2 pt-2 border-t border-neutral-100">
                        <p className="font-sans text-[11px] font-light text-neutral-500 leading-relaxed">Téléverser un fichier depuis votre ordinateur :</p>
                        <button onClick={() => fileInputRef.current?.click()} className="w-full text-[10px] uppercase tracking-widest font-light border border-neutral-300 p-3 hover:bg-neutral-50 transition-colors text-center cursor-pointer">Choisir une photo locale</button>
                      </div>

                      <div className="flex flex-col space-y-2 pt-2 border-t border-neutral-100">
                        <label className="font-sans text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500">Ou coller un lien d'image (URL)</label>
                        <input
                          type="text"
                          value={activeItem.value_fr}
                          onChange={(e) => {
                            updateField(activeItem.key, 'value_fr', e.target.value);
                            updateField(activeItem.key, 'value_en', e.target.value); // Applique à l'anglais aussi
                          }}
                          className="w-full bg-neutral-50 border border-neutral-300 p-2 text-xs text-neutral-800 focus:border-neutral-950 focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    /* S'il s'agit d'un texte : Double saisie synchronisée */
                    <div className="space-y-5">
                      
                      {/* Zone d'écriture synchronisée de droite (avec support des retours à la ligne) */}
                      <div className="flex flex-col space-y-2">
                        <label className="font-sans text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500">Contenu (Français)</label>
                        <textarea
                          rows={4}
                          value={activeItem.value_fr}
                          onChange={(e) => updateField(activeItem.key, 'value_fr', e.target.value)}
                          className="w-full bg-neutral-50 border border-neutral-300 p-2 text-xs text-neutral-800 focus:border-neutral-950 focus:outline-none font-sans font-light leading-relaxed resize-none"
                        />
                      </div>

                      {/* 1. Sélection de la Police d'Art Complète */}
                      <div className="flex flex-col space-y-2">
                        <label className="font-sans text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500">Style de Police</label>
                        <select value={activeItem.font_family} onChange={(e) => updateField(activeItem.key, 'font_family', e.target.value)} className="w-full bg-neutral-50 border border-neutral-300 p-2 text-xs text-neutral-800 focus:border-neutral-950 focus:outline-none cursor-pointer">
                          <option value="Inter">Sans-Serif Moderne (Inter)</option>
                          <option value="Cormorant Garamond">Serif d'Art (Cormorant)</option>
                          <option value="Playfair Display">Serif Littéraire (Playfair)</option>
                          <option value="Cinzel">Cinzel (Artistique)</option>
                          <option value="Italiana">Italiana (Luxueux)</option>
                          <option value="Montserrat">Montserrat (Gras Moderne)</option>
                          <option value="Lora">Lora (Poétique)</option>
                          <option value="Marcellus">Marcellus (Romain)</option>
                          <option value="Italianno">Italianno (Calligraphie d'Amour)</option>
                        </select>
                      </div>

                      {/* 2. Taille précise en pixels */}
                      <div className="flex flex-col space-y-2">
                        <label className="font-sans text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500">Taille (en pixels)</label>
                        <input type="text" value={activeItem.font_size} onChange={(e) => updateField(activeItem.key, 'font_size', e.target.value)} placeholder="ex: 24px" className="w-full bg-neutral-50 border border-neutral-300 p-2 text-xs text-neutral-800 focus:border-neutral-950 focus:outline-none font-mono" />
                      </div>

                      {/* 3. Option de mise en gras */}
                      <div className="flex items-center space-x-3 pt-1">
                        <input type="checkbox" id="is_bold" checked={activeItem.is_bold} onChange={(e) => updateField(activeItem.key, 'is_bold', e.target.checked)} className="w-4 h-4 border-neutral-300 focus:ring-neutral-950 accent-neutral-950 cursor-pointer" />
                        <label htmlFor="is_bold" className="font-sans text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500 select-none cursor-pointer">Mettre en Gras</label>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="font-sans text-xs tracking-wide font-light text-neutral-400 leading-relaxed">Cliquez directement sur un texte ou une photo à gauche pour ouvrir sa palette de styles (polices, tailles en pixels, gras) et le modifier en direct à l'écran.</p>
                </div>
              )}
            </div>

            {/* BOUTON SAUVEGARDER DANS LA PALETTE DE DROITE */}
            <div className="space-y-4 border-t border-neutral-200 pt-6">
              {saveSuccess && <p className="text-center text-[10px] font-light text-green-700 tracking-wide animate-pulse">✓ Traduit en anglais & Sauvegardé !</p>}
              <button onClick={handleSaveChanges} disabled={saving} className="w-full text-xs uppercase tracking-[0.25em] font-light bg-neutral-950 text-white hover:bg-neutral-800 transition-all duration-300 py-4 rounded-none shadow-md cursor-pointer disabled:opacity-50">
                {saving ? 'Traduction en cours...' : 'Sauvegarder le site'}
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // C. FORMULAIRE DE LOGIN SÉCURISÉ (LUMINEUX)
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden bg-[#FAF9F6] text-neutral-900">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80')" }} />
      <div className="absolute inset-0 bg-[#FAF9F6]/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6]/80 via-transparent to-[#FAF9F6]/25 pointer-events-none" />
      <div className="relative z-10 w-full max-w-md space-y-8 bg-white/70 backdrop-blur-md p-8 border border-white/80 shadow-2xl">
        <div className="text-center space-y-3">
          <span className="font-sans text-xs tracking-[0.35em] uppercase font-light text-neutral-500 block animate-pulse">Espace Privé</span>
          <h1 className="font-serif text-3xl font-light tracking-wide text-neutral-900 leading-tight">Connexion Admin</h1>
          <div className="w-12 h-[1px] bg-neutral-300 mx-auto mt-4" />
        </div>
        {errorMsg && <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-light tracking-wide text-center">{errorMsg}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="font-sans text-xs uppercase tracking-[0.2em] font-light text-neutral-500">Identifiant (Email)</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b border-neutral-300 py-2.5 text-neutral-900 focus:border-neutral-950 focus:outline-none" />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-sans text-xs uppercase tracking-[0.2em] font-light text-neutral-500">Mot de passe</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border-b border-neutral-300 py-2.5 text-neutral-900 focus:border-neutral-950 focus:outline-none" />
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full text-xs uppercase tracking-[0.25em] font-light text-neutral-900 border border-neutral-900/30 py-4 hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-all">Se connecter</button>
          </div>
        </form>
      </div>
    </div>
  );
}