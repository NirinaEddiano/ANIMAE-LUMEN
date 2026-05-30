import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Les clés d'accès Supabase sont manquantes dans votre fichier .env.local");
}

// Initialisation du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);