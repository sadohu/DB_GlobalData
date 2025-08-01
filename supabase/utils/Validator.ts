export class ValidationError extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export const Validator = {
    isValidDNI: (dni: string | null): boolean => {
        if (!dni) return false;
        // DNI peruano: 8 dígitos
        return /^\d{8}$/.test(dni.trim());
    },

    isValidRUC: (ruc: string | null): boolean => {
        if (!ruc) return false;
        // RUC peruano: 11 dígitos
        return /^\d{11}$/.test(ruc.trim());
    },

    isValidEmail: (email: string | null): boolean => {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    },

    isValidPhone: (phone: string | null): boolean => {
        if (!phone) return false;
        // Teléfono peruano: 9 dígitos empezando por 9
        return /^9\d{8}$/.test(phone.trim());
    },

    validateDNI: (dni: string | null): void => {
        if (!Validator.isValidDNI(dni)) {
            throw new ValidationError('DNI debe tener exactamente 8 dígitos', 'dni');
        }
    },

    validateRequired: (value: any, fieldName: string): void => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            throw new ValidationError(`${fieldName} es requerido`, fieldName);
        }
    }
};