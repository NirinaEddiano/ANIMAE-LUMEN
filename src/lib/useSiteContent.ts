'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface SiteContentRow {
  key: string;
  value_fr: string;
  value_en: string;
  font_family: string;
  font_size: string;
  is_bold: boolean;
  is_stamped: boolean;
  is_image: boolean;
  is_hidden?: boolean;
}

const cache = new Map<string, SiteContentRow>();

export function clearSiteContentCache() {
  cache.clear();
}

export function useSiteContent(keys: string[]): SiteContentRow[] {
  const cacheKey = keys.join('|');
  const [, invalidate] = useState(0);

  useEffect(() => {
    const list = cacheKey ? cacheKey.split('|') : [];
    const missing = list.filter((k) => !cache.has(k));
    if (missing.length === 0) return;

    let active = true;
    supabase
      .from('site_content')
      .select('*')
      .in('key', missing)
      .then(({ data }) => {
        (data || []).forEach((row) => cache.set(row.key, row as SiteContentRow));
        if (active) invalidate((v) => v + 1);
      });

    return () => {
      active = false;
    };
  }, [cacheKey]);

  const list = cacheKey ? cacheKey.split('|') : [];
  return list.map((k) => cache.get(k)!).filter(Boolean);
}
