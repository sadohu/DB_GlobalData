// index.ts - Función principal simplificada para PersonaJuridica
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { PersonaJuridicaService } from "../../services/PersonaJuridica.service.ts";
import { ResponseHandler } from "../../utils/ResponseHandler.ts";
import { ValidationError } from "../../utils/Validator.ts";
import { validateConfig } from "../../shared/config.ts";

// Validar configuración al inicio
validateConfig();

console.log("🚀 PersonaJuridica API inicializada");

// Inicializar servicio
const personaJuridicaService = new PersonaJuridicaService();

// Función principal
Deno.serve(async (req) => {
    try {
        // Manejar CORS preflight
        if (req.method === 'OPTIONS') {
            return ResponseHandler.cors();
        }

        const url = new URL(req.url);

        // Enrutar según método HTTP
        switch (req.method) {
            case 'GET':
                return await handleGet(url);
            case 'POST':
                return await handlePost(req);
            case 'PUT':
                return await handlePut(req, url);
            case 'DELETE':
                return await handleDelete(url);
            default:
                return ResponseHandler.error("Método no permitido", 405, "METHOD_NOT_ALLOWED");
        }

    } catch (error) {
        console.error("❌ Error en función principal:", error);

        if (error instanceof ValidationError) {
            return ResponseHandler.error(error.message, 400, "VALIDATION_ERROR");
        }

        return ResponseHandler.error("Error interno del servidor", 500, "INTERNAL_ERROR");
    }
});

// Manejar peticiones GET
async function handleGet(url: URL): Promise<Response> {
    const action = url.searchParams.get('action');

    if (action === 'all') {
        // Obtener todas las empresas
        const limit = Number(url.searchParams.get('limit')) || 50;
        const offset = Number(url.searchParams.get('offset')) || 0;

        const result = await personaJuridicaService.getAllPersonas(limit, offset);
        return ResponseHandler.success(result);

    } else if (action === 'search') {
        // Buscar por razón social
        const searchTerm = url.searchParams.get('q');
        if (!searchTerm) {
            return ResponseHandler.error("Parámetro 'q' es requerido para búsqueda", 400, "MISSING_SEARCH_TERM");
        }

        const limit = Number(url.searchParams.get('limit')) || 20;
        const empresas = await personaJuridicaService.searchPersonasByRazonSocial(searchTerm, limit);
        return ResponseHandler.success(empresas);

    } else {
        // Buscar por RUC (comportamiento por defecto)
        const ruc = url.searchParams.get('ruc');

        if (!ruc) {
            return ResponseHandler.error("RUC no proporcionado", 400, "MISSING_RUC");
        }

        const result = await personaJuridicaService.getPersonaByRUC(ruc);

        // Manejar errores de validación
        if (result.error) {
            const statusCode = result.code === 'VALIDATION_ERROR' ? 400 : 500;
            return ResponseHandler.error(result.error, statusCode, result.code || "ERROR");
        }

        // Manejar caso de no encontrado
        if (!result.data) {
            return ResponseHandler.error("No se encontró la persona jurídica", 404, "NOT_FOUND");
        }

        return ResponseHandler.success(result.data);
    }
}

// Manejar peticiones POST (crear)
async function handlePost(req: Request): Promise<Response> {
    const data = await req.json();
    const empresa = await personaJuridicaService.createPersona(data);
    return ResponseHandler.success(empresa, 201, "Persona jurídica creada exitosamente");
}

// Manejar peticiones PUT (actualizar)
async function handlePut(req: Request, url: URL): Promise<Response> {
    const id = url.searchParams.get('id');

    if (!id || isNaN(Number(id))) {
        return ResponseHandler.error("ID inválido", 400, "INVALID_ID");
    }

    const updates = await req.json();
    const empresa = await personaJuridicaService.updatePersona(Number(id), updates);

    return ResponseHandler.success(empresa, 200, "Persona jurídica actualizada exitosamente");
}

// Manejar peticiones DELETE (eliminar)
async function handleDelete(url: URL): Promise<Response> {
    const id = url.searchParams.get('id');

    if (!id || isNaN(Number(id))) {
        return ResponseHandler.error("ID inválido", 400, "INVALID_ID");
    }

    await personaJuridicaService.deletePersona(Number(id));
    return ResponseHandler.success({
        message: "Persona jurídica eliminada correctamente",
        id: Number(id)
    }, 200);
}

/* 
📖 DOCUMENTACIÓN DE USO:

GET /functions/v1/getPersonaJuridica?ruc=20123456789
    ➜ Buscar empresa por RUC (consulta API externa si no existe)

GET /functions/v1/getPersonaJuridica?action=all&limit=50&offset=0
    ➜ Listar todas las empresas con paginación

GET /functions/v1/getPersonaJuridica?action=search&q=Tecnología&limit=20
    ➜ Buscar empresas por razón social

POST /functions/v1/getPersonaJuridica
    Body: { "razon_social": "Mi Empresa SAC", "numero_documento": "20123456789", ... }
    ➜ Crear nueva empresa

PUT /functions/v1/getPersonaJuridica?id=1
    Body: { "razon_social": "Empresa Actualizada SAC", ... }
    ➜ Actualizar empresa

DELETE /functions/v1/getPersonaJuridica?id=1
    ➜ Eliminar empresa

Headers requeridos:
    Authorization: Bearer <tu_anon_key>

Ejemplo de RUC válido: 20123456789 (11 dígitos)
*/
