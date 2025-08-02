// ExternalAPI.service.ts - Servicio de API externa simplificado
import type { PersonaNatural } from "../models/PersonaNatural.model.ts";
import type { PersonaJuridica } from "../models/PersonaJuridica.model.ts";
import { externalApiConfig } from "../shared/config.ts";

// Interfaz para la respuesta de la API de Perú - DNI
interface PeruApiDniResponse {
    success: boolean;
    dni: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    codVerifica?: string;
}

// Interfaz para la respuesta de la API de Perú - RUC
interface PeruApiRucResponse {
    ruc: string;
    razonSocial: string;
    nombreComercial?: string | null;
    telefonos: string[];
    tipo?: string | null;
    estado: string;
    condicion: string;
    direccion: string;
    departamento: string;
    provincia: string;
    distrito: string;
    fechaInscripcion?: string | null;
    sistEmsion?: string | null;
    sistContabilidad?: string | null;
    actExterior?: string | null;
    actEconomicas: any[];
    cpPago: any[];
    sistElectronica: any[];
    fechaEmisorFe?: string | null;
    cpeElectronico: any[];
    fechaPle?: string | null;
    padrones: any[];
    fechaBaja?: string | null;
    profesion?: string | null;
    ubigeo: string;
    capital: string;
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

            const json: PeruApiDniResponse = await response.json();

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
     * Consultar datos de empresa por RUC en API externa de Perú
     */
    async fetchRUCFromPeruAPI(ruc: string): Promise<PersonaJuridica | null> {
        try {
            if (!this.peruApiToken) {
                console.error('❌ Token de API Perú no configurado');
                return null;
            }

            console.log(`🌐 Consultando API Perú para RUC: ${ruc}`);

            const url = `${this.baseUrl}${externalApiConfig.rucEndpoint}${ruc}?token=${this.peruApiToken}`;
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`❌ Error HTTP en API Perú: ${response.status} ${response.statusText}`);
                return null;
            }

            const json: PeruApiRucResponse = await response.json();

            if (!json || !json.ruc) {
                console.log(`ℹ️ API Perú no encontró datos para RUC: ${ruc}`);
                return null;
            }

            // Mapear datos de la API externa al modelo PersonaJuridica
            const personaJuridica: PersonaJuridica = {
                numero_documento: json.ruc,
                razon_social: json.razonSocial,
                nombre_comercial: json.nombreComercial || undefined,
                tipo_documento: 'RUC',
                tipo_empresa: json.tipo || undefined,
                fecha_constitucion: json.fechaInscripcion ? new Date(json.fechaInscripcion) : undefined,
                actividad_economica: json.actEconomicas && json.actEconomicas.length > 0 
                    ? json.actEconomicas.map((act: any) => act.nombre || act.descripcion).join(', ')
                    : undefined,
                representante_legal: undefined, // No viene en la API
                direccion_fiscal: json.direccion || undefined,
                ubigeo: json.ubigeo || undefined,
                telefono: json.telefonos && json.telefonos.length > 0 ? json.telefonos[0] : undefined,
                estado_legal: json.estado || 'ACTIVO'
            };

            console.log(`✅ Datos obtenidos de API Perú para RUC: ${ruc}`);
            return personaJuridica;

        } catch (error) {
            console.error(`❌ Error consultando API Perú para RUC ${ruc}:`, error);
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
     * Validar si un RUC existe en API externa
     */
    async validateRUC(ruc: string): Promise<boolean> {
        try {
            const empresa = await this.fetchRUCFromPeruAPI(ruc);
            const isValid = empresa !== null;

            console.log(`🔍 RUC ${ruc} ${isValid ? 'es válido' : 'no es válido'} según API Perú`);
            return isValid;

        } catch (error) {
            console.error(`❌ Error validando RUC ${ruc}:`, error);
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
