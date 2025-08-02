// index.ts - Función principal simplificada para PersonaNatural
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { PersonaNaturalService } from "../../services/PersonaNatural.service.ts";
import { ResponseHandler } from "../../utils/ResponseHandler.ts";
import { ValidationError } from "../../utils/Validator.ts";
import { validateConfig } from "../../shared/config.ts";

// Validar configuración al inicio
validateConfig();

console.log("🚀 PersonaNatural API inicializada");

// Inicializar servicio
const personaService = new PersonaNaturalService();

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
        // Obtener todas las personas
        const limit = Number(url.searchParams.get('limit')) || 50;
        const offset = Number(url.searchParams.get('offset')) || 0;

        const result = await personaService.getAllPersonas(limit, offset);
        return ResponseHandler.success(result);

    } else if (action === 'search') {
        // Buscar por nombre
        const searchTerm = url.searchParams.get('q');
        if (!searchTerm) {
            return ResponseHandler.error("Parámetro 'q' es requerido para búsqueda", 400, "MISSING_SEARCH_TERM");
        }

        const limit = Number(url.searchParams.get('limit')) || 20;
        const personas = await personaService.searchPersonasByName(searchTerm, limit);
        return ResponseHandler.success(personas);

    } else {
        // Buscar por DNI (comportamiento por defecto)
        const dni = url.searchParams.get('dni');

        if (!dni) {
            return ResponseHandler.error("DNI no proporcionado", 400, "MISSING_DNI");
        }

        const persona = await personaService.getPersonaByDNI(dni);

        if (!persona) {
            return ResponseHandler.error("No se encontró la persona natural", 404, "NOT_FOUND");
        }

        return ResponseHandler.success(persona);
    }
}

// Manejar peticiones POST (crear)
async function handlePost(req: Request): Promise<Response> {
    const data = await req.json();
    const persona = await personaService.createPersona(data);
    return ResponseHandler.success(persona, 201, "Persona creada exitosamente");
}

// Manejar peticiones PUT (actualizar)
async function handlePut(req: Request, url: URL): Promise<Response> {
    const id = url.searchParams.get('id');

    if (!id || isNaN(Number(id))) {
        return ResponseHandler.error("ID inválido", 400, "INVALID_ID");
    }

    const updates = await req.json();
    const persona = await personaService.updatePersona(Number(id), updates);

    return ResponseHandler.success(persona, 200, "Persona actualizada exitosamente");
}

// Manejar peticiones DELETE (eliminar)
async function handleDelete(url: URL): Promise<Response> {
    const id = url.searchParams.get('id');

    if (!id || isNaN(Number(id))) {
        return ResponseHandler.error("ID inválido", 400, "INVALID_ID");
    }

    await personaService.deletePersona(Number(id));
    return ResponseHandler.success({
        message: "Persona eliminada correctamente",
        id: Number(id)
    }, 200);
}

/* 
📖 DOCUMENTACIÓN DE USO:

GET /functions/v1/getPersonaNatural?dni=12345678
    ➜ Buscar persona por DNI (consulta API externa si no existe)

GET /functions/v1/getPersonaNatural?action=all&limit=50&offset=0
    ➜ Listar todas las personas con paginación

GET /functions/v1/getPersonaNatural?action=search&q=Juan&limit=20
    ➜ Buscar personas por nombre

POST /functions/v1/getPersonaNatural
    Body: { "numero_documento": "12345678", "nombres": "Juan", ... }
    ➜ Crear nueva persona

PUT /functions/v1/getPersonaNatural?id=1
    Body: { "nombres": "Juan Carlos", ... }
    ➜ Actualizar persona

DELETE /functions/v1/getPersonaNatural?id=1
    ➜ Eliminar persona

Headers requeridos:
    Authorization: Bearer <tu_anon_key>
*/
