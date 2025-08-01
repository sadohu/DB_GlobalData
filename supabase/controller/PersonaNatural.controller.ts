import { PersonaNaturalService } from "../services/PersonaNatural.service.ts";
import { handleSuccess, handleError } from "../utils/ResponseHandler.ts";
import { Validator, ValidationError } from "../utils/Validator.ts";

export class PersonaNaturalController {
    constructor(private service: PersonaNaturalService) {}

    async handleGetByDNI(req: Request): Promise<Response> {
        try {
            const url = new URL(req.url);
            const dni = url.searchParams.get("dni");

            // Validar DNI
            if (!dni) {
                return handleError("DNI no proporcionado", 400, "MISSING_DNI");
            }

            Validator.validateDNI(dni);

            const persona = await this.service.findOrFetchPersonaNatural(dni);
            
            if (!persona) {
                return handleError("No se encontró la persona natural", 404, "NOT_FOUND");
            }

            return handleSuccess(persona, 200);
        } catch (error) {
            console.error("Error en controller handleGetByDNI:", error);
            
            if (error instanceof ValidationError) {
                return handleError(error.message, 400, "VALIDATION_ERROR");
            }
            
            return handleError("Error interno del servidor", 500, "INTERNAL_ERROR");
        }
    }

    async handleCreate(req: Request): Promise<Response> {
        try {
            const data = await req.json();
            
            // Validaciones básicas
            Validator.validateRequired(data.numero_documento, "numero_documento");
            Validator.validateRequired(data.nombres, "nombres");
            Validator.validateRequired(data.apellido_paterno, "apellido_paterno");
            Validator.validateRequired(data.apellido_materno, "apellido_materno");
            
            Validator.validateDNI(data.numero_documento);

            const persona = await this.service.createPersonaNatural(data);
            return handleSuccess(persona, 201);
        } catch (error) {
            console.error("Error en controller handleCreate:", error);
            
            if (error instanceof ValidationError) {
                return handleError(error.message, 400, "VALIDATION_ERROR");
            }
            
            return handleError("Error interno del servidor", 500, "INTERNAL_ERROR");
        }
    }

    async handleUpdate(req: Request): Promise<Response> {
        try {
            const url = new URL(req.url);
            const id = url.searchParams.get("id");
            
            if (!id || isNaN(Number(id))) {
                return handleError("ID inválido", 400, "INVALID_ID");
            }

            const updates = await req.json();
            const persona = await this.service.updatePersonaNatural(Number(id), updates);
            
            return handleSuccess(persona, 200);
        } catch (error) {
            console.error("Error en controller handleUpdate:", error);
            
            if (error instanceof ValidationError) {
                return handleError(error.message, 400, "VALIDATION_ERROR");
            }
            
            return handleError("Error interno del servidor", 500, "INTERNAL_ERROR");
        }
    }

    async handleDelete(req: Request): Promise<Response> {
        try {
            const url = new URL(req.url);
            const id = url.searchParams.get("id");
            
            if (!id || isNaN(Number(id))) {
                return handleError("ID inválido", 400, "INVALID_ID");
            }

            await this.service.deletePersonaNatural(Number(id));
            return handleSuccess({ message: "Persona eliminada correctamente" }, 200);
        } catch (error) {
            console.error("Error en controller handleDelete:", error);
            return handleError("Error interno del servidor", 500, "INTERNAL_ERROR");
        }
    }

    async handleGetAll(req: Request): Promise<Response> {
        try {
            const url = new URL(req.url);
            const limit = Number(url.searchParams.get("limit")) || 50;
            const offset = Number(url.searchParams.get("offset")) || 0;

            const result = await this.service.getAllPersonasNaturales(limit, offset);
            return handleSuccess(result, 200);
        } catch (error) {
            console.error("Error en controller handleGetAll:", error);
            return handleError("Error interno del servidor", 500, "INTERNAL_ERROR");
        }
    }
}
