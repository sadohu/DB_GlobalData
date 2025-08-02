// supabase.ts - Cliente Supabase para Edge Functions
import { createClient as createSupabaseClient } from "jsr:@supabase/supabase-js@2";

// Re-exportar la función createClient para uso en config.ts
export function createClient(url: string, key: string, options?: any): any {
  return createSupabaseClient(url, key, options);
}

// Tipos para compatibilidad
export type SupabaseClient = any;
export interface CreateClientOptions {
  auth?: any;
  global?: any;
}
