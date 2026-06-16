-- ============================================================
-- ANIMAE LUMEN — Initialisation Supabase
-- ============================================================

DO $$ BEGIN
  CREATE TYPE portfolio_category AS ENUM (
    'retreats', 'ceremonies', 'festivals', 'portraits'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS site_content (
  key          TEXT PRIMARY KEY,
  value_fr     TEXT NOT NULL DEFAULT '',
  value_en     TEXT NOT NULL DEFAULT '',
  font_family  TEXT NOT NULL DEFAULT 'Inter',
  font_size    TEXT NOT NULL DEFAULT '16px',
  is_bold      BOOLEAN NOT NULL DEFAULT FALSE,
  is_image     BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS portfolios (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr       TEXT NOT NULL,
  title_en       TEXT NOT NULL DEFAULT '',
  description_fr TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  category       portfolio_category NOT NULL,
  images         TEXT[] NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON portfolios (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_category ON portfolios (category);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_content_select_public" ON site_content;
DROP POLICY IF EXISTS "site_content_insert_auth" ON site_content;
DROP POLICY IF EXISTS "site_content_update_auth" ON site_content;
DROP POLICY IF EXISTS "site_content_delete_auth" ON site_content;
DROP POLICY IF EXISTS "portfolios_select_public" ON portfolios;
DROP POLICY IF EXISTS "portfolios_insert_auth" ON portfolios;
DROP POLICY IF EXISTS "portfolios_update_auth" ON portfolios;
DROP POLICY IF EXISTS "portfolios_delete_auth" ON portfolios;

CREATE POLICY "site_content_select_public" ON site_content FOR SELECT USING (true);
CREATE POLICY "site_content_insert_auth"  ON site_content FOR INSERT  TO authenticated WITH CHECK (true);
CREATE POLICY "site_content_update_auth"  ON site_content FOR UPDATE  TO authenticated USING (true);
CREATE POLICY "site_content_delete_auth"  ON site_content FOR DELETE  TO authenticated USING (true);

CREATE POLICY "portfolios_select_public" ON portfolios FOR SELECT USING (true);
CREATE POLICY "portfolios_insert_auth"  ON portfolios FOR INSERT  TO authenticated WITH CHECK (true);
CREATE POLICY "portfolios_update_auth"  ON portfolios FOR UPDATE  TO authenticated USING (true);
CREATE POLICY "portfolios_delete_auth"  ON portfolios FOR DELETE  TO authenticated USING (true);

-- ============================================================
-- SEED — Contenu spirituel / mystique
-- ============================================================
TRUNCATE TABLE site_content;

INSERT INTO site_content (key, value_fr, value_en, font_family, font_size, is_bold, is_image)
VALUES
-- Home
('site_title',          'ANIMAE LUMEN',                            'ANIMAE LUMEN',                           'Cormorant Garamond', '120px', true,  false),
('home_hero_title',     'L''éclat de l''âme',                     'The radiance of the soul',               'Cormorant Garamond', '90px',  true,  false),
('home_hero_intro',     'Un témoignage visuel de lumière, de silence et de présence pure.', 'A visual testament of light, silence and pure presence.', 'Inter', '20px', false, false),
('home_hero_image',     'https://images.pexels.com/photos/13030798/pexels-photo-13030798.jpeg', 'https://images.pexels.com/photos/13030798/pexels-photo-13030798.jpeg', '', '', false, true),
('btn_discover',        'ENTRER DANS LA LUMIÈRE',                 'STEP INTO THE LIGHT',                    'Inter',              '14px',  true,  false),

-- Découvrir
('discover_hero_image', 'https://images.pexels.com/photos/13030798/pexels-photo-13030798.jpeg', 'https://images.pexels.com/photos/13030798/pexels-photo-13030798.jpeg', '', '', false, true),
('discover_hero_title', 'Choisir une voie',                       'Choose a path',                          'Cormorant Garamond', '48px',  false, false),
('discover_hero_subtitle', 'L''univers d''Animae Lumen',          'Animae Lumen''s universe',               'Inter',              '16px',  false, false),
('discover_services_title', 'MES GALERIES',                       'MY GALLERIES',                           'Inter',              '14px',  true,  false),
('portfolio_grid_bg_texture', '/paper.svg',                       '/paper.svg',                             '',                   '',      false, true),

-- 4 Voies
('cat_1_title',         'RETRAITES SPIRITUELLES',                 'SPIRITUAL RETREATS',                     'Cormorant Garamond', '24px',  false, false),
('cat_1_img',           'https://images.unsplash.com/photo-1506191832946-e9b3f051495d?q=80&w=2070', 'https://images.unsplash.com/photo-1506191832946-e9b3f051495d?q=80&w=2070', '', '', false, true),
('cat_2_title',         'FESTIVALS CONSCIENTS',                  'CONSCIOUS FESTIVALS',                    'Cormorant Garamond', '24px',  false, false),
('cat_2_img',           'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070', '', '', false, true),
('cat_3_title',         'CÉRÉMONIES SACRÉES',                    'SACRED CEREMONIES',                      'Cormorant Garamond', '24px',  false, false),
('cat_3_img',           'https://images.unsplash.com/photo-1511974035430-5de47d3b95da?q=80&w=2070', 'https://images.unsplash.com/photo-1511974035430-5de47d3b95da?q=80&w=2070', '', '', false, true),
('cat_4_title',         'PORTRAITS THÉRAPEUTIQUES',               'THERAPEUTIC PORTRAITS',                  'Cormorant Garamond', '24px',  false, false),
('cat_4_img',           'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070', '', '', false, true),

-- Heroes des catégories de services
('hero_retreats_title', 'Retraites Spirituelles',               'Spiritual Retreats',                     'Cormorant Garamond', '48px',  false, false),
('hero_retreats_desc',  'Un espace de silence, de reconnexion et de ressourcement profond au c\u0153ur de la nature sauvage.', 'A space for silence, reconnection and deep restoration in the heart of the wild.', 'Inter', '16px', false, false),
('hero_retreats_bg',    'https://images.unsplash.com/photo-1506191832946-e9b3f051495d?q=80&w=2070', 'https://images.unsplash.com/photo-1506191832946-e9b3f051495d?q=80&w=2070', '', '', false, true),
('hero_festivals_title','Festivals Conscients',                 'Conscious Festivals',                    'Cormorant Garamond', '48px',  false, false),
('hero_festivals_desc', 'La célébration collective, la musique et l\u2019expression libre dans des lieux chargés d\u2019\u00e2me.', 'Collective celebration, music and free expression in soulful places.', 'Inter', '16px', false, false),
('hero_festivals_bg',   'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070', '', '', false, true),
('hero_ceremonies_title','Cérémonies Sacrées',                  'Sacred Ceremonies',                      'Cormorant Garamond', '48px',  false, false),
('hero_ceremonies_desc','Des rituels de passage, unions sacrées et cérémonies immortalisées dans leur vérité la plus pure.', 'Rites of passage, sacred unions and ceremonies captured in their purest truth.', 'Inter', '16px', false, false),
('hero_ceremonies_bg',  'https://images.unsplash.com/photo-1511974035430-5de47d3b95da?q=80&w=2070', 'https://images.unsplash.com/photo-1511974035430-5de47d3b95da?q=80&w=2070', '', '', false, true),
('hero_portraits_title','Portraits Thérapeutiques',             'Therapeutic Portraits',                  'Cormorant Garamond', '48px',  false, false),
('hero_portraits_desc', 'Un voyage intime pour révéler l\u2019essence de votre \u00eatre \u00e0 travers l\u2019objectif.', 'An intimate journey to reveal the essence of your being through the lens.', 'Inter', '16px', false, false),
('hero_portraits_bg',   'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070', '', '', false, true);

-- Vérification
SELECT * FROM site_content;
