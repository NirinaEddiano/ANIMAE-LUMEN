-- Force toutes les polices dynamiques du site en "Minionpro" (nom sans espace)
-- La nuance : "Minionpro" (nom de famille) vs "Minion Pro" (nom affiché avec espace).

UPDATE site_content
SET font_family = 'Minionpro'
WHERE font_family IS NULL OR font_family != 'Minionpro';

-- Nouveaux éléments : défaut Minionpro
ALTER TABLE site_content
ALTER COLUMN font_family SET DEFAULT 'Minionpro';
