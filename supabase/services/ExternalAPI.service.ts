// ExternalAPI.service.ts - Servicio de API externa simplificado
import type { PersonaNatural } from "../models/PersonaNatural.model.ts";
import { externalApiConfig } from "../shared/config.ts";

// Interfaz para la respuesta de la API de Perú
interface PeruApiResponse {
    success: boolean;
    dni: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    codVerifica?: string;
}

export class ExternalAPIService {
    private peruApiToken: string;
    private baseUrl: string;

    constructor() {
        this.peruApiToken = externalApiConfig.peruApiToken;
        this.baseUrl = externalApiConfig.peruApiBaseUrl;

        if (!this.peruApiToken) {
            console.warn('⚠️ APIS_PERU_TOKEN no está configurado');
        }
    }

    /**
     * Consultar datos de persona en API externa de Perú
     */
    async fetchFromPeruAPI(dni: string): Promise<PersonaNatural | null> {
        try {
            if (!this.peruApiToken) {
                console.error('❌ Token de API Perú no configurado');
                return null;
            }

            console.log(`🌐 Consultando API Perú para DNI: ${dni}`);

            const url = `${this.baseUrl}/dni/${dni}?token=${this.peruApiToken}`;
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`❌ Error HTTP en API Perú: ${response.status} ${response.statusText}`);
                return null;
            }

            const json: PeruApiResponse = await response.json();

            if (!json || json.success === false) {
                console.log(`ℹ️ API Perú no encontró datos para DNI: ${dni}`);
                return null;
            }

            // Mapear datos de la API externa al modelo PersonaNatural
            const personaNatural: PersonaNatural = {
                numero_documento: json.dni,
                nombres: json.nombres,
                apellido_paterno: json.apellidoPaterno,
                apellido_materno: json.apellidoMaterno,
                tipo_documento: 'DNI',
                nacionalidad: 'Peruana'
            };

            console.log(`✅ Datos obtenidos de API Perú para DNI: ${dni}`);
            return personaNatural;

        } catch (error) {
            console.error(`❌ Error consultando API Perú para DNI ${dni}:`, error);
            return null;
        }
    }

    /**
     * Validar si un DNI existe en API externa
     */
    async validateDNI(dni: string): Promise<boolean> {
        try {
            const persona = await this.fetchFromPeruAPI(dni);
            const isValid = persona !== null;

            console.log(`🔍 DNI ${dni} ${isValid ? 'es válido' : 'no es válido'} según API Perú`);
            return isValid;

        } catch (error) {
            console.error(`❌ Error validando DNI ${dni}:`, error);
            return false;
        }
    }

    /**
     * Verificar si el servicio está disponible
     */
    async isServiceAvailable(): Promise<boolean> {
        try {
            if (!this.peruApiToken) {
                return false;
            }

            // Hacer una consulta simple para verificar conectividad
            const response = await fetch(`${this.baseUrl}/dni/12345678?token=${this.peruApiToken}`);

            // Si no hay error de autenticación (401), el servicio está disponible
            return response.status !== 401;

        } catch (error) {
            console.error('❌ Error verificando disponibilidad de API Perú:', error);
            return false;
        }
    }
}
