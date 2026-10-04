-- Rend chaque contenu mascable depuis l'administrateur.
-- is_hidden = TRUE  ->  l'element n'est plus rendu sur le site public.
-- L'element n'est jamais supprime de la base : il suffit de decocher
-- l'interrupteur pour le faire revenir, ce qui est reversible.

ALTER TABLE site_content
  ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT FALSE;

-- La signature de l'artiste est editable et masquable comme le reste.
INSERT INTO site_content (key, value_fr, value_en, font_family, font_size, is_image, is_hidden)
VALUES ('site_byline', 'by Tina Rosae', 'by Tina Rosae', 'Minionpro', '', false, false)
ON CONFLICT (key) DO NOTHING;

-- Textes du footer : ils etaient codes en dur dans le composant, donc
-- impossibles a modifier depuis l'admin.
INSERT INTO site_content (key, value_fr, value_en, font_family, font_size, is_image, is_hidden)
VALUES
  ('footer_cta_text',        'Prendre contact',        'Get in touch',       'Minionpro', '13px', false, false),
  ('footer_email',           'animaelumen@outlook.com','animaelumen@outlook.com','Minionpro', '13px', false, false),
  ('footer_whatsapp_label',  'WhatsApp',               'WhatsApp',           'Minionpro', '13px', false, false)
ON CONFLICT (key) DO NOTHING;

-- Le footer utilisait un '@animaelumen' code en dur, independamment de
-- insta_username : les deux pouvaient diverger. On force la meme valeur.
UPDATE site_content
   SET value_fr = '@animaelumen', value_en = '@animaelumen'
 WHERE key = 'insta_username';

-- Police : le nom correct est "Minionpro", sans espace.
UPDATE site_content SET font_family = 'Minionpro'
WHERE font_family IS DISTINCT FROM 'Minionpro'
  AND font_family ILIKE 'minion pro';

-- Suppression definitive de la section "Les outils de l'invisible" sur la
-- page A propos (La Lumiere Pure / Le Grain Organique / L'Obturateur
-- Silencieux), ainsi que de ses textes et de ses images. Le rendu a ete
-- retire de about/page.tsx : on efface les lignes pour ne pas laisser de
-- contenus orphelins dans l'admin.
DELETE FROM site_content WHERE key IN (
  'signature_tagline',
  'signature_heading',
  'signature_image_0',  'signature_subtitle_0',  'signature_title_0',  'signature_description_0',
  'signature_image_1',  'signature_subtitle_1',  'signature_title_1',  'signature_description_1',
  'signature_image_2',  'signature_subtitle_2',  'signature_title_2',  'signature_description_2'
);

SELECT key, font_family, is_hidden FROM site_content
WHERE font_family ILIKE 'minion pro' OR is_hidden = TRUE;