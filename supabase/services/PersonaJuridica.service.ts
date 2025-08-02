// PersonaJuridica.service.ts - Lógica de negocio para PersonaJuridica
import { PersonaJuridicaRepository } from "../repository/PersonaJuridica.repository.ts";
import { ExternalAPIService } from "./ExternalAPI.service.ts";
import { Validator, ValidationError } from "../utils/Validator.ts";
import type { PersonaJuridica } from "../models/PersonaJuridica.model.ts";

export class PersonaJuridicaService {
    private repository: PersonaJuridicaRepository;
    private externalAPI: ExternalAPIService;

    constructor() {
        this.repository = new PersonaJuridicaRepository();
        this.externalAPI = new ExternalAPIService();
    }

    // Obtener PersonaJuridica por RUC (local o API externa)
    async getPersonaByRUC(ruc: string): Promise<{ data: PersonaJuridica | null; error?: string; code?: string }> {
        try {
            // Validar RUC (lanza ValidationError si es inválido)
            Validator.validateRUC(ruc);

            console.log(`🔍 Buscando PersonaJuridica con RUC: ${ruc}`);

            // Buscar primero en base de datos local
            let persona = await this.repository.findByRUC(ruc);

            if (persona) {
                console.log(`✅ PersonaJuridica encontrada en BD local: ${persona.razon_social}`);
                return { data: persona };
            }

            // Si no existe localmente, consultar API externa
            console.log(`🌐 Consultando API externa para RUC: ${ruc}`);
            persona = await this.externalAPI.fetchRUCFromPeruAPI(ruc);

            if (persona) {
                // Guardar en base de datos local para futuras consultas
                console.log(`💾 Guardando PersonaJuridica en BD local: ${persona.razon_social}`);
                persona = await this.repository.save(persona);
                return { data: persona };
            }

            return { data: null };

        } catch (error) {
            console.error(`❌ Error obteniendo PersonaJuridica por RUC ${ruc}:`, error);
            
            // Manejo específico para errores de validación
            if (error instanceof ValidationError) {
                return {
                    data: null,
                    error: error.message,
                    code: 'VALIDATION_ERROR'
                };
            }
            
            // Otros errores internos
            return {
                data: null,
                error: error instanceof Error ? error.message : 'Error interno del servidor',
                code: 'INTERNAL_ERROR'
            };
        }
    }

    // Crear nueva PersonaJuridica
    async createPersona(data: any): Promise<PersonaJuridica> {
        try {
            console.log(`➕ Creando nueva PersonaJuridica: ${data.razon_social}`);

            // Validar datos requeridos
            this.validatePersonaJuridicaData(data);

            // Verificar que no exista ya una persona con el mismo RUC
            if (data.numero_documento) {
                const existing = await this.repository.findByRUC(data.numero_documento);
                if (existing) {
                    throw new Error(`Ya existe una persona jurídica con RUC: ${data.numero_documento}`);
                }
            }

            const persona = await this.repository.save(data);
            console.log(`✅ PersonaJuridica creada exitosamente: ${persona.razon_social}`);
            return persona;

        } catch (error) {
            console.error('❌ Error creando PersonaJuridica:', error);
            throw error;
        }
    }

    // Actualizar PersonaJuridica
    async updatePersona(id: number, updates: Partial<PersonaJuridica>): Promise<PersonaJuridica> {
        try {
            console.log(`📝 Actualizando PersonaJuridica ID: ${id}`);

            // Validar datos si se proporcionan
            if (updates.numero_documento && !Validator.isValidRUC(updates.numero_documento)) {
                throw new Error('RUC inválido en actualización');
            }

            if (updates.correo && !Validator.isValidEmail(updates.correo)) {
                throw new Error('Email inválido en actualización');
            }

            const persona = await this.repository.update(id, updates);
            console.log(`✅ PersonaJuridica ${id} actualizada exitosamente`);
            return persona;

        } catch (error) {
            console.error(`❌ Error actualizando PersonaJuridica ${id}:`, error);
            throw error;
        }
    }

    // Eliminar PersonaJuridica
    async deletePersona(id: number): Promise<void> {
        try {
            console.log(`🗑️ Eliminando PersonaJuridica ID: ${id}`);
            await this.repository.delete(id);
            console.log(`✅ PersonaJuridica ${id} eliminada exitosamente`);

        } catch (error) {
            console.error(`❌ Error eliminando PersonaJuridica ${id}:`, error);
            throw error;
        }
    }

    // Obtener todas las PersonasJuridicas
    async getAllPersonas(limit: number = 50, offset: number = 0): Promise<PersonaJuridica[]> {
        try {
            console.log(`📋 Obteniendo todas las PersonasJuridicas (${limit} elementos, offset ${offset})`);
            const personas = await this.repository.findAll(limit, offset);
            console.log(`✅ ${personas.length} PersonasJuridicas obtenidas`);
            return personas;

        } catch (error) {
            console.error('❌ Error obteniendo todas las PersonasJuridicas:', error);
            throw error;
        }
    }

    // Buscar PersonasJuridicas por razón social
    async searchPersonasByRazonSocial(searchTerm: string, limit: number = 20): Promise<PersonaJuridica[]> {
        try {
            console.log(`🔍 Buscando PersonasJuridicas por razón social: "${searchTerm}"`);
            
            if (!searchTerm || searchTerm.trim().length < 2) {
                throw new Error('El término de búsqueda debe tener al menos 2 caracteres');
            }

            const personas = await this.repository.findByRazonSocial(searchTerm.trim(), limit);
            console.log(`✅ ${personas.length} PersonasJuridicas encontradas`);
            return personas;

        } catch (error) {
            console.error('❌ Error buscando PersonasJuridicas por razón social:', error);
            throw error;
        }
    }

    // Validar datos de PersonaJuridica
    private validatePersonaJuridicaData(data: any): void {
        const requiredFields = ['razon_social'];

        for (const field of requiredFields) {
            if (!data[field] || data[field].toString().trim() === '') {
                throw new Error(`El campo '${field}' es requerido`);
            }
        }

        // Validaciones opcionales pero estrictas si se proporcionan
        if (data.numero_documento && !Validator.isValidRUC(data.numero_documento)) {
            throw new Error('El RUC debe tener 11 dígitos numéricos');
        }

        if (data.correo && !Validator.isValidEmail(data.correo)) {
            throw new Error('El formato del email es inválido');
        }

        if (data.telefono && !Validator.isValidPhone(data.telefono)) {
            throw new Error('El formato del teléfono es inválido');
        }
    }
}
