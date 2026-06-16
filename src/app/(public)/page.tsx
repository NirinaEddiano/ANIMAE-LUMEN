'use client';

import Hero from '@/components/Hero';

export default function HomePage(props: {
  isEditing?: boolean;
  selectedKey?: string | null;
  onSelectKey?: (key: string) => void;
  onUpdateText?: (key: string, value: string) => void;
  dbContent?: any[];
}) {
  return <Hero {...props} />;
}
