import type { PersonaNatural } from "../models/PersonaNatural.model.ts";
import type { PeruApiResponse } from "../shared/types.ts";

export class ExternalAPIService {
    constructor(private peruApiToken: string, private baseUrl: string = 'https://dniruc.apisperu.com/api/v1') {}

    async fetchFromPeruAPI(dni: string): Promise<PersonaNatural | null> {
        try {
            const response = await fetch(
                `${this.baseUrl}/dni/${dni}?token=${this.peruApiToken}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json: PeruApiResponse = await response.json();

            if (!json || json.success === false) {
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

            return personaNatural;
        } catch (error) {
            console.error(`Error fetching from Peru API for DNI ${dni}:`, error);
            throw new Error(`Error fetching from Peru API: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async validateDNI(dni: string): Promise<boolean> {
        try {
            const persona = await this.fetchFromPeruAPI(dni);
            return persona !== null;
        } catch (error) {
            console.error(`Error validating DNI ${dni}:`, error);
            return false;
        }
    }
}
