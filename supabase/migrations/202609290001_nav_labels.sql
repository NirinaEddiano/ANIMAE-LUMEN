-- ============================================================
-- ANIMAE LUMEN — Libellés du menu de navigation (Header + Burger)
-- Clés utilisées par src/lib/navigation.ts
-- ============================================================

INSERT INTO site_content (key, value_fr, value_en, font_family, font_size, is_bold, is_image)
VALUES
  ('nav_souls',     'Âmes',           'Souls',     'Minion Pro', '14px', false, false),
  ('nav_events',    'Événements',     'Events',    'Minion Pro', '14px', false, false),
  ('nav_retreats',  'Retraites',      'Retreats',  'Minion Pro', '14px', false, false),
  ('nav_about',     'À propos',       'About',     'Minion Pro', '14px', false, false),
  ('nav_reachout',  'Nous contacter', 'Reach out', 'Minion Pro', '14px', false, false)
ON CONFLICT (key) DO NOTHING;

SELECT key, value_fr, value_en FROM site_content WHERE key LIKE 'nav_%' ORDER BY key;
