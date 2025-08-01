import type { SupabaseClient } from "../shared/supabase.ts";
import type { PersonaNatural, CreatePersonaNaturalDto } from "../models/PersonaNatural.model.ts";

export class PersonaNaturalRepository {
    constructor(private supabase: SupabaseClient) {}

    async findByDNI(dni: string) {
        const { data, error } = await this.supabase
            .from('persona_natural')
            .select('*')
            .eq('numero_documento', dni)
            .maybeSingle();

        if (error) {
            throw new Error(`Error al buscar persona por DNI: ${error.message}`);
        }

        return data as PersonaNatural | null;
    }

    async findById(id: number) {
        const { data, error } = await this.supabase
            .from('persona_natural')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw new Error(`Error al buscar persona por ID: ${error.message}`);
        }

        return data as PersonaNatural;
    }

    async save(persona: CreatePersonaNaturalDto): Promise<PersonaNatural> {
        const now = new Date().toISOString();
        
        // Generar UUID para el sistema o usar uno fijo
        const systemUserId = '00000000-0000-0000-0000-000000000000';
        
        const personaWithTimestamps = {
            ...persona,
            fecha_creacion: now,
            fecha_actualizacion: now,
            creado_por: systemUserId,
            actualizado_por: systemUserId
        };

        const { data, error } = await this.supabase
            .from('persona_natural')
            .insert(personaWithTimestamps)
            .select()
            .single();

        if (error) {
            throw new Error(`Error al guardar persona: ${error.message}`);
        }

        return data as PersonaNatural;
    }

    async update(id: number, updates: Partial<PersonaNatural>): Promise<PersonaNatural> {
        // Generar UUID para el sistema o usar uno fijo
        const systemUserId = '00000000-0000-0000-0000-000000000000';
        
        const updatesWithTimestamp = {
            ...updates,
            fecha_actualizacion: new Date().toISOString(),
            actualizado_por: systemUserId
        };

        const { data, error } = await this.supabase
            .from('persona_natural')
            .update(updatesWithTimestamp)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(`Error al actualizar persona: ${error.message}`);
        }

        return data as PersonaNatural;
    }

    async delete(id: number): Promise<void> {
        const { error } = await this.supabase
            .from('persona_natural')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Error al eliminar persona: ${error.message}`);
        }
    }

    async findAll(limit: number = 50, offset: number = 0) {
        const { data, error, count } = await this.supabase
            .from('persona_natural')
            .select('*', { count: 'exact' })
            .range(offset, offset + limit - 1)
            .order('fecha_creacion', { ascending: false });

        if (error) {
            throw new Error(`Error al obtener personas: ${error.message}`);
        }

        return { data: data as PersonaNatural[], count: count || 0 };
    }
}