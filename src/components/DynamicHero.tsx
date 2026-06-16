'use client';

import Link from 'next/link';
import DynamicText from './DynamicText';
import DynamicImage from './DynamicImage';

export default function DynamicHero({
  isEditing = false,
  selectedKey = null,
  onSelectKey = () => {},
  onUpdateText = () => {},
  dbContent = [],
}: {
  isEditing?: boolean;
  selectedKey?: string | null;
  onSelectKey?: (key: string) => void;
  onUpdateText?: (key: string, value: string) => void;
  dbContent?: any[];
}) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Image Hero — absolute, z-0, full cover */}
      <DynamicImage
        dbKey="home_hero_image"
        defaultImage="https://images.pexels.com/photos/13030798/pexels-photo-13030798.jpeg"
        alt="Hero Animae Lumen"
        containerClassName="absolute inset-0 z-0 h-screen w-full"
        className="w-full h-full object-cover"
        isEditing={isEditing}
        selectedKey={selectedKey}
        onSelectKey={onSelectKey}
        onUpdateText={onUpdateText}
        dbContent={dbContent}
      />

      {/* Voiles */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-charcoal/40 via-charcoal/20 to-charcoal/60 pointer-events-none" />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: 'url("/grain.svg")',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          mixBlendMode: 'multiply',
          opacity: 0.5,
        }}
      />

      {/* Contenu central */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-3xl space-y-10">
          <DynamicText
            dbKey="home_hero_title"
            as="h1"
            className="text-white font-serif text-[clamp(3rem,12vw,8rem)] tracking-[0.06em] leading-[0.95]"
            defaultText="Une quête de présence"
            isEditing={isEditing}
            selectedKey={selectedKey}
            onSelectKey={onSelectKey}
            onUpdateText={onUpdateText}
            dbContent={dbContent}
          />

          <DynamicText
            dbKey="home_hero_intro"
            as="p"
            className="text-white/60 font-sans text-lg md:text-xl font-light leading-relaxed tracking-wide max-w-lg mx-auto"
            defaultText="La lumière de l'âme."
            isEditing={isEditing}
            selectedKey={selectedKey}
            onSelectKey={onSelectKey}
            onUpdateText={onUpdateText}
            dbContent={dbContent}
          />

          <div className="pt-4">
            <Link
              href="/decouvrir"
              onClick={(e) => isEditing && e.preventDefault()}
              className="inline-block text-sm md:text-base uppercase tracking-[0.35em] border border-white/25 px-12 py-5 hover:bg-white hover:text-charcoal hover:border-white transition-all duration-500"
            >
              <DynamicText
                dbKey="btn_discover"
                as="span"
                className="text-white/70"
                defaultText="DÉCOUVRIR"
                isEditing={isEditing}
                selectedKey={selectedKey}
                onSelectKey={onSelectKey}
                onUpdateText={onUpdateText}
                dbContent={dbContent}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
