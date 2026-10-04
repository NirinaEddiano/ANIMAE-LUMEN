-- ANIMAE LUMEN — 3 services (SOULS / EVENTS / RETREATS) + anglais par défaut
BEGIN;

-- ─── Navigation ───────────────────────────────────────────────────────────
INSERT INTO site_content (key, value_fr, value_en, font_family, font_size, is_bold, is_image) VALUES
  ('nav_souls','Âmes','Souls','Minion Pro','11px',false,false),
  ('nav_events','Événements','Events','Minion Pro','11px',false,false),
  ('nav_retreats','Retraites','Retreats','Minion Pro','11px',false,false),
  ('nav_about','À propos','About','Minion Pro','11px',false,false),
  ('nav_reachout','Nous contacter','Reach out','Minion Pro','11px',false,false)
ON CONFLICT (key) DO UPDATE SET value_fr = EXCLUDED.value_fr, value_en = EXCLUDED.value_en;

-- ─── Nouvelles clés 3 services ───────────────────────────────────────────
-- Les 3 services ont une photo de hero, éditable depuis l'admin.
INSERT INTO site_content (key, value_fr, value_en, is_image) VALUES
  ('cat_1_subtitle','Portraits et travail autour de l''humain','Portraits and work around the human',false),
  ('cat_2_subtitle','Festivals, musique et événements, Travel','Festivals, music and events, Travel',false),
  ('cat_3_subtitle','Retraites et cérémonies','Retreats and ceremonies',false),

  ('hero_souls_title','ÂMES','SOULS',false),
  ('hero_souls_desc','Portraits et travail autour de l''humain','Portraits and work around the human',false),
  ('hero_souls_bg','https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=80',true),

  ('hero_events_title','ÉVÉNEMENTS','EVENTS',false),
  ('hero_events_desc','Festivals, musique et événements, Travel','Festivals, music and events, Travel',false),
  ('hero_events_bg','https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1600&q=80',true),

  ('contact_hero_tagline','L''espace de rencontre','The meeting space',false),
  ('contact_hero_heading','Prendre contact','Get in touch',false),
  ('contact_hero_subheading','Faisons connaissance et co-créons un espace de présence pour immortaliser votre lumière.','Let us connect and co-create a space of presence to immortalize your light.',false),
  ('contact_tagline','L''invitation au partage','Invitation to share',false),
  ('contact_heading','S''unir & échanger','Unite & connect',false),
  ('contact_form_tagline','Écrire une histoire','Write a story',false),
  ('contact_form_heading','Votre projet','Your project',false),
  ('contact_label_firstname','Prénom','First name',false),
  ('contact_label_lastname','Nom','Last name',false),
  ('contact_label_email','Adresse email','Email address',false),
  ('contact_label_subject','Sujet','Subject',false),
  ('contact_label_message','Votre message (retraite, union sacrée, portrait introspectif…)','Your message (retreat, sacred union, introspective portrait…)',false),
  ('contact_btn_send','Initier la connexion','Initiate connection',false),
  ('contact_btn_sending','Envoi…','Sending…',false)
ON CONFLICT (key) DO UPDATE SET
  value_fr = EXCLUDED.value_fr,
  value_en = EXCLUDED.value_en,
  is_image = EXCLUDED.is_image;

-- ─── Traductions EN ───────────────────────────────────────────────────────
UPDATE site_content s SET value_en = v.en FROM (VALUES
  ('cat_1_title','SOULS'),
  ('cat_2_title','EVENTS'),
  ('cat_3_title','RETREATS'),
  ('discover_services_title','MY GALLERIES'),
  ('discover_hero_title','Choose a path'),
  ('discover_hero_subtitle','The world of Animae Lumen'),
  ('hero_retreats_title','RETREATS'),
  ('hero_retreats_desc','Retreats and ceremonies'),
  ('home_hero_title','ANIMAE LUMEN'),
  ('home_hero_subtitle','A quest for presence'),
  ('home_hero_intro','A spiritual, introspective approach, suspended outside of time.'),
  ('btn_discover','ENTER THE CIRCLE'),
  ('insta_bio','Witness to the sacred in the human presence — Souls, Events and Retreats'),
  ('insta_btn_text','Subscribe'),
  ('insta_stats','185 Subscriptions'),
  ('experience_desc1','For the soul to reveal itself, it needs absolute security. I walk alongside you and blend gently into the silence of your space.'),
  ('experience_desc2','Without flash or artificial staging, I work exclusively in natural light, with a silent shutter to preserve the purity of your moments.'),
  ('signature_description_0','I use no artificial lighting: only the sun, its prisms and its natural refractions to envelop my subjects in a veil of celestial light.'),
  ('signature_description_1','A soft, organic grain, inspired by silver film, gives the digital image a timeless, raw and almost palpable dimension.'),
  ('signature_description_2','Silence is my most precious tool: thanks to high-end equipment without shutter noise, I blend into your rituals to preserve their pure truth.'),
  ('about_paragraph_1','My photography is a spiritual, introspective, almost therapeutic approach. It seeks to reveal the invisible and capture the breath of life that flows through sacred beings and spaces.'),
  ('about_paragraph_2','During retreats and sacred ceremonies, my presence is humble, almost whispered. I blend into the energy of the circle to freeze the collective synergy and the silent devotion of the rituals.'),
  ('about_paragraph_3','In the intimacy of face-to-face, the introspective portrait session acts as a ritual of healing and acceptance through images, in a space of absolute security and caring listening.'),
  ('about_cta_description','Are you organizing a retreat, celebrating a union of souls, or would you like a portrait? Let''s write together the visual testimony of your light.'),
  ('portfolio_cta_description','Are you organizing a retreat, celebrating a union of souls, or would you like a portrait? Let''s write together the visual testimony of your light.')
) AS v(key, en) WHERE s.key = v.key;

-- ─── Nettoyage des 4e service et des anciennes clés ──────────────────────
DELETE FROM site_content WHERE key IN (
  'cat_4_title','cat_4_img',
  'hero_portraits_title','hero_portraits_desc','hero_portraits_bg',
  'hero_festivals_title','hero_festivals_desc','hero_festivals_bg',
  'hero_ceremonies_title','hero_ceremonies_desc','hero_ceremonies_bg'
);

-- ─── Catégories portfolios : 4 anciennes → 3 services ─────────────────────
UPDATE portfolios SET category = 'souls'   WHERE category = 'portraits';
UPDATE portfolios SET category = 'events'  WHERE category = 'festivals';
UPDATE portfolios SET category = 'retreats' WHERE category = 'ceremonies';

UPDATE portfolios SET title_en = 'Sensitive Sisterhood' WHERE id = 'a87a8ca2-ca7e-4d24-a3cf-91b6e02f6692';

COMMIT;

-- ─── Vérification ─────────────────────────────────────────────────────────
-- Doit renvoyer uniquement des images ou des valeurs identiques par nature.
SELECT key, value_fr, value_en FROM site_content
WHERE value_en = value_fr AND value_fr <> '' ORDER BY key;

-- Catégories des portfolios : doit renvoyer seulement souls / events / retreats.
SELECT category, count(*) FROM portfolios GROUP BY category ORDER BY category;
