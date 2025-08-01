import { createClient } from "jsr:@supabase/supabase-js@2";
import { PersonaNaturalRepository } from "../../repository/PersonaNatural.repository.ts";
import { ExternalAPIService } from "../../services/ExternalAPI.service.ts";
import { PersonaNaturalService } from "../../services/PersonaNatural.service.ts";
import { PersonaNaturalController } from "../../controller/PersonaNatural.controller.ts";

interface ServiceConfig {
    supabaseUrl: string;
    supabaseServiceRoleKey: string;
    peruApiToken: string;
    peruApiBaseUrl?: string;
}

export class ServiceFactory {
    private static instance: ServiceFactory;
    private config: ServiceConfig;
    
    private constructor(config: ServiceConfig) {
        this.config = config;
    }

    public static create(config: ServiceConfig): ServiceFactory {
        if (!ServiceFactory.instance) {
            ServiceFactory.instance = new ServiceFactory(config);
        }
        return ServiceFactory.instance;
    }

    public createSupabaseClient() {
        return createClient(
            this.config.supabaseUrl,
            this.config.supabaseServiceRoleKey
        );
    }

    public createPersonaNaturalRepository() {
        const supabase = this.createSupabaseClient();
        return new PersonaNaturalRepository(supabase);
    }

    public createExternalAPIService() {
        return new ExternalAPIService(
            this.config.peruApiToken,
            this.config.peruApiBaseUrl
        );
    }

    public createPersonaNaturalService() {
        const repository = this.createPersonaNaturalRepository();
        const externalService = this.createExternalAPIService();
        return new PersonaNaturalService(repository, externalService);
    }

    public createPersonaNaturalController() {
        const service = this.createPersonaNaturalService();
        return new PersonaNaturalController(service);
    }
}
