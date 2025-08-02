// PersonaJuridica.repository.ts - Repositorio de datos para PersonaJuridica
import { Database } from "../utils/Database.ts";
import type { PersonaJuridica } from "../models/PersonaJuridica.model.ts";

export class PersonaJuridicaRepository {
    private supabase: any;

    constructor() {
        this.supabase = Database.getClient();
    }

    // Buscar por RUC
    async findByRUC(ruc: string): Promise<PersonaJuridica | null> {
        try {
            console.log(`🔍 Buscando PersonaJuridica con RUC: ${ruc}`);

            const { data, error } = await this.supabase
                .from('persona_juridica')
                .select('*')
                .eq('numero_documento', ruc)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = not found
                console.error(`❌ Error buscando PersonaJuridica por RUC ${ruc}:`, error);
                throw new Error(`Error consultando persona jurídica: ${error.message}`);
            }

            if (!data) {
                console.log(`ℹ️ PersonaJuridica con RUC ${ruc} no encontrada`);
                return null;
            }

            console.log(`✅ PersonaJuridica encontrada: ${data.razon_social}`);
            return data as PersonaJuridica;

        } catch (error) {
            console.error(`❌ Error en findByRUC para ${ruc}:`, error);
            throw error;
        }
    }

    // Guardar nueva PersonaJuridica
    async save(personaJuridica: Omit<PersonaJuridica, 'id'>): Promise<PersonaJuridica> {
        try {
            console.log(`💾 Guardando PersonaJuridica: ${personaJuridica.razon_social}`);

            const dataToSave = {
                ...personaJuridica,
                fecha_creacion: Database.getCurrentTimestamp(),
                creado_por: Database.getSystemUserId()
            };

            const { data, error } = await this.supabase
                .from('persona_juridica')
                .insert([dataToSave])
                .select()
                .single();

            if (error) {
                console.error('❌ Error guardando PersonaJuridica:', error);
                throw new Error(`Error guardando persona jurídica: ${error.message}`);
            }

            console.log(`✅ PersonaJuridica guardada con ID: ${data.id}`);
            return data as PersonaJuridica;

        } catch (error) {
            console.error('❌ Error en save PersonaJuridica:', error);
            throw error;
        }
    }

    // Actualizar PersonaJuridica
    async update(id: number, updates: Partial<PersonaJuridica>): Promise<PersonaJuridica> {
        try {
            console.log(`📝 Actualizando PersonaJuridica ID: ${id}`);

            const dataToUpdate = {
                ...updates,
                fecha_actualizacion: Database.getCurrentTimestamp(),
                actualizado_por: Database.getSystemUserId()
            };

            const { data, error } = await this.supabase
                .from('persona_juridica')
                .update(dataToUpdate)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error(`❌ Error actualizando PersonaJuridica ${id}:`, error);
                throw new Error(`Error actualizando persona jurídica: ${error.message}`);
            }

            if (!data) {
                throw new Error('PersonaJuridica no encontrada para actualizar');
            }

            console.log(`✅ PersonaJuridica ${id} actualizada`);
            return data as PersonaJuridica;

        } catch (error) {
            console.error(`❌ Error en update PersonaJuridica ${id}:`, error);
            throw error;
        }
    }

    // Eliminar PersonaJuridica
    async delete(id: number): Promise<void> {
        try {
            console.log(`🗑️ Eliminando PersonaJuridica ID: ${id}`);

            const { error } = await this.supabase
                .from('persona_juridica')
                .delete()
                .eq('id', id);

            if (error) {
                console.error(`❌ Error eliminando PersonaJuridica ${id}:`, error);
                throw new Error(`Error eliminando persona jurídica: ${error.message}`);
            }

            console.log(`✅ PersonaJuridica ${id} eliminada`);

        } catch (error) {
            console.error(`❌ Error en delete PersonaJuridica ${id}:`, error);
            throw error;
        }
    }

    // Obtener todas las PersonasJuridicas con paginación
    async findAll(limit: number = 50, offset: number = 0): Promise<PersonaJuridica[]> {
        try {
            console.log(`📋 Obteniendo PersonasJuridicas (limit: ${limit}, offset: ${offset})`);

            const { data, error } = await this.supabase
                .from('persona_juridica')
                .select('*')
                .order('fecha_creacion', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) {
                console.error('❌ Error obteniendo PersonasJuridicas:', error);
                throw new Error(`Error consultando personas jurídicas: ${error.message}`);
            }

            console.log(`✅ ${data?.length || 0} PersonasJuridicas obtenidas`);
            return data as PersonaJuridica[] || [];

        } catch (error) {
            console.error('❌ Error en findAll PersonasJuridicas:', error);
            throw error;
        }
    }

    // Buscar por razón social
    async findByRazonSocial(searchTerm: string, limit: number = 20): Promise<PersonaJuridica[]> {
        try {
            console.log(`🔍 Buscando PersonasJuridicas por razón social: "${searchTerm}"`);

            const { data, error } = await this.supabase
                .from('persona_juridica')
                .select('*')
                .ilike('razon_social', `%${searchTerm}%`)
                .order('razon_social', { ascending: true })
                .limit(limit);

            if (error) {
                console.error('❌ Error buscando por razón social:', error);
                throw new Error(`Error buscando personas jurídicas: ${error.message}`);
            }

            console.log(`✅ ${data?.length || 0} PersonasJuridicas encontradas`);
            return data as PersonaJuridica[] || [];

        } catch (error) {
            console.error('❌ Error en findByRazonSocial:', error);
            throw error;
        }
    }
}
