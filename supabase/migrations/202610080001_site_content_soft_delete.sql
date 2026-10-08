-- Soft-delete site text zones from the admin without losing their content.
-- Deleted entries are kept for one-click restoration and are not rendered publicly.
ALTER TABLE public.site_content
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
