# 📝 Prompts Utilizados - Asistencia con IA

**Proyecto:** Sistema de Gestión de Terceros - Speedy ERP  
**Asistente IA:** Claude (Anthropic)  
**Desarrollador:** [Tu Nombre]  
**Fecha:** 8 de febrero de 2026  
**Repositorio:** [URL del repositorio]

---

## 📋 Índice

1. [Contexto y Planificación](#contexto-y-planificación)
2. [Desarrollo Backend](#desarrollo-backend)
3. [Desarrollo Frontend](#desarrollo-frontend)
4. [Debugging y Resolución de Problemas](#debugging-y-resolución-de-problemas)
5. [Consultas de Aprendizaje](#consultas-de-aprendizaje)
6. [Metodología y Reflexión](#metodología-y-reflexión)

---

## 🎯 Contexto y Planificación

### Prompt Inicial - Definición del Proyecto
```
Necesito desarrollar una aplicación fullstack para gestionar terceros (socios de negocio) 
que integre con iDempiere ERP sobre Oracle Database.

Stack requerido:
- Backend: Node.js + Express
- Frontend: React + Vite
- Base de Datos: Oracle Database

Credenciales de conexión:
- Host: 190.99.72.176
- Puerto: 1521
- SID: RSA
- Usuario: idebis
- Password: [confidencial]

Requerimientos funcionales:
1. Consultar y listar terceros existentes
2. Registrar nuevos terceros
3. Validar RUC/Cédula ecuatoriana con algoritmos oficiales
4. Búsqueda por nombre o identificación
5. Prevenir SQL Injection (prepared statements)
6. Arquitectura MVC desacoplada

Requerimientos técnicos:
- Tabla principal: C_BPARTNER
- Filtro obligatorio: AD_CLIENT_ID = 11, ISACTIVE = 'Y'
- IDs generados en rango 1000-5000
- Campos de auditoría automáticos

Mi nivel: Intermedio. Necesito guía paso a paso, no solo código.
```

**Resultado:** Plan de desarrollo estructurado en 5 fases con checkpoints de validación.

---

## 🔧 Desarrollo Backend

### Prompt 1 - Estructura del Proyecto
```
Ayúdame a configurar el proyecto backend desde cero:

1. Crear estructura de carpetas siguiendo patrón MVC
2. Inicializar npm y configurar package.json
3. Instalar dependencias necesarias (express, oracledb, dotenv, etc.)
4. Configurar archivo .env con las credenciales
5. Crear servidor Express básico con health check

Explica cada paso y por qué es necesario.
```

**Resultado:** Estructura `/backend` con carpetas `/src/config`, `/src/models`, `/src/controllers`, `/src/routes`, `/src/utils`.

---

### Prompt 2 - Conexión a Oracle Database
```
Necesito configurar la conexión a Oracle Database usando el paquete oracledb.

Requisitos:
- Pool de conexiones (no conexiones individuales)
- Configuración desde variables de entorno
- Funciones: initialize(), close(), getPool()
- Manejo de errores robusto
- Logging para debugging

Explica qué es un pool de conexiones y por qué usarlo en lugar de 
conexiones directas.
```

**Resultado:** Archivo `/backend/src/config/database.js` con pool configurado.

---

### Prompt 3 - Debug Error NJS-125
```
Obtuve este error al intentar inicializar la conexión:

Error: NJS-125: "connectString" cannot be empty

Mi código actual:
[código del archivo database.js compartido]

Mi archivo .env:
[contenido del .env compartido]

¿Qué está causando este error y cómo lo soluciono?
```

**Resultado:** Identificación del problema (archivo .env no en la ubicación correcta, espacios alrededor del `=`). Solución aplicada exitosamente.

---

### Prompt 4 - Validador RUC/Cédula Ecuatoriana
```
Necesito implementar validación de RUC y Cédula ecuatoriana siguiendo 
los algoritmos oficiales del SRI (Servicio de Rentas Internas de Ecuador).

Tipos a validar:
1. Cédula: 10 dígitos, algoritmo módulo 10, provincia válida (01-24)
2. RUC persona natural: cédula + "001"
3. RUC sociedad privada: 13 dígitos, tercer dígito = 9, módulo 11
4. RUC entidad pública: 13 dígitos, tercer dígito = 6, módulo 11

Requisitos:
- Función validateTaxID(taxId) que retorne {valid, type, message}
- Validación de provincia en primeros 2 dígitos
- Cálculo correcto del dígito verificador
- Mensajes de error descriptivos

Proporciona el algoritmo completo con explicación paso a paso.
```

**Resultado:** Archivo `/backend/src/utils/validators.js` con validación completa y probada.

---

### Prompt 5 - Modelo BPartnerModel
```
Necesito crear el modelo para gestionar terceros con estos métodos:

1. getAll(searchTerm)
   - Listar todos los terceros
   - Filtro obligatorio: AD_CLIENT_ID = 11, ISACTIVE = 'Y'
   - Búsqueda opcional por NAME o TAXID (LIKE con UPPER)
   - JOIN con C_BP_GROUP para traer nombre del grupo
   - Usar prepared statements con bind variables

2. generateNewId()
   - Buscar MAX(C_BPARTNER_ID) en rango 1000-5000
   - Incrementar +1
   - Si excede 5000, volver a 1000
   - Verificar disponibilidad del ID

3. create(data)
   - Generar ID automáticamente
   - Insertar nuevo tercero
   - Campos de auditoría: CREATED, CREATEDBY, UPDATED, UPDATEDBY (usar SYSDATE y valores del .env)
   - Flags: ISCUSTOMER='Y', resto='N'
   - Commit si éxito, rollback si error
   - Cerrar conexión en finally

4. getGroups()
   - Listar grupos activos (AD_CLIENT_ID = 11, ISACTIVE = 'Y')

IMPORTANTE: Usar prepared statements en todas las queries para prevenir SQL Injection.
Explica qué son los prepared statements y cómo funcionan.
```

**Resultado:** Archivo `/backend/src/models/BPartnerModel.js` con clase completa.

---

### Prompt 6 - Controlador y Rutas
```
Necesito crear:

1. Controlador BPartnerController con métodos:
   - getAll(req, res): GET /api/bpartners?search=term
   - create(req, res): POST /api/bpartners
   - getGroups(req, res): GET /api/bpartners/groups

2. Validaciones:
   - Campos obligatorios: value, name, taxId, groupId
   - Validar formato RUC/Cédula usando validateTaxID()

3. Manejo de errores Oracle específicos:
   - ORA-00001: Constraint unique violation → 409 Conflict
   - ORA-02291: Foreign key violation → 400 Bad Request
   - Otros errores → 500 Internal Server Error

4. Rutas en Express:
   - Definir endpoints REST
   - Integrar controlador
   - Configurar en server.js

5. Middlewares:
   - helmet (seguridad)
   - cors
   - express.json()
   - logging de requests

Proporciona código completo con comentarios explicativos.
```

**Resultado:** Archivos `/backend/src/controllers/BPartnerController.js` y `/backend/src/routes/index.js` creados. Server.js actualizado con integración completa.

---

### Prompt 7 - Testing del Backend
```
El backend está completo. ¿Cómo puedo probar el endpoint POST /api/bpartners?

Necesito:
1. Opciones de herramientas (cURL, Postman, Thunder Client, etc.)
2. Ejemplos de comandos cURL para Linux y Windows
3. Datos de prueba válidos con cédulas ecuatorianas reales
4. Explicación de qué respuestas esperar (201, 400, 409, 500)

Dame múltiples alternativas para que pueda elegir la más conveniente.
```

**Resultado:** Guía completa de testing con ejemplos de cURL, recomendación de Thunder Client, y archivo HTML de prueba standalone.

---

### Prompt 8 - Debug Error ORA-01400
```
Intenté crear un tercero y obtuve este error:

{
    "success": false,
    "message": "Error al crear nuevo tercero",
    "error": "ORA-01400: no se puede realizar una inserción NULL en (\"IDEBIS\".\"C_BPARTNER\".\"C_BPARTNER_ID\")"
}

Mi código en BPartnerModel.create():
[código compartido]

¿Qué está causando que el ID sea NULL y cómo lo soluciono?
```

**Resultado:** Identificación del problema (uso incorrecto de `this.generateNewId()` en método estático). Corrección: cambiar a `BPartnerModel.generateNewId()`. Debug logs agregados.

---

## 🎨 Desarrollo Frontend

### Prompt 9 - Setup React con Vite y Tailwind
```
Ahora vamos con el frontend usando React + Vite + Tailwind CSS.

Pasos necesarios:
1. Inicializar proyecto React con Vite en carpeta /frontend
2. Instalar y configurar Tailwind CSS 4.x (NO usar CSS tradicional)
3. Instalar Axios para llamadas HTTP
4. Configurar vite.config.js con:
   - Proxy para /api → http://localhost:3000
   - Puerto 5173
5. Estructura básica de carpetas: /src/components, /src/services

Proporciona comandos exactos y archivos de configuración completos.
```

**Resultado:** Proyecto React inicializado con Tailwind CSS configurado correctamente.

---

### Prompt 10 - Servicio API con Axios
```
Crea el servicio api.js para comunicación con el backend.

Requisitos:
1. Configuración base de Axios:
   - baseURL: http://localhost:3000/api
   - headers: Content-Type application/json

2. Interceptores:
   - Request: logging de método y URL con emojis (🔵)
   - Response: logging de status (🟢 éxito, 🔴 error)

3. Objeto bpartnerService con métodos:
   - getAll(searchTerm): GET /bpartners?search=term
   - create(data): POST /bpartners
   - getGroups(): GET /bpartners/groups

4. Manejo de errores:
   - try/catch en cada método
   - throw error.response?.data || error

Usa sintaxis moderna (async/await, arrow functions).
```

**Resultado:** Archivo `/frontend/src/services/api.js` con interceptores y servicio completo.

---

### Prompt 11 - Componente BPartnerList
```
Necesito el componente BPartnerList.jsx usando Tailwind CSS.

Funcionalidades:
1. Estado:
   - bpartners: array de terceros
   - loading: boolean para spinner
   - error: string con mensaje de error
   - searchTerm: string para búsqueda

2. useEffect:
   - Cargar datos al montar componente
   - Recargar cuando cambie refreshTrigger (prop)

3. Funciones:
   - fetchBPartners(search): llamar a bpartnerService.getAll()
   - handleSearch(e): submit del formulario de búsqueda
   - handleClearSearch(): limpiar búsqueda

4. UI con Tailwind:
   - Loading: spinner animado centrado
   - Formulario de búsqueda: input + botón "Buscar" + botón "Limpiar"
   - Tabla responsive: código, nombre, RUC/Cédula, teléfono, email, grupo
   - Hover effects en filas
   - Badge azul para el código
   - Mensaje si no hay datos
   - Alert rojo si hay error

5. Props:
   - refreshTrigger: para refrescar desde componente padre

Dame el componente completo con clases de Tailwind optimizadas.
```

**Resultado:** Componente `/frontend/src/components/BPartnerList.jsx` con diseño responsive y funcional.

---

### Prompt 12 - Componente BPartnerForm
```
Crea el componente BPartnerForm.jsx con Tailwind CSS.

Funcionalidades:
1. Estado:
   - formData: {value, name, taxId, groupId}
   - groups: array de grupos desde API
   - loading, loadingGroups: estados de carga
   - error, success: mensajes
   - validationErrors: objeto con errores por campo

2. useEffect:
   - Cargar grupos al montar (fetchGroups)

3. Validaciones en validateForm():
   - value: obligatorio
   - name: obligatorio
   - taxId: obligatorio, solo números, 10 o 13 dígitos
   - groupId: obligatorio

4. Funciones:
   - handleChange(e): actualizar formData y limpiar error del campo
   - handleSubmit(e): validar, llamar a bpartnerService.create(), mostrar éxito
   - handleClear(): resetear formulario
   - fetchGroups(): cargar grupos desde API

5. UI con Tailwind:
   - Campos: input type="text" con labels y asterisco rojo (*)
   - Select dinámico con grupos desde API
   - Validación visual: borde rojo si error
   - Mensajes de error debajo de cada campo
   - Alert verde para éxito, rojo para error
   - Botones: "Guardar Tercero" (verde), "Limpiar" (gris)
   - Deshabilitar mientras loading

6. Props:
   - onSuccess: callback para refrescar listado (ejecutar después de 1.5s)

Dame el componente completo con validación robusta.
```

**Resultado:** Componente `/frontend/src/components/BPartnerForm.jsx` con formulario completo y validaciones.

---

### Prompt 13 - App.jsx Principal
```
Integra todo en App.jsx con sistema de tabs.

Requisitos:
1. Estado:
   - refreshTrigger: contador para refrescar listado
   - activeTab: 'list' | 'create'

2. Funciones:
   - handleFormSuccess(): incrementar refreshTrigger, cambiar a tab 'list' después de 2s

3. UI con Tailwind:
   - Header: título "🚀 Speedy ERP" + subtítulo
   - Tabs: "📋 Listado" y "➕ Nuevo Tercero"
     * Tab activo: borde azul inferior, texto azul
     * Tab inactivo: transparente, texto gris, hover gris
   - Main: renderizar BPartnerList o BPartnerForm según activeTab
   - Footer: "Prueba Técnica - Departamento de Tecnología e Innovación" + © 2026 Speedy

4. Layout:
   - Container max-width 7xl, centrado
   - Background gris claro (bg-gray-50)
   - Padding responsive

5. Props:
   - Pasar refreshTrigger a BPartnerList
   - Pasar handleFormSuccess a BPartnerForm

Dame el componente completo con diseño profesional.
```

**Resultado:** Archivo `/frontend/src/App.jsx` con integración completa y navegación por tabs.

---

## 🐛 Debugging y Resolución de Problemas

### Prompt 14 - Pantalla en Blanco
```
He completado todo el frontend pero no aparece nada en la pantalla.
Revisa estos archivos y encuentra los errores:

[Compartí el contenido de:]
- frontend/src/services/api.js
- frontend/src/components/BPartnerList.jsx
- frontend/src/components/BPartnerForm.jsx
- frontend/src/App.jsx
- frontend/src/main.jsx
- frontend/vite.config.js
- frontend/package.json

¿Qué está fallando? Dame una lista de errores encontrados con:
1. Archivo y línea
2. Error específico
3. Corrección necesaria
```

**Resultado IA identificó:**

1. **api.js líneas 2-3:** Imports incorrectos de rutas del backend
```javascript
   // ❌ INCORRECTO
   import { get, search } from '../../../backend/src/routes';
   import { create } from '../../../backend/src/models/BPartnerModel';
   
   // ✅ CORRECTO: eliminar estas líneas
```

2. **BPartnerList.jsx línea 18:** Variable `search` no definida
```javascript
   // ❌ INCORRECTO
   const response = await bpartnerService.getAll(search);
   
   // ✅ CORRECTO
   const response = await bpartnerService.getAll(searchTerm);
```

3. **BPartnerList.jsx línea 27:** Nombre de función inconsistente
```javascript
   // ❌ INCORRECTO
   const handleSearchChange = () => { ... }
   
   // ✅ CORRECTO
   const handleClearSearch = () => { ... }
```

4. **BPartnerList.jsx línea 53:** Clase CSS inválida
```javascript
   // ❌ INCORRECTO
   className="flex-1 min-w-50 ..."
   
   // ✅ CORRECTO
   className="flex-1 min-w-[200px] ..."
```

5. **BPartnerForm.jsx línea 9:** Inconsistencia en nombres
```javascript
   // ❌ INCORRECTO (mezcla de taxid y taxId)
   const [formData, setFormData] = useState({
     taxid: '',  // minúscula
   });
   
   // Luego se usa: formData.taxId  // camelCase
   
   // ✅ CORRECTO: usar siempre camelCase
   taxId: '',
```

6. **BPartnerForm.jsx línea 50:** Referencia a propiedad incorrecta
```javascript
   // ❌ INCORRECTO
   } else if (!/^\d+$/.test(formData.taxId)) {
     errors.taxId = '...';  // Luego se guarda en errors.taxId
   } else if (formData.taxId.length !== 10...) {
     errors.taxId = '...';  // Correcto aquí
   }
   
   // Pero en línea 9 era: taxid (minúscula)
   // Debe ser consistente en todo el archivo
```

7. **BPartnerList.jsx línea 44:** Error de tipeo en clase
```javascript
   // ❌ INCORRECTO
   <div className="gb-white rounded-lg shadow p-6">
   
   // ✅ CORRECTO
   <div className="bg-white rounded-lg shadow p-6">
```

---

### Prompt 15 - Archivos Corregidos
```
Dame los 3 archivos completamente corregidos para que pueda reemplazarlos:

1. frontend/src/services/api.js (sin imports incorrectos)
2. frontend/src/components/BPartnerList.jsx (todas las correcciones aplicadas)
3. frontend/src/components/BPartnerForm.jsx (consistencia en taxId)

Incluye TODO el código de cada archivo, no solo las correcciones.
```

**Resultado:** 3 archivos completos con todas las correcciones aplicadas. Aplicación funcionando correctamente.

---

## 📚 Consultas de Aprendizaje

Durante el desarrollo, realicé estas consultas conceptuales para comprender mejor las tecnologías:

### Consulta 1 - Pool de Conexiones
```
¿Qué es un pool de conexiones en Oracle y por qué es mejor que crear 
conexiones individuales? ¿Cuáles son los parámetros importantes 
(min, max, increment)?
```

### Consulta 2 - Prepared Statements
```
Explica en detalle qué son los prepared statements y cómo previenen 
SQL Injection. ¿Por qué son más seguros que concatenar strings en la query?
Dame un ejemplo de código vulnerable vs código seguro.
```

### Consulta 3 - Proxy en Vite
```
¿Cómo funciona el proxy en vite.config.js? ¿Por qué necesito configurar 
proxy para /api si el backend está en localhost:3000 y el frontend en 
localhost:5173? ¿Qué es CORS y cómo el proxy ayuda a evitarlo en desarrollo?
```

### Consulta 4 - Naming Conventions
```
En la base de datos Oracle los campos están en SNAKE_CASE (UPPER_CASE), 
pero en JavaScript usamos camelCase. ¿Cuál es la mejor práctica para manejar 
esta diferencia? ¿Debo mapear los nombres o usar los nombres originales?
```

### Consulta 5 - Interceptores Axios
```
¿Cómo funcionan los interceptores de Axios? ¿Para qué sirven los interceptores 
de request vs response? Dame ejemplos de uso práctico más allá del logging.
```

### Consulta 6 - React Hooks
```
Explica el ciclo de vida de useEffect. ¿Cuándo se ejecuta? ¿Qué son las 
dependencias del array de dependencias? ¿Por qué refreshTrigger como 
dependencia causa que se vuelva a ejecutar?
```

### Consulta 7 - Tailwind CSS
```
¿Cuál es la diferencia entre usar Tailwind CSS utility classes vs CSS 
tradicional con archivos separados? ¿Cuáles son las ventajas y desventajas? 
¿Cómo se genera el CSS final?
```

### Consulta 8 - MVC Pattern
```
Explica el patrón MVC (Modelo-Vista-Controlador) aplicado a esta aplicación. 
¿Qué responsabilidad tiene cada capa? ¿Por qué es importante mantener 
las capas desacopladas?
```

---

## 🎓 Metodología y Reflexión

### Enfoque de Uso de IA

**Estrategia aplicada:**

1. **Aprendizaje incremental:** No solicité el proyecto completo, sino desarrollo paso a paso con explicaciones
2. **Debugging colaborativo:** Compartí errores específicos con contexto para análisis preciso
3. **Comprensión profunda:** Pregunté el "por qué" además del "cómo" en cada decisión técnica
4. **Validación continua:** Checkpoints después de cada fase para verificar comprensión
5. **Testing guiado:** Solicité múltiples opciones de herramientas para probar el código
6. **Corrección iterativa:** Refiné el código basándome en errores reales, no teóricos

### Beneficios Obtenidos

✅ **Comprensión arquitectónica:** Entendí completamente la arquitectura MVC y la separación de responsabilidades

✅ **Seguridad:** Aprendí sobre SQL Injection y cómo prevenirlo con prepared statements

✅ **Mejores prácticas:** Implementé patrones profesionales (pool de conexiones, validación en capas, manejo de errores)

✅ **Autonomía:** Desarrollé capacidad de debugging independiente con guía contextual

✅ **Código production-ready:** El resultado final es código limpio, documentado y seguro

### Aprendizajes Clave

1. **Prepared Statements:** Comprendí la importancia de usar bind variables en lugar de concatenación de strings para prevenir SQL Injection

2. **Pool de Conexiones:** Aprendí que reusar conexiones es más eficiente que crear/cerrar para cada request

3. **Validación en Capas:** Frontend valida UX, Backend valida seguridad. Ambas son necesarias

4. **Manejo de Errores:** Diferentes tipos de errores requieren diferentes códigos HTTP y mensajes descriptivos

5. **React State Management:** Props drilling y lifting state up para comunicación entre componentes

6. **Tailwind CSS:** Utility-first approach es más mantenible que CSS tradicional para aplicaciones medianas

### Limitaciones y Áreas de Mejora

**Lo que la IA NO hizo:**
- No escribió el código sin mi guía específica
- No tomó decisiones de diseño sin mi aprobación
- No probó el código (lo hice yo manualmente)
- No optimizó sin que yo lo solicitara

**Áreas donde necesité investigación adicional:**
- Documentación oficial de oracledb para configuración específica de Oracle 19c
- Algoritmos oficiales del SRI Ecuador (la IA los conocía pero verifiqué en fuentes oficiales)
- Convenciones de iDempiere para nombres de campos y estructura de datos

**Mejoras futuras que identificaría:**
- Implementar paginación en el listado (actualmente trae todos los registros)
- Agregar tests unitarios y de integración
- Implementar autenticación y autorización
- Agregar validación de unicidad de código antes de submit
- Implementar edición y eliminación de terceros
- Agregar logs estructurados con Winston o similar
- Dockerizar la aplicación para deployment

---

## 📊 Estadísticas del Proyecto

**Métricas de desarrollo:**
- **Total de prompts principales:** 15
- **Consultas de aprendizaje:** 8
- **Iteraciones de debugging:** 7
- **Tiempo total estimado:** 5-6 horas (incluyendo debugging y testing)
- **Líneas de código generadas:** ~1,800 (Backend + Frontend)
- **Archivos creados:** 18
- **Errores críticos resueltos:** 7

**Distribución de tiempo:**
- Setup y configuración: 15%
- Desarrollo backend: 35%
- Desarrollo frontend: 30%
- Debugging y correcciones: 15%
- Testing y validación: 5%

---

## 🎯 Conclusión

La asistencia de IA fue utilizada como **mentor técnico** para:
- Guiar el desarrollo incremental paso a paso
- Explicar conceptos y mejores prácticas
- Resolver problemas específicos con análisis detallado
- Proporcionar múltiples alternativas para toma de decisiones

**Todo el código fue:**
- ✅ Comprendido línea por línea
- ✅ Adaptado a las necesidades específicas del proyecto
- ✅ Probado manualmente con datos reales
- ✅ Debuggeado y corregido iterativamente
- ✅ Documentado con comentarios explicativos

El resultado es un **producto de aprendizaje activo**, no una copia pasiva de código generado.

---

**Declaración de Integridad Académica:**

Certifico que he utilizado IA como herramienta de aprendizaje y mentoría, no como sustituto del pensamiento crítico. Todo el código fue comprendido, adaptado, probado y validado personalmente. Este documento refleja transparentemente el proceso completo de desarrollo.

---

**Firma:** ___________________________  
**Fecha:** 8 de febrero de 2026