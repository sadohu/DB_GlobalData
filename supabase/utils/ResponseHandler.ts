// ResponseHandler.ts - Manejo de respuestas HTTP centralizadas
import { corsConfig } from "../shared/config.ts";

export interface ApiResponse<T = any> {
    data?: T;
    message?: string;
    error?: string;
    success: boolean;
    status: number;
    code?: string;
}

export class ResponseHandler {
    // Respuesta exitosa
    static success<T>(data: T, status: number = 200, message?: string): Response {
        const response: ApiResponse<T> = {
            data,
            success: true,
            status,
            ...(message && { message })
        };

        return new Response(JSON.stringify(response), {
            status,
            headers: ResponseHandler.getHeaders()
        });
    }

    // Respuesta de error
    static error(message: string, status: number = 500, code?: string): Response {
        const response: ApiResponse = {
            error: message,
            success: false,
            status,
            ...(code && { code })
        };

        return new Response(JSON.stringify(response), {
            status,
            headers: ResponseHandler.getHeaders()
        });
    }

    // Respuesta CORS para preflight
    static cors(): Response {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': corsConfig.allowedOrigins.join(', '),
                'Access-Control-Allow-Methods': corsConfig.allowedMethods.join(', '),
                'Access-Control-Allow-Headers': corsConfig.allowedHeaders.join(', '),
            }
        });
    }

    // Headers estándar con CORS
    private static getHeaders(): Record<string, string> {
        return {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": corsConfig.allowedOrigins.join(', '),
            "Access-Control-Allow-Methods": corsConfig.allowedMethods.join(', '),
            "Access-Control-Allow-Headers": corsConfig.allowedHeaders.join(', ')
        };
    }
}

// Funciones compatibles con la versión anterior
export const handleSuccess = ResponseHandler.success;
export const handleError = ResponseHandler.error;
export const HandleResponse = ResponseHandler.success;
export const HandleError = ResponseHandler.error;
