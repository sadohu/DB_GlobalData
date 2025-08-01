export interface PersonaJuridica {
    id?: number;
    razon_social?: string;
    nombre_comercial?: string;
    tipo_documento?: string;
    numero_documento?: string;
    fecha_constitucion?: Date;
    tipo_empresa?: string;
    actividad_economica?: string;
    representante_legal?: string;
    correo?: string;
    telefono?: string;
    direccion_fiscal?: string;
    ubigeo?: string;
    pagina_web?: string;
    estado_legal?: string;
    fecha_creacion?: Date;
    fecha_actualizacion?: Date;
    creado_por?: string;
    actualizado_por?: string;
}