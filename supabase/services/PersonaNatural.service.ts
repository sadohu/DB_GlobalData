// PersonaNatural.service.ts - Lógica de negocio simplificada
import type { PersonaNatural } from "../models/PersonaNatural.model.ts";
import { PersonaNaturalRepository } from "../repository/PersonaNatural.repository.ts";
import { ExternalAPIService } from "./ExternalAPI.service.ts";
import { ValidationError, Validator } from "../utils/Validator.ts";

export class PersonaNaturalService {
    private repository: PersonaNaturalRepository;
    private externalService: ExternalAPIService;

    constructor() {
        this.repository = new PersonaNaturalRepository();
        this.externalService = new ExternalAPIService();
    }

    /**
     * Buscar persona por DNI. Si no existe localmente, consulta API externa.
     */
    async getPersonaByDNI(dni: string): Promise<PersonaNatural | null> {
        try {
            // Validar DNI
            Validator.validateDNI(dni);

            // 1. Buscar primero en la base de datos local
            console.log(`🔍 Buscando DNI ${dni} en base de datos...`);
            const existingPersona = await this.repository.findByDNI(dni);

            if (existingPersona) {
                console.log(`✅ Persona encontrada en BD: ${dni}`);
                return existingPersona;
            }

            // 2. Si no existe, buscar en API externa
            console.log(`🌐 Consultando API externa para DNI: ${dni}`);
            const externalData = await this.externalService.fetchFromPeruAPI(dni);

            if (!externalData) {
                console.log(`❌ No se encontró información para DNI: ${dni}`);
                return null;
            }

            // 3. Guardar en base de datos de forma asíncrona (no bloquear respuesta)
            this.repository.save(externalData)
                .then(() => console.log(`💾 Persona guardada exitosamente: ${dni}`))
                .catch(error => console.error(`⚠️ Error guardando ${dni}:`, error));

            console.log(`✅ Datos obtenidos de API externa para: ${dni}`);
            return externalData;

        } catch (error) {
            console.error(`❌ Error en getPersonaByDNI para ${dni}:`, error);

            if (error instanceof ValidationError) {
                throw error;
            }

            throw new Error(`Error al consultar persona: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Crear nueva persona
     */
    async createPersona(data: any): Promise<PersonaNatural> {
        try {
            // Validar datos requeridos
            Validator.validateRequired(data.numero_documento, "numero_documento");
            Validator.validateRequired(data.nombres, "nombres");
            Validator.validateRequired(data.apellido_paterno, "apellido_paterno");
            Validator.validateRequired(data.apellido_materno, "apellido_materno");
            Validator.validateDNI(data.numero_documento);

            // Validar datos opcionales
            if (data.correo) Validator.validateEmail(data.correo);
            if (data.telefono) Validator.validatePhone(data.telefono);

            // Verificar si ya existe
            const existing = await this.repository.findByDNI(data.numero_documento);
            if (existing) {
                throw new ValidationError(`Ya existe una persona con DNI: ${data.numero_documento}`);
            }

            console.log(`📝 Creando nueva persona: ${data.numero_documento}`);
            const nuevaPersona = await this.repository.save(data);
            console.log(`✅ Persona creada exitosamente: ${data.numero_documento}`);

            return nuevaPersona;

        } catch (error) {
            console.error('❌ Error creando persona:', error);

            if (error instanceof ValidationError) {
                throw error;
            }

            throw new Error(`Error al crear persona: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Actualizar persona existente
     */
    async updatePersona(id: number, updates: Partial<PersonaNatural>): Promise<PersonaNatural> {
        try {
            // Validar ID
            if (!id || isNaN(id)) {
                throw new ValidationError("ID inválido");
            }

            // Validar datos si se proporcionan
            if (updates.numero_documento) {
                Validator.validateDNI(updates.numero_documento);
            }
            if (updates.correo) {
                Validator.validateEmail(updates.correo);
            }
            if (updates.telefono) {
                Validator.validatePhone(updates.telefono);
            }

            console.log(`📝 Actualizando persona ID: ${id}`);
            const personaActualizada = await this.repository.update(id, updates);
            console.log(`✅ Persona actualizada exitosamente ID: ${id}`);

            return personaActualizada;

        } catch (error) {
            console.error(`❌ Error actualizando persona ID ${id}:`, error);

            if (error instanceof ValidationError) {
                throw error;
            }

            throw new Error(`Error al actualizar persona: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Eliminar persona
     */
    async deletePersona(id: number): Promise<void> {
        try {
            if (!id || isNaN(id)) {
                throw new ValidationError("ID inválido");
            }

            console.log(`🗑️ Eliminando persona ID: ${id}`);
            await this.repository.delete(id);
            console.log(`✅ Persona eliminada exitosamente ID: ${id}`);

        } catch (error) {
            console.error(`❌ Error eliminando persona ID ${id}:`, error);

            if (error instanceof ValidationError) {
                throw error;
            }

            throw new Error(`Error al eliminar persona: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Obtener todas las personas con paginación
     */
    async getAllPersonas(limit: number = 50, offset: number = 0) {
        try {
            console.log(`📋 Obteniendo personas (limit: ${limit}, offset: ${offset})`);
            const result = await this.repository.findAll(limit, offset);
            console.log(`✅ Se obtuvieron ${result.data.length} personas de ${result.count} total`);

            return result;

        } catch (error) {
            console.error('❌ Error obteniendo todas las personas:', error);
            throw new Error(`Error al obtener personas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Buscar personas por nombre
     */
    async searchPersonasByName(searchTerm: string, limit: number = 20): Promise<PersonaNatural[]> {
        try {
            Validator.validateRequired(searchTerm, "término de búsqueda");

            console.log(`🔍 Buscando personas por nombre: "${searchTerm}"`);
            const personas = await this.repository.findByName(searchTerm, limit);
            console.log(`✅ Se encontraron ${personas.length} personas`);

            return personas;

        } catch (error) {
            console.error('❌ Error buscando personas por nombre:', error);

            if (error instanceof ValidationError) {
                throw error;
            }

            throw new Error(`Error al buscar personas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }
}
