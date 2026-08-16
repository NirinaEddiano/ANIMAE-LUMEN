-- ============================================================
-- ANIMAE LUMEN — Raccourcissement des textes longs (dynamique en DB)
-- ============================================================

INSERT INTO site_content (key, value_fr, value_en, font_family, font_size, is_bold, is_image)
VALUES
-- Page À propos — L'essence de l'instant (3 paragraphes raccourcis)
('about_paragraph_1',
 'Ma photographie est une démarche spirituelle, introspective, presque thérapeutique. Elle cherche à révéler l''invisible et à capter le souffle de vie qui traverse les êtres et les espaces sacrés.',
 'My photography is a spiritual, introspective, almost therapeutic approach. It seeks to reveal the unseen and capture the breath of life flowing through beings and sacred spaces.',
 'Minionpro', '16px', false, false),

('about_paragraph_2',
 'Lors des retraites et cérémonies sacrées, ma présence se veut humble, presque murmurée. Je me fonds dans l''énergie du cercle pour figer la synergie collective et la dévotion silencieuse des rituels.',
 'During spiritual retreats and sacred ceremonies, my presence is humble, almost whispered. I dissolve into the circle''s energy to freeze collective synergy and silent devotion.',
 'Minionpro', '16px', false, false),

('about_paragraph_3',
 'Dans l''intimité du face-à-face, la séance de portrait introspectif agit comme un rituel de guérison et d''acceptation par l''image, dans un espace de sécurité absolue et d''écoute bienveillante.',
 'In the intimacy of a one-on-one session, introspective portraiture acts as a ritual of healing and acceptance through imagery, within a space of absolute safety and benevolent listening.',
 'Minionpro', '16px', false, false),

-- Page À propos — L'expérience de l'espace sacré
('experience_desc1',
 'Pour que l''âme accepte de se révéler, elle a besoin d''une sécurité absolue. Je marche à vos côtés et je me fonds doucement dans le silence de votre espace.',
 'For the soul to reveal itself, it requires absolute safety. I walk by your side and softly dissolve into the silence of your space.',
 'Minionpro', '16px', false, false),

('experience_desc2',
 'Sans flash ni mise en scène artificielle, je travaille exclusivement en lumière naturelle, avec un obturateur silencieux pour préserver la pureté de vos instants.',
 'No flash, no staging: I work exclusively in natural light, with a completely silent shutter to preserve the purity of your moments.',
 'Minionpro', '16px', false, false),

-- Page À propos — Les outils de l'invisible
('signature_description_0',
 'Je n''utilise aucun éclairage artificiel : uniquement le soleil, ses prismes et ses réfractions naturelles pour envelopper mes sujets d''un voile de lumière céleste.',
 'I use no artificial lighting: only the sun, capturing its natural prisms and refractions to wrap my subjects in a celestial veil of golden light.',
 'Minionpro', '16px', false, false),

('signature_description_1',
 'Un grain doux et organique, inspiré de la pellicule argentique, donne à l''image numérique une dimension intemporelle, brute et presque palpable.',
 'My images integrate a soft grain and an organic texture inspired by analog film, giving the digital medium a timeless, raw, almost tactile quality.',
 'Minionpro', '16px', false, false),

('signature_description_2',
 'Le silence est mon outil le plus précieux : grâce à un équipement haut de gamme sans bruit de déclenchement, je me fonds dans vos rituels pour préserver leur vérité pure.',
 'Silence is my most precious tool: thanks to high-end equipment with zero trigger noise, I blend into your rituals to preserve their absolute truth.',
 'Minionpro', '16px', false, false),

-- Page À propos + Portfolio — CTA
('about_cta_description',
 'Vous organisez une retraite, célébrez une union d''âmes ou souhaitez un portrait thérapeutique ? Écrivons ensemble le témoignage visuel de votre lumière.',
 'Hosting a retreat, celebrating a sacred union, or seeking a therapeutic portrait? Let us write the visual testament of your light together.',
 'Minionpro', '16px', false, false),

('portfolio_cta_description',
 'Vous organisez une retraite, célébrez une union d''âmes ou souhaitez un portrait thérapeutique ? Écrivons ensemble le témoignage visuel de votre lumière.',
 'Hosting a retreat, celebrating a sacred union, or seeking a therapeutic portrait? Let us write the visual testament of your light together.',
 'Minionpro', '16px', false, false)

ON CONFLICT (key) DO UPDATE SET
  value_fr     = EXCLUDED.value_fr,
  value_en     = EXCLUDED.value_en,
  font_family  = EXCLUDED.font_family,
  font_size    = EXCLUDED.font_size,
  is_bold      = EXCLUDED.is_bold,
  is_image     = EXCLUDED.is_image;

-- Vérification
SELECT key, left(value_fr, 80) AS value_fr FROM site_content WHERE key IN
('about_paragraph_1','about_paragraph_2','about_paragraph_3','experience_desc1','experience_desc2','signature_description_0','signature_description_1','signature_description_2','about_cta_description','portfolio_cta_description');
