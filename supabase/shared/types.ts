// Tipos de respuesta estándar para las APIs
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  success: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Tipos para configuración
export interface DatabaseConfig {
  url: string;
  serviceRoleKey: string;
  anonKey: string;
}

export interface ExternalApiConfig {
  peruApiToken: string;
  peruApiBaseUrl: string;
}

// Tipos para la respuesta de la API externa de Perú
export interface PeruApiResponse {
  success: boolean;
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  codVerifica?: string;
}
