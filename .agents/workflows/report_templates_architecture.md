# Especificación de Arquitectura: Diseñador de Plantillas de Reportes & Exportación (PDF / Excel / CSV)

> **Estado**: Documento de Planificación y Referencia de Memoria para Futuras Actualizaciones.
> **Objetivo**: Permitir al Administrador, Ministro a Cargo y Encargado de Asistencia diseñar y personalizar al 100% las plantillas de exportación de asistencia (PDF, Excel, Sheets/CSV) sin afectar las funcionalidades operativas existentes.

---

## 1. Reglas de Seguridad y Privilegios Especiales

El acceso al diseñador y generador de plantillas está estricta y exclusivamente limitado a 3 roles/privilegios:
1. `Administrador`
2. `Ministro a Cargo`
3. `Responsable de Asistencia`

### Control de Permisos
- En Supabase (`app_settings` / `currentUser.privileges`), se agrega la bandera `can_edit_report_templates: boolean`.
- El Administrador puede otorgar o revocar este privilegio desde la tabla de gestión de miembros.
- Si un usuario no autorizado intenta navegar a la pestaña o endpoint `/admin?tab=templates`, el sistema mostrará la tarjeta de **Acceso Restringido**.

---

## 2. Ubicación de Archivos y Rutas (Aislamiento Total)

Para garantizar la no interrupción del código que actualmente funciona en producción:
- **Pestaña en Admin**: `src/app/admin/tabs/TemplatesTab.tsx` (Se renderiza únicamente si `tab === 'templates'`).
- **Controlador de Renderizado de PDF**: `src/components/admin/reports/ReportPDFRenderer.tsx`.
- **Exportador de Hojas de Cálculo (Excel/CSV)**: `src/lib/exportUtils.ts`.

---

## 3. Esquema de Datos (JSON en Supabase)

Toda la configuración del diseñador se almacena en `app_settings.report_templates_config`:

```json
{
  "pdf_attendance": {
    "title": "Informe Oficial de Asistencia",
    "logo_type": "official_gold",
    "orientation": "landscape",
    "header": {
      "show_church_name": true,
      "show_city_date": true,
      "custom_subtitle": "La Luz del Mundo - Rodeo, CA"
    },
    "page_1": {
      "show_donuts": true,
      "show_summary_cards": true,
      "donut_groups": ["varones", "festivas", "jovenes", "ninos"]
    },
    "page_2": {
      "separate_page": true,
      "page_break_before_table": true,
      "columns": [
        { "id": "member_name", "label": "Nombre del Miembro", "visible": true },
        { "id": "group", "label": "Batallón / Grupo", "visible": true },
        { "id": "total_attendances", "label": "Asistencias Acumuladas", "visible": true },
        { "id": "percentage", "label": "Porcentaje %", "visible": true },
        { "id": "status", "label": "Estado / Observación", "visible": true }
      ]
    },
    "signatures": {
      "show_signatures": true,
      "minister_label": "Ministro a Cargo",
      "leader_label": "Encargado de Asistencia"
    }
  },
  "excel_csv": {
    "delimiter": ",",
    "include_headers": true,
    "selected_fields": ["id", "name", "group", "total_attendance", "percentage"]
  }
}
```

---

## 4. Componentes del Diseñador Visual (`TemplatesTab.tsx`)

1. **Panel de Edición (Izquierda)**:
   - Controles interactivos para activar/desactivar gráficas de dona.
   - Selector de posición de donas (Página 1 separada vs. Integradas con la tabla).
   - Arrancador y selector dinámico de columnas visibles para la tabla de miembros.
   - Selectores de imágenes de firma y encabezados oficiales.
2. **Panel de Vista Previa en Vivo (Derecha)**:
   - Renderizador dinámico en pantalla en formato exacto A4 / Carta que refleja los cambios al instante.

---

## 5. Garantía de Inviolabilidad del Sistema
- **Sin romper vistas existentes**: La pestaña `templates` es modular y no altera las vistas actuales de `dashboard`, `miembros`, `horarios` ni `public_web`.
- **Compatibilidad con Git**: Todos los cambios se commitean y despliegan siguiendo el estándar de ramas (`version-26-marzo` -> `main`).
