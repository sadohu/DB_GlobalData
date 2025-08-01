import type { PersonaNatural } from "../models/PersonaNatural.model.ts";
import { PersonaNaturalRepository } from "../repository/PersonaNatural.repository.ts";
import { ExternalAPIService } from "./ExternalAPI.service.ts";
import { ValidationError } from "../utils/Validator.ts";

export class PersonaNaturalService {
    constructor(
        private repository: PersonaNaturalRepository,
        private externalService: ExternalAPIService
    ) {}

    /**
     * Find or fetch a natural person by DNI.
     * @param dni DNI of the person to find or fetch
     * @returns The found or fetched PersonaNatural object, or null if not found
     * @throws Error if there is an error querying database or external API
     * @description If the person is not found in the database, it fetches data from external API and saves it.
     */
    async findOrFetchPersonaNatural(dni: string): Promise<PersonaNatural | null> {
        try {
            // Primero buscar en la base de datos
            const existingPersona = await this.repository.findByDNI(dni);
            
            if (existingPersona) {
                console.log(`Found existing persona for DNI: ${dni}`);
                return existingPersona;
            }

            // Si no existe, buscar en API externa
            console.log(`Fetching from external API for DNI: ${dni}`);
            const externalData = await this.externalService.fetchFromPeruAPI(dni);
            
            if (!externalData) {
                console.log(`No data found for DNI: ${dni}`);
                return null;
            }

            // Guardar en base de datos de forma asíncrona
            this.repository.save(externalData)
                .then(() => console.log(`Successfully saved persona with DNI: ${dni}`))
                .catch(error => console.error(`Error saving persona with DNI ${dni}:`, error));

            return externalData;
        } catch (error) {
            console.error(`Error in findOrFetchPersonaNatural for DNI ${dni}:`, error);
            
            if (error instanceof ValidationError) {
                throw error;
            }
            
            throw new Error(`Error al consultar persona natural: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async createPersonaNatural(data: PersonaNatural): Promise<PersonaNatural> {
        try {
            // Validar datos requeridos
            if (!data.numero_documento || !data.nombres || !data.apellido_paterno || !data.apellido_materno) {
                throw new ValidationError('Datos requeridos faltantes');
            }

            // Verificar si ya existe
            const existing = await this.repository.findByDNI(data.numero_documento);
            if (existing) {
                throw new ValidationError(`Ya existe una persona con DNI: ${data.numero_documento}`);
            }

            return await this.repository.save(data);
        } catch (error) {
            console.error('Error creating PersonaNatural:', error);
            
            if (error instanceof ValidationError) {
                throw error;
            }
            
            throw new Error(`Error al crear persona natural: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async updatePersonaNatural(id: number, updates: Partial<PersonaNatural>): Promise<PersonaNatural> {
        try {
            return await this.repository.update(id, updates);
        } catch (error) {
            console.error(`Error updating PersonaNatural with ID ${id}:`, error);
            throw new Error(`Error al actualizar persona natural: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async deletePersonaNatural(id: number): Promise<void> {
        try {
            await this.repository.delete(id);
        } catch (error) {
            console.error(`Error deleting PersonaNatural with ID ${id}:`, error);
            throw new Error(`Error al eliminar persona natural: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getAllPersonasNaturales(limit: number = 50, offset: number = 0) {
        try {
            return await this.repository.findAll(limit, offset);
        } catch (error) {
            console.error('Error getting all PersonasNaturales:', error);
            throw new Error(`Error al obtener personas naturales: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
