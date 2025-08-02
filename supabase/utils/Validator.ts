// Validator.ts - Validaciones centralizadas y simplificadas
export class ValidationError extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class Validator {
    // Validar DNI peruano (8 dígitos)
    static isValidDNI(dni: string | null): boolean {
        if (!dni) return false;
        return /^\d{8}$/.test(dni.trim());
    }

    // Validar RUC peruano (11 dígitos)
    static isValidRUC(ruc: string | null): boolean {
        if (!ruc) return false;
        return /^\d{11}$/.test(ruc.trim());
    }

    // Validar email
    static isValidEmail(email: string | null): boolean {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    // Validar teléfono peruano (9 dígitos empezando por 9)
    static isValidPhone(phone: string | null): boolean {
        if (!phone) return false;
        return /^9\d{8}$/.test(phone.trim());
    }

    // Validar placa de vehículo peruano (ABC-123 o ABC1234)
    static isValidPlaca(placa: string | null): boolean {
        if (!placa) return false;
        return /^[A-Z]{3}-?\d{3,4}$/.test(placa.trim().toUpperCase());
    }

    // Validar DNI y lanzar error si es inválido
    static validateDNI(dni: string | null): void {
        if (!Validator.isValidDNI(dni)) {
            throw new ValidationError('DNI debe tener exactamente 8 dígitos', 'dni');
        }
    }

    // Validar RUC y lanzar error si es inválido
    static validateRUC(ruc: string | null): void {
        if (!Validator.isValidRUC(ruc)) {
            throw new ValidationError('RUC debe tener exactamente 11 dígitos', 'ruc');
        }
    }

    // Validar campo requerido
    static validateRequired(value: any, fieldName: string): void {
        if (!value || (typeof value === 'string' && !value.trim())) {
            throw new ValidationError(`${fieldName} es requerido`, fieldName);
        }
    }

    // Validar email y lanzar error si es inválido
    static validateEmail(email: string | null): void {
        if (email && !Validator.isValidEmail(email)) {
            throw new ValidationError('Email tiene formato inválido', 'email');
        }
    }

    // Validar teléfono y lanzar error si es inválido
    static validatePhone(phone: string | null): void {
        if (phone && !Validator.isValidPhone(phone)) {
            throw new ValidationError('Teléfono debe tener 9 dígitos y empezar por 9', 'telefono');
        }
    }

    // Validar placa y lanzar error si es inválida
    static validatePlaca(placa: string | null): void {
        if (placa && !Validator.isValidPlaca(placa)) {
            throw new ValidationError('Placa debe tener formato ABC-123 o ABC1234', 'placa');
        }
    }
}