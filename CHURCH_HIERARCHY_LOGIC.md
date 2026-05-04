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

## 4. Control de Asistencia y Privilegios

El sistema integra filtros jerárquicos y reglas de participación:
*   **Filtro por Congregación**: Permite segmentar la lista de pase de lista por Iglesia Principal u Obras específicas.
*   **División de Privilegios (Servicios Especiales)**:
    *   Para servicios de **Niños**, **Jóvenes** o **Alabanza**, el sistema soporta hasta 3 responsables simultáneos (Dirige, Consagración, Doctrina).
    *   Esta estructura responde a la necesidad de mayor participación de la membresía en servicios autorizados por el Ministro.

## 5. Reglas de Integridad de Datos

1.  **Eliminación de Misiones**: Si se elimina una misión de la lista de ajustes, los miembros asignados a ella **no** se eliminan, pero su filtro en asistencia dejará de aparecer. Se recomienda reasignarlos a la Iglesia Principal antes de borrar la misión.
2.  **Migración Retroactiva**: Todos los miembros creados antes de esta actualización han sido migrados automáticamente a la "Iglesia Principal" para asegurar que sigan apareciendo en las listas de asistencia globales.
3.  **Unicidad de Fechas**: El sistema de programación (`schedule`) impone una restricción única por fecha para evitar duplicados en la base de datos.
