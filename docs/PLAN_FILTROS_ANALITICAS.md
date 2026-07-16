# Plan de Implementación: Filtro de Disponibilidad y Analíticas de Dashboard

Este documento detalla el plan de diseño técnico para añadir las funciones avanzadas de **Filtro Dinámico de Disponibilidad de Flota** y un **Módulo de Analíticas Visuales** en el Dashboard.

---

## 🚗 Part 1: Filtro de Disponibilidad de Flota (Prevenir Overbooking)

Actualmente, el sistema lista todos los vehículos al registrar un contrato. El objetivo es filtrar y listar únicamente los vehículos que no tienen alquileres programados en el rango de fechas solicitado.

### ⚙️ 1. Lógica del Backend (Base de Datos)

En `ContratoAlquilerRepository.java`, agregaremos una consulta personalizada para encontrar los IDs de vehículos ocupados en un periodo y retornar los disponibles.

#### Consulta SQL/JPQL overlap:
Dos periodos `[A, B]` y `[C, D]` se traslapan si: `A <= D` y `B >= C`.
Por ende, un vehículo está ocupado si su contrato actual tiene:
`fechaInicio <= :fechaFin` y `fechaFin >= :fechaInicio`.

```java
package com.alamo.alquiler.repository;

import com.alamo.alquiler.model.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Integer> {

    // Obtener vehículos disponibles filtrando contratos solapados
    @Query("SELECT v FROM Vehiculo v WHERE v.idVehiculo NOT IN (" +
           "  SELECT c.vehiculo.idVehiculo FROM ContratoAlquiler c " +
           "  WHERE c.fechaInicio <= :fechaFin AND c.fechaFin >= :fechaInicio" +
           ")")
    List<Vehiculo> findVehiculosDisponibles(
        @Param("fechaInicio") LocalDate fechaInicio, 
        @Param("fechaFin") LocalDate fechaFin
    );
}
```

### 🛣️ 2. Endpoint REST (`VehiculoController.java`)
Exponer la ruta de consulta:
```java
@GetMapping("/disponibles")
public List<Vehiculo> listarDisponibles(
    @RequestParam("fechaInicio") String fechaInicio,
    @RequestParam("fechaFin") String fechaFin
) {
    LocalDate inicio = LocalDate.parse(fechaInicio);
    LocalDate fin = LocalDate.parse(fechaFin);
    return repo.findVehiculosDisponibles(inicio, fin);
}
```

### 💻 3. Integración en el Formulario (`Contratos.tsx`)
En el formulario de creación de alquileres del frontend:
1. Escuchar los cambios en los campos `fechaInicio` y `fechaFin`.
2. Al ingresar ambas fechas, realizar la llamada:
   `api.get('/vehiculos/disponibles?fechaInicio=...&fechaFin=...')`.
3. Cargar la respuesta en el dropdown del selector de vehículos.

---

## 📊 Part 2: Módulo de Analíticas y Gráficas de Dashboard

Transformar el Dashboard plano agregando gráficas comerciales utilizando la librería de visualización **Recharts** (estándar moderno para React).

### ⚙️ 1. Lógica del Backend (Controlador de Métricas)

Crearemos un DTO y un controlador `AnaliticaController.java` para retornar los datos agrupados.

#### DTO `DashboardAnalyticsDTO.java`
```java
package com.alamo.alquiler.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardAnalyticsDTO {
    private List<Map<String, Object>> facturacionMensual; // [{mes: "Enero", total: 4500}, ...]
    private Map<String, Long> distribucionCategorias;    // {ECONOMICA: 25, PREMIUM: 10, ...}
}
```

#### SQL Queries en Repositorios
* **Facturación Mensual:** `SELECT TO_CHAR(c.fechaInicio, 'YYYY-MM') as mes, SUM(c.montoTotal) FROM ContratoAlquiler c GROUP BY mes ORDER BY mes`
* **Distribución de Categorías:** `SELECT v.categoria.tipo, COUNT(v) FROM Vehiculo v GROUP BY v.categoria.tipo`

### 🎨 2. Frontend: Instalación y Renderizado (`Recharts`)

Instalar la librería en la carpeta del frontend:
```bash
cd frontend
npm install recharts
```

#### Integración en `Dashboard.tsx`
Utilizar los componentes `<AreaChart>` y `<PieChart>` para graficar los datos:

```typescript
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Ejemplo para el gráfico de facturación
const GraficaVentas = ({ data }) => (
  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="mes" stroke="var(--text-secondary)" />
        <YAxis stroke="var(--text-secondary)" />
        <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'rgba(255,255,255,0.1)' }} />
        <Area type="monotone" dataKey="total" stroke="#10b981" fillOpacity={1} fill="url(#colorSales)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
```

#### Ventajas del Diseño:
* **Área Chart (Facturación):** Muestra el crecimiento de ventas mensual con un degradado Glassmorphism.
* **Pie Chart (Flota):** Muestra de forma concisa qué categorías de autos representan el núcleo del negocio.
