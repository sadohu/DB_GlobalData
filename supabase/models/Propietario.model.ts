export interface Propietario {
    id: number;
    id_vehiculo: number; // ID del vehículo asociado
    nombre: string; // Nombre del propietario, puede ser Persona Natural o Persona Juridica
    // tipo_propietario: 'Persona Natural' | 'Persona Juridica'; // Tipo de propietario
    fecha_creacion?: Date; // Fecha de creación del registro
    fecha_actualizacion?: Date; // Fecha de última actualización del registro
    creado_por?: string; // UUID del usuario que creó el registro
    actualizado_por?: string; // UUID del usuario que actualizó el registro
}