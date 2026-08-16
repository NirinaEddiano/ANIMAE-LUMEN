-- ============================================================
-- ANIMAE LUMEN — Police par défaut : Minion Pro
-- ============================================================

-- 0. Ajoute la colonne is_stamped manquante (utilisée par l'admin et l'effet gravure)
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS is_stamped BOOLEAN NOT NULL DEFAULT FALSE;

-- 1. Change la valeur par défaut de la colonne font_family
ALTER TABLE site_content ALTER COLUMN font_family SET DEFAULT 'Minion Pro';

-- 2. Remplace la police de TOUTES les lignes existantes par Minion Pro
--    (la taille affichée reste inchangée)
UPDATE site_content SET font_family = 'Minion Pro' WHERE font_family IS DISTINCT FROM 'Minion Pro';
