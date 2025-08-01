// Tipos simulados para desarrollo - Deno los reemplazará en producción
export interface SupabaseClient {
  from(table: string): any;
  auth: any;
  storage: any;
}

export interface CreateClientOptions {
  auth?: any;
  global?: any;
}

// Función simulada para desarrollo
export function createClient(url: string, key: string, options?: CreateClientOptions): SupabaseClient {
  // Esta función será reemplazada por la real de JSR en runtime de Deno
  throw new Error('Esta función debe ejecutarse en entorno Deno');
}
