-- Force toutes les polices dynamiques du site en Minion Pro (police unique par défaut)
UPDATE site_content
SET font_family = 'Minion Pro'
WHERE font_family IS NULL OR font_family != 'Minion Pro';

-- Nouveaux éléments : défaut Minion Pro
ALTER TABLE site_content
ALTER COLUMN font_family SET DEFAULT 'Minion Pro';
