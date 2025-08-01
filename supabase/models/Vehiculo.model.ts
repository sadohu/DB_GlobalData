export interface Vehiculo {
    id: number;
    placa: string;
    numero_serie: string;
    numero_motor: string;
    vin: string;
    marca: string;
    modelo: string;
    anio_fabricacion: number;
    anio_modelo: number;
    color: string;
    combustible: string;
    categoria: string;
    clase: string;
    capacidad_pasajeros: number;
    peso_bruto: number;
    cilindraje: string;
    tipo_carroceria: string;
    propietario_tipo: string; // Puede ser 'Persona Natural' o 'Persona Juridica'
    fecha_inscripcion: Date;
    fecha_creacion?: Date;
    fecha_actualizacion?: Date;
    creado_por?: string; // UUID del usuario que creó el registro
    actualizado_por?: string; // UUID del usuario que actualizó el registro
}