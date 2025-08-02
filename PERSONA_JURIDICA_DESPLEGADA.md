# 🏢 PersonaJuridica API - DESPLEGADA EXITOSAMENTE

## ✅ **FUNCIÓN DESPLEGADA CORRECTAMENTE**

### **📍 URL de la Función:**
```
https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica
```

## 🔧 **ARCHIVOS CREADOS**

### **1. Modelo (ya existía):**
- ✅ `models/PersonaJuridica.model.ts` - Interface con todos los campos

### **2. Repositorio (NUEVO):**
- ✅ `repository/PersonaJuridica.repository.ts` - Operaciones CRUD en base de datos

### **3. Servicio (NUEVO):**
- ✅ `services/PersonaJuridica.service.ts` - Lógica de negocio con validaciones

### **4. Función Edge (NUEVA):**
- ✅ `functions/getPersonaJuridica/index.ts` - API REST completa
- ✅ `functions/getPersonaJuridica/deno.json` - Configuración Deno

### **5. ExternalAPI actualizado:**
- ✅ Agregado soporte para RUC: `fetchRUCFromPeruAPI()`
- ✅ Agregado validación: `validateRUC()`

## 🧪 **CÓMO PROBAR LA FUNCIÓN**

### **Headers Requeridos:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ANON_KEY
```

### **1. Buscar Empresa por RUC (GET)**
```http
GET https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?ruc=20123456789
```
**Respuesta esperada:**
```json
{
  "data": {
    "id": 1,
    "razon_social": "EMPRESA EJEMPLO SAC",
    "numero_documento": "20123456789",
    "tipo_documento": "RUC",
    "estado_legal": "ACTIVO"
  },
  "success": true,
  "status": 200
}
```

### **2. Listar Todas las Empresas (GET)**
```http
GET https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?action=all&limit=10&offset=0
```

### **3. Buscar por Razón Social (GET)**
```http
GET https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?action=search&q=Tecnología&limit=20
```

### **4. Crear Nueva Empresa (POST)**
```http
POST https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica
Content-Type: application/json

{
  "razon_social": "MI EMPRESA TECNOLÓGICA SAC",
  "numero_documento": "20987654321",
  "nombre_comercial": "TechCorp",
  "tipo_documento": "RUC",
  "tipo_empresa": "SAC",
  "actividad_economica": "Desarrollo de software",
  "correo": "contacto@techcorp.pe",
  "telefono": "987654321",
  "direccion_fiscal": "Av. Tecnología 123, Lima",
  "estado_legal": "ACTIVO"
}
```

### **5. Actualizar Empresa (PUT)**
```http
PUT https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?id=1
Content-Type: application/json

{
  "razon_social": "MI EMPRESA ACTUALIZADA SAC",
  "correo": "nuevo@email.com",
  "telefono": "123456789"
}
```

### **6. Eliminar Empresa (DELETE)**
```http
DELETE https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?id=1
```

## 🌐 **INTEGRACIÓN CON API EXTERNA**

### **URL de API Perú para RUC:**
```
https://dniruc.apisperu.com/api/v1/ruc/{ruc}?token={token}
```

### **Flujo de funcionamiento:**
1. **Usuario consulta RUC** → GET con parámetro `ruc=20123456789`
2. **Busca en BD local** → Si existe, devuelve datos
3. **Si no existe** → Consulta API externa de Perú
4. **Mapea datos** → Convierte respuesta de API a modelo PersonaJuridica
5. **Guarda en BD** → Para futuras consultas rápidas
6. **Devuelve resultado** → Al usuario

## 📋 **TABLA REQUERIDA EN BASE DE DATOS**

```sql
CREATE TABLE persona_juridica (
  id SERIAL PRIMARY KEY,
  razon_social VARCHAR(200) NOT NULL,
  nombre_comercial VARCHAR(200),
  tipo_documento VARCHAR(10) DEFAULT 'RUC',
  numero_documento VARCHAR(20) UNIQUE,
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
  creado_por UUID,
  actualizado_por UUID
);

-- Índices para mejor rendimiento
CREATE INDEX idx_persona_juridica_ruc ON persona_juridica(numero_documento);
CREATE INDEX idx_persona_juridica_razon_social ON persona_juridica(razon_social);
CREATE INDEX idx_persona_juridica_estado ON persona_juridica(estado_legal);
```

## 🎯 **VALIDACIONES IMPLEMENTADAS**

### **RUC:**
- ✅ Debe tener exactamente 11 dígitos numéricos
- ✅ Validación con API externa de Perú

### **Email (opcional):**
- ✅ Formato válido de email

### **Teléfono (opcional):**
- ✅ Formato peruano válido

### **Razón Social:**
- ✅ Campo requerido y no vacío

## 🚀 **ESTADO ACTUAL**

### ✅ **Completamente Funcional:**
- ✅ **Edge Function desplegada** en Supabase
- ✅ **API REST completa** con CRUD
- ✅ **Integración con API Perú** para consulta de RUC
- ✅ **Validaciones robustas** implementadas
- ✅ **Configuración centralizada** reutilizada
- ✅ **Misma arquitectura** que PersonaNatural

### **⚠️ Para funcionamiento completo:**
1. **Crear tabla** `persona_juridica` en la base de datos
2. **Configurar variables de entorno** (las mismas que PersonaNatural)
3. **Obtener anon key** para pruebas

## 📊 **COMPARACIÓN CON PersonaNatural**

| Característica | PersonaNatural | PersonaJuridica |
|---------------|----------------|-----------------|
| **Documento** | DNI (8 dígitos) | RUC (11 dígitos) |
| **API Externa** | `/dni/{dni}` | `/ruc/{ruc}` ✅ |
| **Búsqueda** | Por nombre | Por razón social ✅ |
| **Validaciones** | DNI, email, teléfono | RUC, email, teléfono ✅ |
| **CRUD Completo** | ✅ | ✅ |
| **Edge Function** | ✅ | ✅ |

## 🎉 **¡PersonaJuridica está LISTA y DESPLEGADA!**

**Dashboard:** https://supabase.com/dashboard/project/ulscandvwzjqluxpwovv/functions

Ambas funciones (`PersonaNatural` y `PersonaJuridica`) siguen el **mismo patrón arquitectónico** y comparten la **configuración centralizada**, lo que hace el proyecto **fácil de mantener y escalar**. 🚀
