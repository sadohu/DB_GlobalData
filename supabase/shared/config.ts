import { createClient } from "./supabase.ts";

export const supabaseConfig = {
  url: Deno.env.get('SUPABASE_URL') ?? '',
  serviceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  anonKey: Deno.env.get('SUPABASE_ANON_KEY') ?? ''
};

export const externalApiConfig = {
  peruApiToken: Deno.env.get('APIS_PERU_TOKEN') ?? '',
  peruApiBaseUrl: 'https://dniruc.apisperu.com/api/v1'
};

export const createSupabaseClient = () => {
  return createClient(
    supabaseConfig.url,
    supabaseConfig.serviceRoleKey
  );
};
