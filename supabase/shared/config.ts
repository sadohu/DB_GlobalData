import { createClient } from "./supabase.ts";

// Configuración de base de datos
export const supabaseConfig = {
  url: Deno.env.get('SUPABASE_URL') ?? '',
  serviceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  anonKey: Deno.env.get('SUPABASE_ANON_KEY') ?? ''
};

// Configuración de APIs externas
export const externalApiConfig = {
  peruApiToken: Deno.env.get('APIS_PERU_TOKEN') ?? '',
  peruApiBaseUrl: 'https://dniruc.apisperu.com/api/v1',
  dniEndpoint: '/dni/',
  rucEndpoint: '/ruc/'
};

// Configuración de CORS
export const corsConfig = {
  allowedOrigins: ['*'], // En producción, especificar dominios exactos
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'apikey']
};

// IDs del sistema para auditoría
export const systemConfig = {
  systemUserId: '00000000-0000-0000-0000-000000000000',
  adminUserId: '11111111-1111-1111-1111-111111111111'
};

// Utilitarios de tiempo
export const timeUtils = {
  getCurrentTimestamp: (): string => new Date().toISOString(),
  getCurrentDate: (): string => new Date().toISOString().split('T')[0],
  addDays: (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }
};

// Crear cliente Supabase
export const createSupabaseClient = () => {
  return createClient(
    supabaseConfig.url,
    supabaseConfig.serviceRoleKey
  );
};

// Validar configuración requerida
export function validateConfig(): void {
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missing = requiredVars.filter(varName => !Deno.env.get(varName));

  if (missing.length > 0) {
    throw new Error(`Variables de entorno faltantes: ${missing.join(', ')}`);
  }

  console.log('✅ Configuración validada correctamente');
}
