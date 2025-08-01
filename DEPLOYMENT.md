# Guía de Despliegue en Producción

## 🔐 Seguridad

### Variables de Entorno Requeridas

Configura estas variables en Supabase Dashboard > Settings > Edge Functions:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_real
APIS_PERU_TOKEN=tu_token_apis_peru_real
```

### ⚠️ IMPORTANTE: Nunca commites estos valores al repositorio

## 🚀 Pasos de Despliegue

### 1. Preparar el proyecto

```bash
# Clonar repositorio
git clone <tu-repo>
cd project_data

# Instalar Supabase CLI
npm install -g @supabase/cli

# Login a Supabase
supabase login
```

### 2. Configurar proyecto Supabase

```bash
# Crear nuevo proyecto o vincular existente
supabase link --project-ref tu_proyecto_id

# Aplicar migraciones de base de datos (si las hay)
supabase db push
```

### 3. Configurar base de datos

Ejecuta el siguiente SQL en tu base de datos:

```sql
-- Crear tabla persona_natural
CREATE TABLE IF NOT EXISTS persona_natural (
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

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_persona_natural_dni ON persona_natural(numero_documento);
CREATE INDEX IF NOT EXISTS idx_persona_natural_nombres ON persona_natural(nombres, apellido_paterno, apellido_materno);

-- Configurar Row Level Security (RLS)
ALTER TABLE persona_natural ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a usuarios autenticados
CREATE POLICY "Permitir lectura a usuarios autenticados" ON persona_natural
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir inserción a usuarios autenticados
CREATE POLICY "Permitir inserción a usuarios autenticados" ON persona_natural
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir actualización a usuarios autenticados
CREATE POLICY "Permitir actualización a usuarios autenticados" ON persona_natural
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir eliminación a usuarios autenticados
CREATE POLICY "Permitir eliminación a usuarios autenticados" ON persona_natural
    FOR DELETE USING (auth.role() = 'authenticated');
```

### 4. Configurar variables de entorno

En Supabase Dashboard:
1. Ve a Settings > Edge Functions
2. Agrega las variables de entorno:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `APIS_PERU_TOKEN`

### 5. Desplegar Edge Function

```bash
supabase functions deploy getPersonaNatural
```

### 6. Probar despliegue

```bash
# Obtener URL y anon key de tu proyecto
curl "https://tu-proyecto.supabase.co/functions/v1/getPersonaNatural?dni=12345678" \
  -H "Authorization: Bearer tu_anon_key"
```

## 🔧 Configuración de CORS (Opcional)

Si necesitas restringir CORS para mayor seguridad, modifica `index.ts`:

```typescript
// En lugar de '*', especifica tu dominio
'Access-Control-Allow-Origin': 'https://tu-dominio.com',
```

## 📊 Monitoreo

### Logs de funciones

Ve a Supabase Dashboard > Edge Functions > Logs para monitorear:
- Errores de runtime
- Performance
- Uso de memoria

### Métricas importantes

- Tiempo de respuesta
- Tasa de errores
- Uso de memoria
- Invocaciones por minuto

## 🔄 Actualizaciones

Para actualizar la función:

```bash
# Hacer cambios al código
git pull origin master

# Redesplegar manualmente (recomendado para evitar gastos)
supabase functions deploy getPersonaNatural
```

## 🆘 Troubleshooting

### Error 404
- Verificar que la función esté desplegada
- Comprobar la URL del endpoint

### Error 401/403
- Verificar el token de autorización
- Comprobar las políticas RLS

### Error 500
- Revisar logs en Dashboard
- Verificar variables de entorno
- Comprobar conexión a base de datos

### Error de UUID
- Verificar que los campos UUID tengan formato válido
- Usar '00000000-0000-0000-0000-000000000000' para sistema
