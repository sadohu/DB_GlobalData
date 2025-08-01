import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { ServiceFactory } from "./factory.ts";
import { handleError } from "../../utils/ResponseHandler.ts";

console.log("PersonaNatural Edge Function initialized");

// Configuración de servicios
const serviceFactory = ServiceFactory.create({
    supabaseUrl: Deno.env.get('SUPABASE_URL') ?? '',
    supabaseServiceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    peruApiToken: Deno.env.get('APIS_PERU_TOKEN') ?? '',
    peruApiBaseUrl: 'https://dniruc.apisperu.com/api/v1'
});

// Crear controlador
const controller = serviceFactory.createPersonaNaturalController();

Deno.serve(async (req) => {
    try {
        // Manejar CORS preflight
        if (req.method === 'OPTIONS') {
            return new Response(null, {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            });
        }

        // Enrutar según método HTTP
        switch (req.method) {
            case 'GET':
                const url = new URL(req.url);
                const action = url.searchParams.get('action');
                
                if (action === 'all') {
                    return await controller.handleGetAll(req);
                } else {
                    return await controller.handleGetByDNI(req);
                }
                
            case 'POST':
                return await controller.handleCreate(req);
                
            case 'PUT':
                return await controller.handleUpdate(req);
                
            case 'DELETE':
                return await controller.handleDelete(req);
                
            default:
                return handleError("Método no permitido", 405, "METHOD_NOT_ALLOWED");
        }

    } catch (error) {
        console.error("Error in edge function:", error);
        return handleError("Error interno del servidor", 500, "INTERNAL_ERROR");
    }
});

/* Documentación de uso:

GET /functions/v1/getPersonaNatural?dni=12345678
    - Buscar persona por DNI

GET /functions/v1/getPersonaNatural?action=all&limit=50&offset=0
    - Listar todas las personas

POST /functions/v1/getPersonaNatural
    Body: { "numero_documento": "12345678", "nombres": "Juan", ... }
    - Crear nueva persona

PUT /functions/v1/getPersonaNatural?id=1
    Body: { "nombres": "Juan Carlos", ... }
    - Actualizar persona

DELETE /functions/v1/getPersonaNatural?id=1
    - Eliminar persona

*/
