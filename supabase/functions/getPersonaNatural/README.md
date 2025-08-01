# PersonaNatural Edge Function

## Descripción
Edge Function para gestión de personas naturales con integración a API externa de Perú para obtener datos de DNI.

## Características
- ✅ Búsqueda por DNI con fallback a API externa
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Validación robusta de datos
- ✅ Manejo de errores unificado
- ✅ CORS configurado
- ✅ Arquitectura en capas

## API Endpoints

### GET - Buscar por DNI
```
GET /functions/v1/getPersonaNatural?dni=12345678
```

### GET - Listar todas las personas
```
GET /functions/v1/getPersonaNatural?action=all&limit=50&offset=0
```

### POST - Crear persona
```
POST /functions/v1/getPersonaNatural
Content-Type: application/json

{
  "numero_documento": "12345678",
  "nombres": "Juan",
  "apellido_paterno": "Pérez",
  "apellido_materno": "García"
}
```

### PUT - Actualizar persona
```
PUT /functions/v1/getPersonaNatural?id=1
Content-Type: application/json

{
  "nombres": "Juan Carlos"
}
```

### DELETE - Eliminar persona
```
DELETE /functions/v1/getPersonaNatural?id=1
```

## Variables de Entorno Requeridas

```bash
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
APIS_PERU_TOKEN=tu_token_de_apis_peru
```

## Despliegue

```bash
supabase functions deploy getPersonaNatural
```

## Estructura del Proyecto

```
supabase/
├── functions/getPersonaNatural/
│   ├── index.ts          # Punto de entrada
│   ├── factory.ts        # Inyección de dependencias
│   └── deno.json         # Configuración Deno
├── models/               # Modelos de datos
├── repository/           # Acceso a datos
├── services/             # Lógica de negocio
├── controller/           # Controladores HTTP
├── utils/                # Utilidades y validación
└── shared/               # Configuración y tipos
```
├── repository/
│   └── PersonaNatural.repository.ts
├── services/
│   ├── PersonaNatural.service.ts
│   └── ExternalAPI.service.ts
├── controller/
│   └── PersonaNatural.controller.ts
├── utils/
│   ├── ResponseHandler.ts
│   └── Validator.ts
├── shared/
│   ├── config.ts
│   ├── types.ts
│   └── supabase.ts
└── config.toml
```

## Características

### ✅ Arquitectura Limpia
- **Separación de responsabilidades**: Cada capa tiene una responsabilidad específica
- **Inyección de dependencias**: Implementada con patrón Factory
- **Manejo de errores**: Sistema unificado con códigos específicos
- **Validaciones**: Sistema robusto de validación de datos
- **CORS**: Configurado correctamente para requests cross-origin
- **Importaciones optimizadas**: Sin dependencias circulares

### 🏗️ Capas de la Aplicación

1. **Controller Layer**: Maneja las peticiones HTTP y respuestas
2. **Service Layer**: Lógica de negocio
3. **Repository Layer**: Acceso a datos
4. **External API Layer**: Integración con APIs externas
5. **Utils Layer**: Utilidades y validaciones
6. **Models Layer**: Definición de tipos y interfaces

## API Endpoints

### GET - Buscar por DNI
```
GET /functions/v1/getPersonaNatural?dni=12345678
```
**Respuesta exitosa (200):**
```json
{
  "data": {
    "id": 1,
    "numero_documento": "12345678",
    "nombres": "Juan",
    "apellido_paterno": "Pérez",
    "apellido_materno": "García"
  },
  "success": true,
  "status": 200
}
```

### GET - Listar todas las personas
```
GET /functions/v1/getPersonaNatural?action=all&limit=50&offset=0
```

### POST - Crear persona
```
POST /functions/v1/getPersonaNatural
Content-Type: application/json

{
  "numero_documento": "12345678",
  "nombres": "Juan",
  "apellido_paterno": "Pérez",
  "apellido_materno": "García"
}
```

### PUT - Actualizar persona
```
PUT /functions/v1/getPersonaNatural?id=1
Content-Type: application/json

{
  "nombres": "Juan Carlos"
}
```

### DELETE - Eliminar persona
```
DELETE /functions/v1/getPersonaNatural?id=1
```

## Variables de Entorno

Configurar en el Dashboard de Supabase:

```bash
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
APIS_PERU_TOKEN=tu_token_de_apis_peru
```

## Despliegue

```bash
supabase functions deploy getPersonaNatural
```

## Respuestas de Error

Todas las respuestas de error siguen el formato estándar:

```json
{
  "error": "Mensaje de error",
  "success": false,
  "status": 400,
  "code": "VALIDATION_ERROR"
}
```

### Códigos de Error Comunes:
- `MISSING_DNI`: DNI no proporcionado
- `VALIDATION_ERROR`: Error de validación de datos
- `NOT_FOUND`: Recurso no encontrado
- `INTERNAL_ERROR`: Error interno del servidor
- `METHOD_NOT_ALLOWED`: Método HTTP no permitido

## Funcionalidades Especiales

### Búsqueda Inteligente por DNI
1. **Búsqueda Local**: Primero busca en la base de datos local
2. **API Externa**: Si no encuentra localmente, consulta API de Perú
3. **Guardado Automático**: Guarda automáticamente los datos obtenidos externamente
4. **Cache Natural**: Las siguientes consultas del mismo DNI serán instantáneas

### Validaciones Implementadas
- DNI: 8 dígitos numéricos
- Campos requeridos: número_documento, nombres, apellidos
- Duplicados: No permite DNIs duplicados
- Formato de respuesta consistente

## Integración Externa

La función integra con **APIs Perú** para obtener datos de personas naturales que no están en la base de datos local, proporcionando una experiencia transparente al usuario.
