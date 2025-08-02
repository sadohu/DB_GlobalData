# 🚀 GUÍA RÁPIDA DE USO - Edge Functions

## ⚡ **INICIO RÁPIDO**

### **🔑 Configuración Básica**
```bash
# 1. Obtener credenciales
ANON_KEY="tu_anon_key_de_supabase"
PROJECT_URL="https://ulscandvwzjqluxpwovv.supabase.co"

# 2. Headers para todas las peticiones
Authorization: Bearer $ANON_KEY
Content-Type: application/json
```

### **📱 URLs de Endpoints**
```bash
# PersonaNatural (DNI)
https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural

# PersonaJuridica (RUC)  
https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica
```

---

## 👤 **PERSONA NATURAL (DNI)**

### **🔍 Buscar por DNI**
```bash
curl "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural?dni=12345678" \
  -H "Authorization: Bearer $ANON_KEY"
```

### **📜 Listar Todas**
```bash
curl "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural?action=all&limit=50" \
  -H "Authorization: Bearer $ANON_KEY"
```

### **🔎 Buscar por Nombre**
```bash
curl "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural?action=search&q=JUAN&limit=20" \
  -H "Authorization: Bearer $ANON_KEY"
```

### **➕ Crear Nueva Persona**
```bash
curl -X POST "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "nombres": "MARIA ELENA",
    "apellido_paterno": "RODRIGUEZ", 
    "apellido_materno": "SILVA",
    "numero_documento": "87654321",
    "correo": "maria@email.com",
    "telefono": "987654321"
  }'
```

### **✏️ Actualizar Persona**
```bash
curl -X PUT "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural?id=1" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "nuevo@email.com",
    "telefono": "123456789"
  }'
```

### **🗑️ Eliminar Persona**
```bash
curl -X DELETE "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural?id=1" \
  -H "Authorization: Bearer $ANON_KEY"
```

---

## 🏢 **PERSONA JURÍDICA (RUC)**

### **🔍 Buscar por RUC**
```bash
curl "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?ruc=20123456789" \
  -H "Authorization: Bearer $ANON_KEY"
```

### **📜 Listar Todas las Empresas**
```bash
curl "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?action=all&limit=50" \
  -H "Authorization: Bearer $ANON_KEY"
```

### **🔎 Buscar por Razón Social**
```bash
curl "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?action=search&q=TECNOLOGIA&limit=20" \
  -H "Authorization: Bearer $ANON_KEY"
```

### **➕ Crear Nueva Empresa**
```bash
curl -X POST "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "razon_social": "MI EMPRESA TECNOLOGICA SAC",
    "numero_documento": "20987654321",
    "nombre_comercial": "TechCorp",
    "tipo_empresa": "SAC",
    "actividad_economica": "Desarrollo de software",
    "correo": "contacto@techcorp.pe",
    "telefono": "987654321",
    "direccion_fiscal": "AV. TECNOLOGIA 123, LIMA",
    "estado_legal": "ACTIVO"
  }'
```

### **✏️ Actualizar Empresa**
```bash
curl -X PUT "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?id=1" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "razon_social": "MI EMPRESA ACTUALIZADA SAC",
    "correo": "nuevo@empresa.pe",
    "telefono": "123456789"
  }'
```

### **🗑️ Eliminar Empresa**
```bash
curl -X DELETE "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?id=1" \
  -H "Authorization: Bearer $ANON_KEY"
```

---

## 🌐 **EJEMPLOS CON JAVASCRIPT/FETCH**

### **🔍 Buscar DNI**
```javascript
const response = await fetch(
  'https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural?dni=12345678',
  {
    headers: {
      'Authorization': 'Bearer YOUR_ANON_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data);
```

### **🔍 Buscar RUC**
```javascript
const response = await fetch(
  'https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?ruc=20123456789',
  {
    headers: {
      'Authorization': 'Bearer YOUR_ANON_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data);
```

### **➕ Crear Persona**
```javascript
const response = await fetch(
  'https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_ANON_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombres: 'CARLOS LUIS',
      apellido_paterno: 'MARTINEZ',
      apellido_materno: 'LOPEZ',
      numero_documento: '98765432',
      correo: 'carlos@email.com'
    })
  }
);

const data = await response.json();
console.log(data);
```

---

## 📱 **EJEMPLOS CON REACT/AXIOS**

### **🔍 Hook para buscar DNI**
```jsx
import { useState } from 'react';
import axios from 'axios';

const useDNI = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const buscarDNI = async (dni) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural?dni=${dni}`,
        {
          headers: {
            'Authorization': 'Bearer YOUR_ANON_KEY'
          }
        }
      );
      
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return { buscarDNI, loading, data, error };
};

// Componente de ejemplo
const BuscadorDNI = () => {
  const { buscarDNI, loading, data, error } = useDNI();
  const [dni, setDni] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dni.length === 8) {
      buscarDNI(dni);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Ingrese DNI (8 dígitos)"
          maxLength={8}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {data && (
        <div className="resultado">
          <h3>{data.data.nombres} {data.data.apellido_paterno}</h3>
          <p>DNI: {data.data.numero_documento}</p>
        </div>
      )}
    </div>
  );
};
```

### **🔍 Hook para buscar RUC**
```jsx
const useRUC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const buscarRUC = async (ruc) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?ruc=${ruc}`,
        {
          headers: {
            'Authorization': 'Bearer YOUR_ANON_KEY'
          }
        }
      );
      
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return { buscarRUC, loading, data, error };
};
```

---

## 🐍 **EJEMPLOS CON PYTHON**

### **🔍 Buscar DNI**
```python
import requests

def buscar_dni(dni):
    url = "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural"
    headers = {
        "Authorization": "Bearer YOUR_ANON_KEY",
        "Content-Type": "application/json"
    }
    params = {"dni": dni}
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None

# Uso
resultado = buscar_dni("12345678")
if resultado:
    print(f"Nombre: {resultado['data']['nombres']}")
```

### **🔍 Buscar RUC**
```python
def buscar_ruc(ruc):
    url = "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica"
    headers = {
        "Authorization": "Bearer YOUR_ANON_KEY",
        "Content-Type": "application/json"
    }
    params = {"ruc": ruc}
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None

# Uso
resultado = buscar_ruc("20123456789")
if resultado:
    print(f"Empresa: {resultado['data']['razon_social']}")
```

### **➕ Crear Persona**
```python
def crear_persona(datos_persona):
    url = "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural"
    headers = {
        "Authorization": "Bearer YOUR_ANON_KEY",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=datos_persona)
    
    if response.status_code == 201:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None

# Uso
nueva_persona = {
    "nombres": "ANA LUCIA",
    "apellido_paterno": "TORRES",
    "apellido_materno": "VASQUEZ",
    "numero_documento": "11223344",
    "correo": "ana@email.com"
}

resultado = crear_persona(nueva_persona)
```

---

## 🔧 **VALIDACIONES Y ERRORES**

### **✅ Validaciones de Entrada**

#### **DNI:**
- ✅ Exactamente 8 dígitos
- ✅ Solo números
- ✅ Campo requerido

```javascript
const validarDNI = (dni) => {
  const regex = /^\d{8}$/;
  return regex.test(dni);
};
```

#### **RUC:**
- ✅ Exactamente 11 dígitos
- ✅ Solo números
- ✅ Campo requerido

```javascript
const validarRUC = (ruc) => {
  const regex = /^\d{11}$/;
  return regex.test(ruc);
};
```

### **❌ Códigos de Error Comunes**

#### **400 - Bad Request**
```json
{
  "error": "DNI debe tener exactamente 8 dígitos numéricos",
  "success": false,
  "status": 400,
  "code": "VALIDATION_ERROR"
}
```

#### **401 - Unauthorized**
```json
{
  "error": "Token de autorización requerido",
  "success": false,
  "status": 401,
  "code": "UNAUTHORIZED"
}
```

#### **404 - Not Found**
```json
{
  "error": "No se encontró la persona natural",
  "success": false,
  "status": 404,
  "code": "NOT_FOUND"
}
```

---

## 🧪 **TESTING RÁPIDO**

### **🔍 Verificar que todo funciona**
```bash
# Test básico DNI (debería funcionar)
curl "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural?dni=12345678" \
  -H "Authorization: Bearer $ANON_KEY"

# Test DNI inválido (debería dar error 400)
curl "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural?dni=123" \
  -H "Authorization: Bearer $ANON_KEY"

# Test básico RUC (debería funcionar)
curl "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaJuridica?ruc=20123456789" \
  -H "Authorization: Bearer $ANON_KEY"

# Test sin autorización (debería dar error 401)
curl "https://ulscandvwzjqluxpwovv.supabase.co/functions/v1/getPersonaNatural?dni=12345678"
```

### **📊 Respuestas Esperadas**

#### **✅ Exitosa (200)**
```json
{
  "data": {
    "id": 1,
    "nombres": "JUAN CARLOS",
    "apellido_paterno": "PEREZ",
    "numero_documento": "12345678"
  },
  "success": true,
  "status": 200
}
```

#### **❌ Error de validación (400)**
```json
{
  "error": "DNI debe tener exactamente 8 dígitos numéricos",
  "success": false,
  "status": 400,
  "code": "VALIDATION_ERROR"
}
```

---

## 🚀 **OPTIMIZACIONES**

### **⚡ Cache en Frontend**
```javascript
// Cache simple con localStorage
const cacheKey = `persona_${dni}`;
const cached = localStorage.getItem(cacheKey);

if (cached) {
  const data = JSON.parse(cached);
  // Verificar si no ha expirado (ej: 1 hora)
  if (Date.now() - data.timestamp < 3600000) {
    return data.persona;
  }
}

// Si no hay cache, consultar API
const persona = await buscarDNI(dni);
localStorage.setItem(cacheKey, JSON.stringify({
  persona,
  timestamp: Date.now()
}));
```

### **🔄 Retry con backoff**
```javascript
const buscarConReintentos = async (dni, maxReintentos = 3) => {
  for (let intento = 1; intento <= maxReintentos; intento++) {
    try {
      return await buscarDNI(dni);
    } catch (error) {
      if (intento === maxReintentos) throw error;
      
      // Esperar antes del siguiente intento (exponential backoff)
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, intento) * 1000)
      );
    }
  }
};
```

### **📊 Batch requests**
```javascript
const buscarMultiplesDNI = async (dnis) => {
  const promises = dnis.map(dni => buscarDNI(dni));
  return await Promise.allSettled(promises);
};
```

---

## 📝 **NOTAS IMPORTANTES**

### **⚠️ Limitaciones**
- **Rate Limit:** 100 requests por minuto por IP
- **Timeout:** 30 segundos por request
- **Tamaño máximo:** 1MB por request
- **Concurrencia:** Máximo 50 requests simultáneos

### **💡 Mejores Prácticas**
- ✅ **Cache** resultados en frontend para evitar requests duplicados
- ✅ **Validar** entrada antes de enviar request
- ✅ **Manejar errores** apropiadamente
- ✅ **Usar timeout** en requests
- ✅ **Implementar retry** para requests críticos

### **🔐 Seguridad**
- ❌ **NUNCA** exponer anon_key en código cliente público
- ✅ **USAR** variables de entorno
- ✅ **ROTAR** tokens periódicamente
- ✅ **MONITOREAR** uso de API

---

**📝 Documento actualizado:** 2025-08-02  
**🔄 Versión:** 1.0.0  
**📧 Soporte:** [email de soporte]
