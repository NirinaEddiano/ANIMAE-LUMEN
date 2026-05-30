'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import HomePage from '../(public)/page'; // Importation directe de votre VRAIE page d'accueil d'origine !

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

  // États de l'éditeur en direct
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // API de Traduction Automatique (FR -> EN)
  const autoTranslate = async (text: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      return data[0][0][0];
    } catch (error) {
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
          <div className="flex items-center space-x-4">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <h1 className="font-serif text-xs tracking-widest text-neutral-900 uppercase">
              ANIMAE LUMEN <span className="font-sans text-[9px] text-neutral-400 pl-2">Mode Édition en direct</span>
            </h1>
          </div>
          <button onClick={handleLogout} className="text-[10px] uppercase tracking-[0.2em] font-light text-red-800 hover:opacity-80 transition-opacity cursor-pointer">
            Quitter l'éditeur
          </button>
        </div>

        {/* CONTAINER SPLIT : Votre vrai site à gauche, palette ultra-fine à droite */}
        <div className="flex-grow pt-14 flex flex-row h-[calc(100vh-3.5rem)] overflow-hidden">
          
          {/* LE SITE RÉEL (À Gauche - S'adapte à la largeur et affiche votre vraie page d'accueil d'origine !) */}
          <div className="flex-grow overflow-y-auto pr-[280px]">
            <div className="bg-[#FAF9F6]">
              
              {/* INPUT INVISIBLE POUR L'UPLOAD PHOTO LOCAL */}
              <input type="file" ref={fileInputRef} onChange={(e) => handleLocalImageUpload(e, selectedKey || '')} className="hidden" accept="image/*" />

              {/* 
                RENDU DU VRAI SITE D'ACCUEIL :
                Nous appelons votre composant HomePage réel d'origine !
              */}
              <HomePage 
                isEditing={true}
                selectedKey={selectedKey}
                onSelectKey={setSelectedKey}
                onUpdateText={(key, val) => updateField(key, 'value_fr', val)}
                dbContent={contentList}
              />

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