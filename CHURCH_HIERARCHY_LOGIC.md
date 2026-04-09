# Lógica de Jerarquía Eclesiástica: LLDM Rodeo

Este documento formaliza las reglas y el funcionamiento del sistema de jerarquía de iglesias y misiones (obras) implementado en el Dashboard de Administración.

## 1. Estructura de la Organización

El sistema se basa en una jerarquía de un solo nivel:
*   **Iglesia Principal**: El núcleo administrativo (ej. "Rodeo CA"). Es el valor por defecto para todos los miembros existentes.
*   **Misiones / Obras**: Extensiones de la iglesia principal que dependen administrativamente de ella pero tienen su propia identificación de membresía.

## 2. Configuración (Ajustes)

Los administradores pueden gestionar esta jerarquía desde la pestaña de **Ajustes**:
*   **Nombre de Iglesia Principal**: Editable para personalizar el nombre del núcleo.
*   **Gestión de Misiones**: Una lista dinámica donde se pueden agregar nuevas obras o eliminar existentes.
*   **Persistencia**: Estos nombres se guardan en la tabla `app_settings` de Supabase (`main_church_name` y `missions`).

## 3. Asignación de Miembros

Cada miembro tiene un campo `assigned_church` que determina su pertenencia:
*   Al crear un miembro, el administrador debe seleccionar la congregación.
*   Si no se especifica, el sistema asigna "Principal" por defecto.
*   Un miembro solo puede pertenecer a **una** congregación a la vez.

## 4. Control de Asistencia

El sistema de asistencia integra filtros jerárquicos:
*   **Filtro por Congregación**: Permite segmentar la lista de pase de lista por Iglesia Principal u Obras específicas.
*   **Intersección de Filtros**: Los filtros de congregación funcionan en conjunto con los filtros de categoría (Varones, Niños, Jóvenes, etc.).
    *   *Ejemplo*: Se puede filtrar por "Obra XYZ" + "Niños" para pasar lista solo a los niños de esa misión específica.

## 5. Reglas de Integridad de Datos

1.  **Eliminación de Misiones**: Si se elimina una misión de la lista de ajustes, los miembros asignados a ella **no** se eliminan, pero su filtro en asistencia dejará de aparecer. Se recomienda reasignarlos a la Iglesia Principal antes de borrar la misión.
2.  **Migración Retroactiva**: Todos los miembros creados antes de esta actualización han sido migrados automáticamente a la "Iglesia Principal" para asegurar que sigan apareciendo en las listas de asistencia globales.
