-- ============================================================
-- ANIMAE LUMEN — Activation RLS sur contact_messages
-- ============================================================

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_messages_select_public" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_insert_auth" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_update_auth" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_delete_auth" ON contact_messages;

CREATE POLICY "contact_messages_select_public" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "contact_messages_insert_auth"  ON contact_messages FOR INSERT  TO authenticated WITH CHECK (true);
CREATE POLICY "contact_messages_update_auth"  ON contact_messages FOR UPDATE  TO authenticated USING (true);
CREATE POLICY "contact_messages_delete_auth"  ON contact_messages FOR DELETE  TO authenticated USING (true);
