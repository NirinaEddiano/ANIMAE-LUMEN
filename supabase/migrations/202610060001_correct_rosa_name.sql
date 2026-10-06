-- Corrige le nom « Roase » dans tous les contenus éditables déjà enregistrés.
-- Les pages lisent ces valeurs depuis Supabase, donc la correction doit
-- s'appliquer aux tables de contenu et de portfolios.

UPDATE site_content
SET value_fr = regexp_replace(value_fr, 'roase', 'Rosae', 'gi'),
    value_en = regexp_replace(value_en, 'roase', 'Rosae', 'gi')
WHERE value_fr ~* 'roase' OR value_en ~* 'roase';

UPDATE portfolios
SET title_fr = regexp_replace(title_fr, 'roase', 'Rosae', 'gi'),
    title_en = regexp_replace(title_en, 'roase', 'Rosae', 'gi'),
    description_fr = regexp_replace(description_fr, 'roase', 'Rosae', 'gi'),
    description_en = regexp_replace(description_en, 'roase', 'Rosae', 'gi')
WHERE title_fr ~* 'roase'
   OR title_en ~* 'roase'
   OR description_fr ~* 'roase'
   OR description_en ~* 'roase';
