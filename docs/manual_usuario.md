# Álamo Rent-A-Car — Manual de Usuario

Bienvenido al manual del usuario de la plataforma de gestión de alquileres **Álamo Rent-A-Car**. Aquí se detalla el funcionamiento de cada uno de los módulos del sistema y cómo interactuar con ellos.

---

## 🔑 1. Acceso al Sistema (Control de Roles)

El sistema cuenta con una pantalla de inicio de sesión que simula dos roles operativos principales de la empresa:

1. **Administrador del Sistema:**
   * **Nombre de usuario:** `admin` (la contraseña puede ser cualquier texto).
   * **Permisos:** Acceso completo a todas las secciones (Usuarios, Vehículos, Contratos, Configuración y Soporte). Puede resolver tickets de soporte.
2. **Agente de Counter:**
   * **Nombre de usuario:** Cualquier texto distinto de admin (ej. `juan` o `maria`).
   * **Permisos:** Gestión de vehículos, creación de contratos, configuración y envío de tickets de soporte técnico. El módulo de **Usuarios** permanece oculto por motivos de seguridad.

---

## 📊 2. Panel de Control (Dashboard)

Al ingresar al sistema, se despliega el Dashboard con las métricas clave de la empresa actualizadas en tiempo real desde la base de datos:
* **Colaboradores Activos:** Número de usuarios registrados.
* **Flota Registrada:** Autos disponibles en catálogo.
* **Alquileres Activos:** Total de contratos registrados.
* **Facturación Estimada:** Suma total de los montos de todos los contratos.

En la parte inferior se muestra una tabla con la **Actividad Reciente**, listando de forma cronológica los últimos contratos formalizados.

---

## 👥 3. Gestión de Colaboradores (Usuarios)

*(Disponible únicamente para rol **Administrador**)*

Permite dar de alta a los empleados internos de la sucursal:
* **Búsqueda:** Filtro en tiempo real por nombre, correo electrónico o rol de trabajo.
* **Registro / Edición:** Un formulario interactivo permite registrar o actualizar nombres, apellidos, correo y rol asignado (`ADMINISTRADOR` o `COUNTER`).
* **Exportar Datos:** Dos botones dedicados en la barra de filtros permiten descargar el listado en:
  * **Excel:** Genera un archivo descargable con formato tabular estructurado.
  * **PDF:** Exporta un documento listo para impresión.

---

## 🚗 4. Gestión de Flota (Vehículos)

Sección para controlar el inventario de automóviles disponibles para renta:
* **Registro de Autos:** Se requiere la placa (patente única), marca, modelo, año del vehículo y su categoría correspondiente.
* **Categorías:**
  * **Económica:** Autos pequeños ideales para ciudad.
  * **Estándar:** Sedanes medianos y camionetas compactas familiares.
  * **Premium:** Camionetas SUV grandes y autos de lujo.
* **Exportación de Datos:** Descarga directa en formatos Excel y PDF desde el menú superior de la sección.

---

## 📝 5. Registro y Gestión de Contratos de Alquiler

Es el núcleo operativo del negocio. Permite registrar las salidas de autos alquilados:
* **Formulario de Alquiler:**
  * **Cliente y Vehículo:** Listas desplegables sincronizadas directamente con los registros de la base de datos.
  * **Fechas:** Rango de días de alquiler.
  * **Seguros:** Elección del tipo de póliza de protección.
  * **Servicios Adicionales:** Opciones múltiples como GPS, conductor adicional o silla para bebé.
* **Cálculo Automático de Tarifas:** El formulario calcula el subtotal y total a cobrar de forma dinámica y reactiva en pantalla mientras seleccionas los extras o cambias los rangos de fecha.
* **Exportación de Contratos:** Los listados e históricos de contratos se pueden exportar a Excel y PDF con un solo clic para fines contables y de auditoría.

---

## 🙋‍♂️ 6. Mesa de Soporte Técnico (Tickets de Ayuda)

Plataforma integrada de ayuda técnica para resolver problemas del personal interno:
* **Para el Agente Counter:** Formulario de creación de tickets para reportar bugs, caídas de red o fallas en el registro de contratos. Cada ticket se almacena en estado `ABIERTO`.
* **Para el Administrador:** Panel de incidentes. Los tickets abiertos aparecen listados de forma cronológica. El administrador puede leer el detalle del mensaje enviado y, una vez solucionado el inconveniente, presionar el botón **"Resolver"**, lo cual cambia el estado del ticket a `RESUELTO` con un distintivo visual verde.
