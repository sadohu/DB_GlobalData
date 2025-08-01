import type { ApiResponse, ApiError } from "../shared/types.ts";

export const handleSuccess = <T>(data: T, status: number = 200): Response => {
    const response: ApiResponse<T> = {
        data,
        success: true,
        status
    };
    
    return new Response(JSON.stringify(response), {
        status,
        headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
};

export const handleError = (message: string, status: number = 500, code?: string): Response => {
    const response: ApiResponse = {
        error: message,
        success: false,
        status,
        ...(code && { code })
    };
    
    return new Response(JSON.stringify(response), {
        status,
        headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
};

// Backwards compatibility
export const HandleResponse = handleSuccess;
export const HandleError = handleError;
