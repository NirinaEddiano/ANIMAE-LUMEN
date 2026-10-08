'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { isDeleted, isHidden } from '@/lib/content';

interface DynamicImageProps {
  dbKey: string;
  className?: string;
  defaultImage?: string;
  alt?: string;
  containerClassName?: string;
  isEditing?: boolean;
  selectedKey?: string | null;
  onSelectKey?: (key: string) => void;
  onUpdateText?: (key: string, value: string) => void;
  dbContent?: any[];
}

export default function DynamicImage({
  dbKey,
  className = '',
  defaultImage = '',
  alt = '',
  containerClassName = '',
  isEditing = false,
  selectedKey = null,
  onSelectKey,
  onUpdateText,
  dbContent = [],
}: DynamicImageProps) {
  const { language } = useLanguage();
  const [localItem, setLocalItem] = useState<any>(null);

  useEffect(() => {
    if (isEditing) return;
    supabase
      .from('site_content')
      .select('*')
      .eq('key', dbKey)
      .single()
      .then(({ data }) => {
        if (data) setLocalItem(data);
      });
  }, [dbKey, isEditing]);

  const item = isEditing
    ? dbContent.find((i: any) => i.key === dbKey)
    : localItem;

  // Les URL sont identiques dans les deux colonnes : on accepte les deux.
  const url = item?.value_en || item?.value_fr || defaultImage;

  const isSelected = isEditing && selectedKey === dbKey;

  // Masquage choisi par l'admin. En edition la photo reste cliquable pour
  // pouvoir etre reaffichee ou remplacee.
  const hidden = isHidden(item);
  const deleted = isDeleted(item);

  const handleClick = () => {
    if (isEditing && onSelectKey) {
      onSelectKey(dbKey);
      // Input dedie a l'upload de contenu : un selecteur global
      // 'input[type="file"]' pouvait viser celui d'une autre section.
      document.querySelector<HTMLInputElement>('input[data-site-upload="content"]')?.click();
    }
  };

  if (deleted || (hidden && !isEditing)) return null;

  return (
    <div
      onClick={handleClick}
      className={`overflow-hidden ${containerClassName} ${
        isEditing ? 'cursor-pointer hover:brightness-90' : ''
      } ${isSelected ? 'ring-4 ring-sage/40 ring-inset' : ''} ${
        hidden ? 'opacity-40 ring-2 ring-dashed ring-charcoal/40' : ''
      }`}
      role={isEditing ? 'button' : undefined}
      tabIndex={isEditing ? 0 : undefined}
    >
      {url ? (
        <img
          src={url}
          alt={alt}
          className={`w-full h-full object-cover ${className} ${hidden ? 'grayscale' : ''}`}
        />
      ) : (
        <div className={`w-full h-full bg-sage/10 ${className}`} />
      )}
    </div>
  );
}
