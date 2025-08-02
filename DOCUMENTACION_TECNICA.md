# 📚 DOCUMENTACIÓN TÉCNICA - Edge Functions

## 🎯 **RESUMEN EJECUTIVO**

Este documento describe la implementación, mantenimiento y uso de las **Edge Functions** para consulta de datos de personas naturales y jurídicas en Perú, integradas con APIs externas y almacenamiento local.

### **📍 Endpoints Disponibles:**
- **PersonaNatural:** `https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural`
- **PersonaJuridica:** `https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica`

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **Patrón Arquitectónico: Clean Architecture**
```
📱 HTTP Request
    ↓
🌐 Edge Function (Controller)
    ↓
⚙️ Service Layer (Business Logic)
    ↓
🗄️ Repository Layer (Data Access)
    ↓
📊 Database / External API
```

### **Stack Tecnológico:**
- **Runtime:** Deno v2.4.3
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **External API:** APIs Peru (dniruc.apisperu.com)
- **Deployment:** Supabase Edge Functions

### **Estructura de Directorios:**
```
📁 supabase/
├── 🎛️ shared/
│   ├── config.ts              → Configuración centralizada
│   └── supabase.ts            → Cliente Supabase
├── 📊 models/
│   ├── PersonaNatural.model.ts → Interface DNI
│   └── PersonaJuridica.model.ts → Interface RUC
├── 🗄️ repository/
│   ├── PersonaNatural.repository.ts → CRUD DNI
│   └── PersonaJuridica.repository.ts → CRUD RUC
├── ⚙️ services/
│   ├── PersonaNatural.service.ts → Lógica negocio DNI
│   ├── PersonaJuridica.service.ts → Lógica negocio RUC
│   └── ExternalAPI.service.ts → Integración API Perú
├── 🛠️ utils/
│   ├── Database.ts            → Conexión BD
│   ├── ResponseHandler.ts     → Respuestas HTTP
│   └── Validator.ts           → Validaciones
└── 🌐 functions/
    ├── getPersonaNatural/     → Edge Function DNI
    └── getPersonaJuridica/    → Edge Function RUC
```

---

## 👤 **ENDPOINT: PersonaNatural (DNI)**

### **📍 URL Base:**
```
https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural
```

### **🔐 Autenticación:**
```http
Authorization: Bearer YOUR_ANON_KEY
Content-Type: application/json
```

### **📋 Operaciones Disponibles:**

#### **1. Buscar por DNI (GET)**
```http
GET /functions/v1/getPersonaNatural?dni=12345678
```

**Validaciones:**
- DNI debe tener exactamente 8 dígitos numéricos
- Campo requerido

**Flujo de datos:**
1. Validar formato DNI
2. Buscar en base de datos local
3. Si no existe → Consultar API externa
4. Mapear y guardar datos
5. Retornar resultado

**Respuesta exitosa:**
```json
{
  "data": {
    "id": 1,
    "nombres": "JUAN CARLOS",
    "apellido_paterno": "PÉREZ",
    "apellido_materno": "GARCIA",
    "numero_documento": "12345678",
    "tipo_documento": "DNI"
  },
  "success": true,
  "status": 200
}
```

#### **2. Listar Todos (GET)**
```http
GET /functions/v1/getPersonaNatural?action=all&limit=50&offset=0
```

#### **3. Buscar por Nombre (GET)**
```http
GET /functions/v1/getPersonaNatural?action=search&q=JUAN&limit=20
```

#### **4. Crear Persona (POST)**
```http
POST /functions/v1/getPersonaNatural
Content-Type: application/json

{
  "nombres": "MARÍA ELENA",
  "apellido_paterno": "RODRIGUEZ",
  "apellido_materno": "SILVA",
  "numero_documento": "87654321",
  "correo": "maria@email.com",
  "telefono": "987654321"
}
```

#### **5. Actualizar Persona (PUT)**
```http
PUT /functions/v1/getPersonaNatural?id=1
Content-Type: application/json

{
  "correo": "nuevo@email.com",
  "telefono": "123456789"
}
```

#### **6. Eliminar Persona (DELETE)**
```http
DELETE /functions/v1/getPersonaNatural?id=1
```

---

## 🏢 **ENDPOINT: PersonaJuridica (RUC)**

### **📍 URL Base:**
```
https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica
```

### **🔐 Autenticación:**
```http
Authorization: Bearer YOUR_ANON_KEY
Content-Type: application/json
```

### **📋 Operaciones Disponibles:**

#### **1. Buscar por RUC (GET)**
```http
GET /functions/v1/getPersonaJuridica?ruc=20123456789
```

**Validaciones:**
- RUC debe tener exactamente 11 dígitos numéricos
- Campo requerido

**Respuesta exitosa:**
```json
{
  "data": {
    "id": 1,
    "razon_social": "EMPRESA EJEMPLO SAC",
    "numero_documento": "20123456789",
    "tipo_documento": "RUC",
    "direccion_fiscal": "AV. EJEMPLO 123, LIMA",
    "estado_legal": "ACTIVO"
  },
  "success": true,
  "status": 200
}
```

#### **2. Listar Todas las Empresas (GET)**
```http
GET /functions/v1/getPersonaJuridica?action=all&limit=50&offset=0
```

#### **3. Buscar por Razón Social (GET)**
```http
GET /functions/v1/getPersonaJuridica?action=search&q=TECNOLOGÍA&limit=20
```

#### **4. Crear Empresa (POST)**
```http
POST /functions/v1/getPersonaJuridica
Content-Type: application/json

{
  "razon_social": "MI EMPRESA SAC",
  "numero_documento": "20987654321",
  "nombre_comercial": "TechCorp",
  "tipo_empresa": "SAC",
  "correo": "contacto@empresa.pe",
  "telefono": "987654321",
  "direccion_fiscal": "AV. TECNOLOGÍA 123, LIMA"
}
```

#### **5. Actualizar Empresa (PUT)**
```http
PUT /functions/v1/getPersonaJuridica?id=1
Content-Type: application/json

{
  "correo": "nuevo@empresa.pe",
  "telefono": "123456789"
}
```

#### **6. Eliminar Empresa (DELETE)**
```http
DELETE /functions/v1/getPersonaJuridica?id=1
```

---

## 🔧 **MANTENIMIENTO DEL CÓDIGO**

### **📁 Estructura de Archivos por Función**

#### **1. Configuración Centralizada**
**Archivo:** `shared/config.ts`
```typescript
// ✅ TODO: Centralizado y reutilizable
export const databaseConfig = {
    maxConnections: 10,
    connectionTimeout: 30000
};

export const externalApiConfig = {
    peruApiBaseUrl: 'https://dniruc.apisperu.com/api/v1/',
    dniEndpoint: 'dni/',
    rucEndpoint: 'ruc/',
    peruApiToken: Deno.env.get('APIS_PERU_TOKEN') || ''
};
```

**Mantenimiento:**
- ✅ Un solo lugar para cambiar configuraciones
- ✅ Variables de entorno centralizadas
- ✅ Fácil para testing y desarrollo

#### **2. Modelos de Datos**
**Archivos:** `models/*.model.ts`

**PersonaNatural.model.ts:**
```typescript
export interface PersonaNatural {
    id?: number;
    tipo_documento?: string;
    numero_documento: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    // ... más campos
}
```

**Mantenimiento:**
- ✅ Interfaces TypeScript para type safety
- ✅ Campos opcionales bien definidos
- ✅ Documentación en JSDoc si es necesario

#### **3. Capa de Repositorio**
**Archivos:** `repository/*.repository.ts`

**Responsabilidades:**
- ✅ Solo operaciones CRUD de base de datos
- ✅ No lógica de negocio
- ✅ Manejo de errores de BD

**Ejemplo:**
```typescript
export class PersonaNaturalRepository {
    async findByDNI(dni: string): Promise<PersonaNatural | null> {
        // Solo acceso a datos
    }
    
    async save(persona: PersonaNatural): Promise<PersonaNatural> {
        // Solo persistencia
    }
}
```

#### **4. Capa de Servicio**
**Archivos:** `services/*.service.ts`

**Responsabilidades:**
- ✅ Lógica de negocio
- ✅ Validaciones
- ✅ Integración con APIs externas
- ✅ Orquestación de operaciones

**Ejemplo:**
```typescript
export class PersonaNaturalService {
    async getPersonaByDNI(dni: string): Promise<{data: PersonaNatural | null; error?: string}> {
        // 1. Validar entrada
        // 2. Buscar localmente
        // 3. Consultar API externa si no existe
        // 4. Guardar resultado
        // 5. Retornar respuesta estructurada
    }
}
```

#### **5. Edge Functions**
**Archivos:** `functions/*/index.ts`

**Responsabilidades:**
- ✅ Solo manejo HTTP (request/response)
- ✅ Routing de métodos
- ✅ Autenticación/autorización
- ✅ Formateo de respuestas

### **🔄 Flujo de Desarrollo**

#### **Para agregar nueva funcionalidad:**

1. **Modelo** → Actualizar interface si es necesario
2. **Repository** → Agregar método CRUD si es necesario
3. **Service** → Implementar lógica de negocio
4. **Function** → Agregar endpoint HTTP
5. **Test** → Verificar compilación
6. **Deploy** → Desplegar función

#### **Para modificar campos existentes:**

1. **Modelo** → Actualizar interface
2. **Repository** → Ajustar queries SQL
3. **Service** → Ajustar mapeo de APIs externas
4. **Test** → Verificar compilación
5. **Deploy** → Desplegar función

### **📝 Convenciones de Código**

#### **Nomenclatura:**
- **Clases:** PascalCase (`PersonaNaturalService`)
- **Métodos:** camelCase (`getPersonaByDNI`)
- **Variables:** camelCase (`personaNatural`)
- **Constantes:** UPPER_CASE (`MAX_RETRIES`)

#### **Estructura de métodos:**
```typescript
async methodName(param: Type): Promise<ReturnType> {
    try {
        // 1. Validaciones
        // 2. Lógica principal
        // 3. Return exitoso
    } catch (error) {
        // 4. Manejo de errores
        console.error('Error descriptivo:', error);
        // 5. Return de error estructurado
    }
}
```

#### **Logging consistente:**
```typescript
console.log(`🔍 Acción descriptiva: ${parametro}`);  // Info
console.error(`❌ Error descriptivo:`, error);        // Error
console.warn(`⚠️ Advertencia descriptiva`);           // Warning
```

---

## 🌐 **INTEGRACIÓN CON API EXTERNA**

### **🔗 API de Perú (dniruc.apisperu.com)**

#### **Configuración:**
```typescript
const externalApiConfig = {
    peruApiBaseUrl: 'https://dniruc.apisperu.com/api/v1/',
    dniEndpoint: 'dni/',        // DNI: /dni/{dni}?token={token}
    rucEndpoint: 'ruc/',        // RUC: /ruc/{ruc}?token={token}
    peruApiToken: Deno.env.get('APIS_PERU_TOKEN')
};
```

#### **Mapeo de Datos DNI:**
| API Externa | Nuestro Modelo |
|-------------|----------------|
| `dni` | `numero_documento` |
| `nombres` | `nombres` |
| `apellidoPaterno` | `apellido_paterno` |
| `apellidoMaterno` | `apellido_materno` |

#### **Mapeo de Datos RUC:**
| API Externa | Nuestro Modelo |
|-------------|----------------|
| `ruc` | `numero_documento` |
| `razonSocial` | `razon_social` |
| `nombreComercial` | `nombre_comercial` |
| `direccion` | `direccion_fiscal` |
| `estado` | `estado_legal` |
| `telefonos[0]` | `telefono` |
| `ubigeo` | `ubigeo` |

#### **Manejo de Errores API:**
```typescript
try {
    const response = await fetch(url);
    
    if (!response.ok) {
        console.error(`❌ Error HTTP: ${response.status}`);
        return null;
    }
    
    const json = await response.json();
    
    if (!json || !json.dni) {  // Para DNI
        console.log(`ℹ️ API no encontró datos`);
        return null;
    }
    
    return mapearDatos(json);
    
} catch (error) {
    console.error(`❌ Error de red:`, error);
    return null;
}
```

### **🔄 Flujo Híbrido (Local + Externa)**

1. **Request** → Usuario solicita DNI/RUC
2. **Local Search** → Buscar en BD local primero
3. **Cache Hit** → Si existe, retornar inmediatamente
4. **Cache Miss** → Si no existe, consultar API externa
5. **External API** → Obtener datos frescos
6. **Store** → Guardar en BD local para futuras consultas
7. **Response** → Retornar datos al usuario

**Ventajas:**
- ✅ **Performance:** Respuestas rápidas para datos ya consultados
- ✅ **Costo:** Menos llamadas a API externa
- ✅ **Disponibilidad:** Funciona aunque API externa falle
- ✅ **Datos frescos:** Siempre actualizado para nuevas consultas

---

## 🗄️ **BASE DE DATOS**

### **📋 Esquema de Tablas**

#### **Tabla: persona_natural**
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
    nacionalidad VARCHAR(50) DEFAULT 'PERUANA',
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

-- Índices para performance
CREATE INDEX idx_persona_natural_dni ON persona_natural(numero_documento);
CREATE INDEX idx_persona_natural_nombres ON persona_natural(nombres, apellido_paterno);
```

#### **Tabla: persona_juridica**
```sql
CREATE TABLE persona_juridica (
    id SERIAL PRIMARY KEY,
    razon_social VARCHAR(200) NOT NULL,
    nombre_comercial VARCHAR(200),
    tipo_documento VARCHAR(10) DEFAULT 'RUC',
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    fecha_constitucion DATE,
    tipo_empresa VARCHAR(50),
    actividad_economica VARCHAR(300),
    representante_legal VARCHAR(200),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    direccion_fiscal VARCHAR(500),
    ubigeo VARCHAR(10),
    pagina_web VARCHAR(200),
    estado_legal VARCHAR(20) DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP DEFAULT NOW(),
    creado_por UUID DEFAULT '00000000-0000-0000-0000-000000000000',
    actualizado_por UUID DEFAULT '00000000-0000-0000-0000-000000000000'
);

-- Índices para performance
CREATE INDEX idx_persona_juridica_ruc ON persona_juridica(numero_documento);
CREATE INDEX idx_persona_juridica_razon_social ON persona_juridica(razon_social);
CREATE INDEX idx_persona_juridica_estado ON persona_juridica(estado_legal);
```

### **🔐 Row Level Security (RLS)**

#### **Configuración de Seguridad:**
```sql
-- Habilitar RLS
ALTER TABLE persona_natural ENABLE ROW LEVEL SECURITY;
ALTER TABLE persona_juridica ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
CREATE POLICY "Permitir lectura autenticada" ON persona_natural
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir escritura autenticada" ON persona_natural
    FOR ALL USING (auth.role() = 'authenticated');
```

---

## 🔐 **SEGURIDAD Y AUTENTICACIÓN**

### **🔑 Variables de Entorno**

#### **Configuración en Supabase Dashboard:**
```bash
# Settings > Edge Functions > Environment Variables
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
APIS_PERU_TOKEN=tu_token_apis_peru
```

#### **⚠️ IMPORTANTE:**
- ❌ **NUNCA** hardcodear tokens en el código
- ✅ **SIEMPRE** usar variables de entorno
- ✅ **ROTAR** tokens periódicamente
- ✅ **AUDITAR** accesos regularmente

### **🛡️ Autenticación HTTP**

#### **Headers requeridos:**
```http
Authorization: Bearer YOUR_ANON_KEY
Content-Type: application/json
```

#### **Validación en código:**
```typescript
const authHeader = request.headers.get('Authorization');
if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ResponseHandler.error('Token de autorización requerido', 401, 'UNAUTHORIZED');
}
```

### **🔒 CORS y Dominios**

#### **Configuración actual (desarrollo):**
```typescript
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',  // ⚠️ Solo para desarrollo
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};
```

#### **Configuración producción (recomendada):**
```typescript
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://tu-dominio.com',  // ✅ Específico
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'  // Sin OPTIONS
};
```

---

## 📊 **MONITOREO Y LOGS**

### **📈 Métricas Clave**

#### **Performance:**
- **Tiempo de respuesta:** < 2 segundos promedio
- **Tasa de éxito:** > 99%
- **Memoria utilizada:** < 50MB por invocación
- **Invocaciones concurrentes:** Hasta 50

#### **Logs estructurados:**
```typescript
console.log(`🔍 [${new Date().toISOString()}] Buscando DNI: ${dni}`);
console.log(`✅ [${new Date().toISOString()}] Encontrado en BD: ${persona.nombres}`);
console.error(`❌ [${new Date().toISOString()}] Error API:`, error);
```

### **🚨 Alertas Recomendadas**

#### **Errores críticos:**
- Error rate > 5% en 5 minutos
- Tiempo de respuesta > 10 segundos
- API externa no disponible > 1 minuto

#### **Monitoreo en Supabase:**
1. **Dashboard** → Edge Functions → Logs
2. **Filtros:** Error level, time range
3. **Métricas:** Invocations, errors, duration

---

## 🧪 **TESTING Y VALIDACIÓN**

### **✅ Tests de Compilación**

#### **Verificar TypeScript:**
```bash
cd supabase/functions/getPersonaNatural
deno check index.ts

cd ../getPersonaJuridica  
deno check index.ts
```

#### **Ejecutar tests:**
```bash
# Test de validaciones
deno test utils/Validator.test.ts

# Test de servicios
deno test services/PersonaNatural.service.test.ts
```

### **🔧 Testing Manual**

#### **Test básico DNI:**
```bash
curl "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural?dni=12345678" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

#### **Test básico RUC:**
```bash
curl "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?ruc=20123456789" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

#### **Test de errores:**
```bash
# DNI inválido (debería retornar 400)
curl "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural?dni=123" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### **📋 Casos de Prueba**

#### **PersonaNatural:**
| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| DNI válido existente | `dni=12345678` | HTTP 200 + datos |
| DNI válido no existente | `dni=87654321` | HTTP 200 + datos API |
| DNI inválido formato | `dni=123` | HTTP 400 + error |
| DNI inválido caracteres | `dni=abcd1234` | HTTP 400 + error |
| Sin DNI | `?` | HTTP 400 + error |

#### **PersonaJuridica:**
| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| RUC válido existente | `ruc=20123456789` | HTTP 200 + datos |
| RUC válido no existente | `ruc=20987654321` | HTTP 200 + datos API |
| RUC inválido formato | `ruc=123456` | HTTP 400 + error |
| RUC inválido caracteres | `ruc=abc12345678` | HTTP 400 + error |
| Sin RUC | `?` | HTTP 400 + error |

---

## 🚀 **DESPLIEGUE Y CI/CD**

### **📋 Checklist Pre-Despliegue**

#### **1. Verificaciones de código:**
- ✅ TypeScript compila sin errores
- ✅ Tests pasan exitosamente
- ✅ Linting sin warnings
- ✅ Variables de entorno configuradas

#### **2. Verificaciones de BD:**
- ✅ Tablas creadas
- ✅ Índices aplicados
- ✅ RLS configurado
- ✅ Políticas de seguridad

#### **3. Verificaciones de API:**
- ✅ Token API Perú válido
- ✅ Conectividad externa
- ✅ Rate limits configurados

### **🔄 Proceso de Despliegue**

#### **Manual (Recomendado):**
```bash
# 1. Verificar compilación
deno check index.ts

# 2. Desplegar función específica
supabase functions deploy getPersonaNatural --project-ref tu_proyecto_id

# 3. Verificar despliegue
curl "https://tu-proyecto.supabase.co/functions/v1/getPersonaNatural?dni=12345678" \
  -H "Authorization: Bearer tu_anon_key"
```

#### **Automatizado (GitHub Actions):**
```yaml
name: Deploy Edge Functions
on:
  push:
    branches: [main]
    paths: ['supabase/functions/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: supabase functions deploy --project-ref ${{ secrets.SUPABASE_PROJECT_ID }}
```

### **🔄 Rollback Strategy**

#### **En caso de error:**
1. **Identificar** versión anterior funcionando
2. **Rollback** al commit anterior:
   ```bash
   git revert HEAD
   supabase functions deploy getPersonaNatural
   ```
3. **Verificar** funcionamiento
4. **Investigar** causa del error

---

## 📋 **CÓDIGOS DE ERROR**

### **🔴 HTTP Status Codes**

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| **200** | Success | Operación exitosa |
| **400** | Bad Request | DNI/RUC inválido, parámetros faltantes |
| **401** | Unauthorized | Token faltante o inválido |
| **404** | Not Found | Recurso no encontrado |
| **429** | Too Many Requests | Rate limit excedido |
| **500** | Internal Server Error | Error interno del servidor |

### **🔧 Códigos de Error Específicos**

#### **Validación:**
- `VALIDATION_ERROR` → Campo inválido
- `MISSING_DNI` → DNI no proporcionado
- `MISSING_RUC` → RUC no proporcionado
- `INVALID_FORMAT` → Formato incorrecto

#### **Sistema:**
- `DATABASE_ERROR` → Error de base de datos
- `EXTERNAL_API_ERROR` → Error API externa
- `INTERNAL_ERROR` → Error interno genérico

### **📝 Mensajes de Error**

```typescript
const errorMessages = {
    INVALID_DNI: 'DNI debe tener exactamente 8 dígitos numéricos',
    INVALID_RUC: 'RUC debe tener exactamente 11 dígitos numéricos',
    MISSING_PARAMS: 'Parámetros requeridos faltantes',
    UNAUTHORIZED: 'Token de autorización requerido',
    NOT_FOUND: 'Recurso no encontrado',
    INTERNAL_ERROR: 'Error interno del servidor'
};
```

---

## 🎯 **MEJORES PRÁCTICAS**

### **📝 Desarrollo**

#### **1. Separación de responsabilidades:**
```typescript
// ❌ MAL: Todo en una función
async function getPersona(dni) {
    // Validación + DB + API + HTTP response mezclado
}

// ✅ BIEN: Responsabilidades separadas
class PersonaNaturalService {
    async getPersonaByDNI(dni) { /* Solo lógica de negocio */ }
}
class PersonaNaturalRepository {
    async findByDNI(dni) { /* Solo acceso a datos */ }
}
```

#### **2. Manejo de errores consistente:**
```typescript
// ✅ BIEN: Errores estructurados
try {
    const result = await operation();
    return { data: result, error: null };
} catch (error) {
    return { 
        data: null, 
        error: error.message, 
        code: 'OPERATION_FAILED' 
    };
}
```

#### **3. Logging estructurado:**
```typescript
// ✅ BIEN: Logs informativos
console.log(`🔍 [PersonaNaturalService] Buscando DNI: ${dni}`);
console.log(`✅ [PersonaNaturalService] Encontrado: ${persona.nombres}`);
console.error(`❌ [PersonaNaturalService] Error:`, error);
```

### **🔒 Seguridad**

#### **1. Validación de entrada:**
```typescript
// ✅ SIEMPRE validar antes de procesar
if (!Validator.isValidDNI(dni)) {
    return ResponseHandler.error('DNI inválido', 400, 'INVALID_DNI');
}
```

#### **2. Sanitización:**
```typescript
// ✅ Limpiar datos de entrada
const cleanDNI = dni.trim().replace(/\D/g, '');
```

#### **3. Rate limiting:**
```typescript
// ✅ Implementar límites por IP/usuario
const rateLimiter = new RateLimit({
    requests: 100,
    window: '1h'
});
```

### **📊 Performance**

#### **1. Cache estratégico:**
```typescript
// ✅ Buscar localmente primero
const cached = await repository.findByDNI(dni);
if (cached) return cached;

// Solo consultar API si no existe
const external = await externalAPI.fetch(dni);
```

#### **2. Conexiones eficientes:**
```typescript
// ✅ Reutilizar conexiones
const pool = new ConnectionPool({
    max: 10,
    idleTimeout: 30000
});
```

#### **3. Timeouts apropiados:**
```typescript
// ✅ Evitar requests colgados
const response = await fetch(url, {
    signal: AbortSignal.timeout(10000)  // 10 segundos
});
```

### **🔄 Mantenimiento**

#### **1. Documentación actualizada:**
- ✅ README.md actualizado
- ✅ JSDoc en funciones complejas
- ✅ Changelog de cambios

#### **2. Versionado semántico:**
- ✅ `1.0.0` → Primera versión estable
- ✅ `1.1.0` → Nueva funcionalidad
- ✅ `1.0.1` → Bug fix

#### **3. Testing regular:**
- ✅ Tests automatizados
- ✅ Verificación manual mensual
- ✅ Load testing trimestral

---

## 📞 **SOPORTE Y CONTACTO**

### **🆘 En caso de problemas:**

1. **Verificar logs** en Supabase Dashboard
2. **Consultar esta documentación** para troubleshooting
3. **Ejecutar tests** de compilación
4. **Verificar variables** de entorno

### **📚 Recursos adicionales:**

- **Supabase Docs:** https://supabase.com/docs/guides/functions
- **Deno Manual:** https://deno.land/manual
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

### **🔧 Mantenimiento programado:**

- **Mensual:** Verificación de logs y métricas
- **Trimestral:** Actualización de dependencias
- **Semestral:** Revisión de seguridad y performance

---

## 📝 **CHANGELOG**

### **v1.0.0 (2025-08-02)**
- ✅ Implementación inicial PersonaNatural
- ✅ Implementación inicial PersonaJuridica
- ✅ Integración con API Perú
- ✅ Arquitectura Clean Architecture
- ✅ Configuración centralizada
- ✅ Manejo robusto de errores
- ✅ Documentación técnica completa

---

**📝 Documento actualizado:** 2025-08-02
**👥 Mantenido por:** Equipo de Desarrollo
**📧 Contacto:** [email de soporte]
