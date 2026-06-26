# Plan de proyecto (inicio → fin) para reconstrucción 100% del sistema

> Tema principal: **Reconstrucción 100% del sistema completo** (Backend Spring Boot + Base de Datos MySQL + Frontend React/Vite + CD/CI).

## 0. Alcance y definiciones (entregables)

**Objetivo final (100%)**

1. Backend Spring Boot (Java 21) completo: entidades, persistencia, validaciones y API REST.
2. Autenticación/Autorización: login + roles + protección de rutas.
3. Frontend Vite + React con pantallas funcionales para cada módulo.
4. Integración completa React ↔ Spring (API real, CORS, manejo de errores).
5. Docker: despliegue reproducible (BD + backend + frontend si aplica).
6. Jenkins: pipeline CI/CD para construir, testear y desplegar.
7. Documentación: guía de reconstrucción para que un tercero pueda levantar el proyecto.

**Entregables documentales**

- `docs/01-arquitectura.md` (diagrama + decisiones)
- `docs/02-api-endpoints.md` (catálogo de endpoints)
- `docs/03-modelo-datos.md` (ERD / entidades)
- `docs/04-front-pantallas.md` (rutas/pantallas y flujos)
- `docs/05-guia-despliegue-docker.md`
- `docs/06-jenkins-pipeline.md`

---

## 1. Auditoría del repositorio actual (día 1)

**1.1 Revisión backend (Spring)**

- Identificar:
  - entidades JPA existentes
  - repositorios existentes
  - controladores REST existentes
  - configuración CORS y sesión
- Confirmar:
  - rutas reales disponibles (`/api/**`)
  - si existen endpoints MVC para Thymeleaf (probablemente no, porque hay controladores REST genéricos)

**1.2 Revisión frontend actual**

- Identificar si el “frontend” actual es Thymeleaf/HTML o ya existe React con Vite.
- Si solo existe Thymeleaf:
  - decidir si se migra a React (recomendado según tu mensaje)
  - mapear pantallas existentes a rutas React.

**Criterio de completitud etapa 1**

- Lista completa de módulos y rutas.
- Lista de endpoints que faltan para cubrir los flujos.

---

## 2. Diseño funcional (día 2–3)

**2.1 Mapa de módulos (MVP y expansión)**
Proponer módulos por prioridad:

1. Auth (Login/Logout)
2. Usuarios/Roles
3. Catálogos (entidades base)
4. Operaciones (flujos principales por módulo)
5. Informes/reportes

**2.2 Contrato API**
Para cada flujo:

- endpoint (método + ruta)
- request/response
- validaciones
- códigos de error

**Criterio completitud etapa 2**

- `docs/02-api-endpoints.md` versión 1

---

## 3. Backend (día 3–7) – 100% API y seguridad

**3.1 Seguridad (obligatorio)**

- Implementar auth:
  - esquema (JWT o sesión)
  - login: credenciales → token/sesión
  - refresh si aplica
- Implementar autorización por roles:
  - roles/permissions desde BD
  - protect routes en Spring Security

**3.2 Endpoints específicos (no solo CRUD genérico)**

- Crear controladores específicos donde se requiera lógica de negocio.
- Mantener CRUD genérico si sirve para catálogos.

**3.3 Validación y consistencia**

- Bean Validation (JSR-380): @NotNull, @Size, etc.
- Manejo de errores uniforme (ControllerAdvice)

**3.4 CORS**

- Configurar `cors.allowed-origin` para el dominio del frontend.

**Criterio completitud etapa 3**

- Postman/curl: todos los endpoints de la lista validan.

---

## 4. Frontend React (día 6–12) – pantallas y navegación

**4.1 Base del proyecto**

- Crear/ajustar proyecto Vite + React
- Estructura recomendada:
  - `src/pages/*`
  - `src/components/*`
  - `src/api/*` (cliente HTTP)
  - `src/hooks/*`
  - `src/store/*` (si aplica Zustand/Redux)

**4.2 Auth en frontend**

- Login form
- Persistencia token/sesión
- Protecciones de rutas (PrivateRoute)
- Logout

**4.3 Implementación de pantallas por módulos**
Por cada pantalla:

- ruta React
- componente
- consumo API
- loading/empty/error states
- formularios CRUD

**4.4 UX y consistencia**

- manejo de modales
- tablas paginadas si aplica
- exportaciones (si existe en back)

**Criterio completitud etapa 4**

- Navegación completa y flujos principales sin endpoints inexistentes.

---

## 5. Integración completa (día 10–13)

**5.1 Contrato UI ↔ API**

- Verificar payloads exactos.
- Actualizar DTOs/serialización si hay desajustes.

**5.2 Seguridad e integración real**

- Confirmar que el backend rechaza sin token.
- Confirmar que el frontend recibe 401/403 y muestra mensajes adecuados.

**5.3 Endpoints de archivos (si existen)**

- Subida/descarga de archivos: imagenes, reportes, etc.

**Criterio completitud etapa 5**

- Flujo end-to-end: login → navegación → operaciones → persistencia.

---

## 6. Docker (día 13–14) – despliegue reproducible

**6.1 Contenedores**

- MySQL
- backend
- (opcional) nginx + frontend estático

**6.2 Configuración**

- variables de entorno
- migrations/DDL
- volúmenes persistentes

**6.3 Pruebas de arranque**

- `docker compose up -d`
- validar healthcheck (si se implementa)

**Criterio completitud etapa 6**

- Levanta todo local con un comando.

---

## 7. Jenkins (día 14–16) – CI/CD

**7.1 Pipeline propuesto**

1. checkout
2. backend: `mvn clean verify`
3. frontend: `npm ci` + `npm run build`
4. docker build (backend + frontend si aplica)
5. push a registry (Docker Hub / GitHub Container Registry)
6. deploy (docker compose en servidor) o helm

**7.2 Versionado y tags**

- tag por commit hash o build number

**Criterio completitud etapa 7**

- Un push al repo dispara y despliega.

---

## 8. Documentación final “para reconstrucción” (día 16–17)

**8.1 Guías**

- Setup local paso a paso
- Setup producción paso a paso
- Variables de entorno

**8.2 Checklist de reconstrucción**

- requisitos (Java 21, Node, Docker)
- comandos de build
- endpoints base

**8.3 Registro de decisiones**

- JWT vs sesión
- estructura de rutas React
- estrategia para manejar errores

**Criterio completitud etapa 8**

- Un tercero levanta el proyecto siguiendo la documentación sin preguntas.

---

## 9. Entrega final (Definition of Done)

- Backend: compila, corre, y pasa pruebas mínimas.
- Frontend: compila, corre, y cubre módulos acordados.
- Integración: end-to-end funcional.
- Docker: deploy reproducible.
- Jenkins: pipeline completo.
- Documentación: reconstrucción 100%.

---

## Anexo A: Checklist técnico rápido

- [ ] Configurar BD MySQL en `application.properties` y/o env
- [ ] Spring Security + roles
- [ ] CORS correcto
- [ ] API docs (OpenAPI/Swagger si aplica)
- [ ] Cliente HTTP en React con manejo de token
- [ ] PrivateRoute
- [ ] Tablas/paginación si aplica
- [ ] Docker compose funcionando
- [ ] Jenkinsfile versionado
