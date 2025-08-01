export interface PersonaNatural {
    id?: number;
    tipo_documento?: string;
    numero_documento: string; // Requerido
    nombres: string; // Requerido
    apellido_paterno: string; // Requerido
    apellido_materno: string; // Requerido
    sexo?: string;
    fecha_nacimiento?: Date | string;
    nacionalidad?: string;
    estado_civil?: string;
    correo?: string;
    telefono?: string;
    direccion?: string;
    ubigeo?: string;
    fecha_creacion?: Date | string;
    fecha_actualizacion?: Date | string;
    creado_por?: string;
    actualizado_por?: string;
}

export interface CreatePersonaNaturalDto {
    numero_documento: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    tipo_documento?: string;
    sexo?: string;
    fecha_nacimiento?: Date | string;
    nacionalidad?: string;
    estado_civil?: string;
    correo?: string;
    telefono?: string;
    direccion?: string;
    ubigeo?: string;
}