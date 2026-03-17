# Guía de Clasificación y Sistema LLDM Rodeo

Este documento detalla la estructura de grupos y servicios configurados en el sistema LLDM Rodeo Board para asegurar la visualización correcta en todos los temas.

## 1. Grupos de Membresía y Responsables

El sistema detecta automáticamente a los responsables de área en la diapositiva de **Comunicados (Anuncios)** basándose en el campo `member_group` y `role` de la base de datos.

### Clasificaciones Soportadas:
| Grupo | Término de Búsqueda | Icono | Color Sugerido |
| :--- | :--- | :--- | :--- |
| **Coro** | `coro` | `Music` | Accent (Blue/Gold) |
| **Jóvenes** | `joven` | `Zap` | Secondary (Purple/Blue) |
| **Niños** | `niño` / `niña` | `Baby` | Orange (#FF9F1C) |
| **Solos y Solas** | `solos` | `Heart` | Pink (#E91E63) |
| **Administración** | `admin` / `oficina` | `ShieldCheck` | Tertiary (Teal) |

> [!NOTE]
> Para que un miembro aparezca como responsable en el directorio automático, su campo `role` debe contener el término del grupo (ej. "Encargado de **Solos**") o palabras clave como `responsable`, `encargado` o `líder`.

---

## 2. Tipos de Servicio (Evening Service)

Al configurar el servicio vespertino en el panel táctil, se pueden seleccionar los siguientes tipos que cambian dinámicamente el título y estilo en las pizarras:

*   **Regular / Oración**: Culto de adoración estándar.
*   **Jóvenes**: Servicio enfocado a la juventud.
*   **Casados**: Formato dual (Matrimonios).
*   **Niños**: Servicio especial infantil.
*   **Solos y Solas**: **(NUEVO)** Servicio enfocado al grupo de hermanos y hermanas solos.
*   **Alabanza**: Servicio de alabanzas especial.
*   **Especial**: Eventos únicos, aniversarios, etc.

---

## 3. Reglas de Visualización Dinámica

1.  **Detección de Idioma**: Si un servicio está marcado como `EN`, aparecerá un badge brillante **[EN]** en todas las plantillas.
2.  **Líderes duales**: En tipos como `Casados` o `Niños`, el sistema permite asignar dos líderes (ej. Consagración y Doctrina) que se muestran de forma prominente.
3.  **Prioridad de Títulos**: 
    *   1°: `Etiqueta Personalizada` (si se define en Admin).
    *   2°: `Tema del Servicio` (Topic).
    *   3°: `Título por Tipo` (según la tabla anterior).
4.  **Días 14**: Recordación de la **Historia de la Iglesia**. La Consagración y el servicio vespertino son normales; la historia se recuerda durante la **Doctrina**. Esta regla es el predeterminado a menos que un evento especial (Aniversario, etc.) lo sobrescriba.
