// Database.ts - Conexión centralizada a Supabase
import { createSupabaseClient, systemConfig, timeUtils } from "../shared/config.ts";

export class Database {
    private static instance: any;

    // Crear cliente Supabase singleton
    static getClient() {
        if (!Database.instance) {
            Database.instance = createSupabaseClient();
            console.log('✅ Cliente Supabase inicializado');
        }

        return Database.instance;
    }

    // Generar UUID del sistema para auditoría
    static getSystemUserId(): string {
        return systemConfig.systemUserId;
    }

    // Obtener timestamp actual
    static getCurrentTimestamp(): string {
        return timeUtils.getCurrentTimestamp();
    }
}
