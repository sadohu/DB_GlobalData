# PersonaNatural API - Supabase Edge Functions

API para gestión de personas naturales con integración a servicios externos de consulta de DNI peruano.

## 🚀 Características

- **Edge Functions**: Desplegado en Supabase Edge Runtime (Deno)
- **Arquitectura Limpia**: Patrón Repository, Service y Controller
- **Integración Externa**: Consulta automática de datos de DNI via APIs Peru
- **Base de Datos**: PostgreSQL con Supabase
- **TypeScript**: Tipado estricto y modular
- **CORS**: Configurado para aplicaciones web

## 📋 Requisitos Previos

- [Supabase CLI](https://supabase.com/docs/guides/cli) instalado
- Cuenta en [Supabase](https://supabase.com)
- Token de [APIs Peru](https://apis.peru.com) para consultas de DNI
- Deno 1.40+ (incluido con Supabase CLI)

## ⚙️ Configuración

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd project_data
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus credenciales:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
SUPABASE_URL=https://tu-proyecto-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ_tu_service_role_key_aqui
APIS_PERU_TOKEN=tu_token_de_apis_peru_aqui
SUPABASE_PROJECT_ID=tu_proyecto_id_aqui
```

### 3. Configurar Supabase

Inicia sesión en Supabase CLI:

```bash
supabase login
```

Vincula tu proyecto:

```bash
supabase link --project-ref tu_proyecto_id
```

### 4. Crear tabla en la base de datos

Ejecuta la siguiente migración SQL en tu proyecto Supabase:

```sql
CREATE TABLE persona_natural (
    id SERIAL PRIMARY KEY,
    tipo_documento VARCHAR(10) DEFAULT 'DNI',
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    sexo VARCHAR(1),
    fecha_nacimiento DATE,
    nacionalidad VARCHAR(50),
    estado_civil VARCHAR(20),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    ubigeo VARCHAR(10),
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP DEFAULT NOW(),
    creado_por UUID DEFAULT '00000000-0000-0000-0000-000000000000',
    actualizado_por UUID DEFAULT '00000000-0000-0000-0000-000000000000'
);

-- Índices para mejorar performance
CREATE INDEX idx_persona_natural_dni ON persona_natural(numero_documento);
CREATE INDEX idx_persona_natural_nombres ON persona_natural(nombres, apellido_paterno, apellido_materno);
```

## 🚀 Despliegue

### Desplegar Edge Function

```bash
supabase functions deploy getPersonaNatural
```

### Configurar variables de entorno en Supabase Dashboard

Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard) > Settings > Edge Functions y configura:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APIS_PERU_TOKEN`

## 📖 Uso de la API

### Consultar persona por DNI

```bash
GET https://tu-proyecto.supabase.co/functions/v1/getPersonaNatural?dni=12345678
```

**Headers requeridos:**
```
Authorization: Bearer <tu_anon_key>
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "numero_documento": "12345678",
    "nombres": "Juan Carlos",
    "apellido_paterno": "Pérez",
    "apellido_materno": "García",
    "tipo_documento": "DNI",
    "fecha_creacion": "2025-07-31T10:30:00Z"
  }
}
```

### Obtener todas las personas

```bash
GET https://tu-proyecto.supabase.co/functions/v1/getPersonaNatural?action=all
```

### Crear nueva persona

```bash
POST https://tu-proyecto.supabase.co/functions/v1/getPersonaNatural
Content-Type: application/json

{
  "numero_documento": "87654321",
  "nombres": "María Elena",
  "apellido_paterno": "López",
  "apellido_materno": "Rodríguez",
  "correo": "maria@example.com"
}
```

### Actualizar persona

```bash
PUT https://tu-proyecto.supabase.co/functions/v1/getPersonaNatural?id=1
Content-Type: application/json

{
  "correo": "nuevo_correo@example.com",
  "telefono": "+51987654321"
}
```

### Eliminar persona

```bash
DELETE https://tu-proyecto.supabase.co/functions/v1/getPersonaNatural?id=1
```

## 🏗️ Arquitectura

```
supabase/
├── functions/getPersonaNatural/     # Edge Function principal
│   ├── index.ts                     # Punto de entrada HTTP
│   ├── factory.ts                   # Inyección de dependencias
│   ├── deno.json                    # Configuración Deno
│   └── README.md                    # Documentación específica
├── controller/                      # Controladores HTTP
│   └── PersonaNatural.controller.ts
├── services/                        # Lógica de negocio
│   ├── PersonaNatural.service.ts
│   └── ExternalAPI.service.ts
├── repository/                      # Acceso a datos
│   └── PersonaNatural.repository.ts
├── models/                          # Modelos de datos
│   └── PersonaNatural.model.ts
├── utils/                          # Utilidades
│   ├── ResponseHandler.ts
│   └── Validator.ts
└── shared/                         # Configuración compartida
    ├── config.ts
    ├── supabase.ts
    └── types.ts
```

## 🧪 Testing

Para probar localmente:

```bash
# Servir función localmente
supabase functions serve getPersonaNatural

# Probar endpoint
curl "http://localhost:54321/functions/v1/getPersonaNatural?dni=12345678" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📝 Notas de Desarrollo

- **Importaciones**: Usa JSR imports para compatibilidad con Deno
- **Base de datos**: Los nombres de tabla usan snake_case (persona_natural)
- **UUIDs**: Los campos de auditoría requieren UUIDs válidos
- **CORS**: Configurado para permitir todos los orígenes (ajustar para producción)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la [documentación de Supabase Edge Functions](https://supabase.com/docs/guides/functions)
2. Consulta los [issues](../../issues) del repositorio
3. Crea un nuevo issue si no encuentras solución
