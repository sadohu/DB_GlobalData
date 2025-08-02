// PersonaNatural.repository.ts - Acceso a datos simplificado
import { Database } from "../utils/Database.ts";
import type { PersonaNatural, CreatePersonaNaturalDto } from "../models/PersonaNatural.model.ts";

export class PersonaNaturalRepository {
    private client: any;

    constructor() {
        this.client = Database.getClient();
    }

    // Buscar por DNI
    async findByDNI(dni: string): Promise<PersonaNatural | null> {
        try {
            const { data, error } = await this.client
                .from('persona_natural')
                .select('*')
                .eq('numero_documento', dni)
                .maybeSingle();

            if (error) {
                console.error('Error buscando por DNI:', error);
                throw new Error(`Error al buscar persona: ${error.message}`);
            }

            return data;
        } catch (error) {
            console.error('Error en findByDNI:', error);
            throw error;
        }
    }

    // Buscar por ID
    async findById(id: number): Promise<PersonaNatural | null> {
        try {
            const { data, error } = await this.client
                .from('persona_natural')
                .select('*')
                .eq('id', id)
                .maybeSingle();

            if (error) {
                console.error('Error buscando por ID:', error);
                throw new Error(`Error al buscar persona: ${error.message}`);
            }

            return data;
        } catch (error) {
            console.error('Error en findById:', error);
            throw error;
        }
    }

    // Crear nueva persona
    async save(persona: CreatePersonaNaturalDto): Promise<PersonaNatural> {
        try {
            const personaCompleta = {
                ...persona,
                fecha_creacion: Database.getCurrentTimestamp(),
                fecha_actualizacion: Database.getCurrentTimestamp(),
                creado_por: Database.getSystemUserId(),
                actualizado_por: Database.getSystemUserId()
            };

            const { data, error } = await this.client
                .from('persona_natural')
                .insert(personaCompleta)
                .select()
                .single();

            if (error) {
                console.error('Error creando persona:', error);
                throw new Error(`Error al crear persona: ${error.message}`);
            }

            return data as PersonaNatural;
        } catch (error) {
            console.error('Error en save:', error);
            throw error;
        }
    }

    // Actualizar persona
    async update(id: number, updates: Partial<PersonaNatural>): Promise<PersonaNatural> {
        try {
            const updatesConTimestamp = {
                ...updates,
                fecha_actualizacion: Database.getCurrentTimestamp(),
                actualizado_por: Database.getSystemUserId()
            };

            const { data, error } = await this.client
                .from('persona_natural')
                .update(updatesConTimestamp)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error actualizando persona:', error);
                throw new Error(`Error al actualizar persona: ${error.message}`);
            }

            return data as PersonaNatural;
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    // Eliminar persona
    async delete(id: number): Promise<void> {
        try {
            const { error } = await this.client
                .from('persona_natural')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error eliminando persona:', error);
                throw new Error(`Error al eliminar persona: ${error.message}`);
            }
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }

    // Obtener todas las personas con paginación
    async findAll(limit: number = 50, offset: number = 0) {
        try {
            const { data, error, count } = await this.client
                .from('persona_natural')
                .select('*', { count: 'exact' })
                .range(offset, offset + limit - 1)
                .order('fecha_creacion', { ascending: false });

            if (error) {
                console.error('Error obteniendo personas:', error);
                throw new Error(`Error al obtener personas: ${error.message}`);
            }

            return {
                data: data as PersonaNatural[] || [],
                count: count || 0
            };
        } catch (error) {
            console.error('Error en findAll:', error);
            throw error;
        }
    }

    // Buscar personas por nombre (nuevo método útil)
    async findByName(searchTerm: string, limit: number = 20): Promise<PersonaNatural[]> {
        try {
            const { data, error } = await this.client
                .from('persona_natural')
                .select('*')
                .or(`nombres.ilike.%${searchTerm}%,apellido_paterno.ilike.%${searchTerm}%,apellido_materno.ilike.%${searchTerm}%`)
                .limit(limit)
                .order('fecha_actualizacion', { ascending: false });

            if (error) {
                console.error('Error buscando por nombre:', error);
                throw new Error(`Error al buscar por nombre: ${error.message}`);
            }

            return data as PersonaNatural[] || [];
        } catch (error) {
            console.error('Error en findByName:', error);
            throw error;
        }
    }
}