# Registro de Cambio: Estructura de Servicios de Niños (Sábados)

**Fecha:** 4 de Mayo de 2026  
**Contexto:** Debido al incremento en la participación de los niños en los privilegios, el Ministro a Cargo ha autorizado dividir la oración de alabanzas de niños (generalmente los Sábados a las 7:00 PM) en tres roles específicos en lugar de dos.

## Nueva Organización del Servicio
Anteriormente, el servicio contaba con un responsable de "Servicio" y uno de "Doctrina". A partir de ahora, se habilita un tercer responsable para la "Consagración".

### Roles Definidos:
1.  **Servicio (Titular):** Encargado general del orden y desarrollo del servicio.
2.  **Consagración:** Responsable de dirigir el momento de la consagración de los niños.
3.  **Doctrina:** Responsable de impartir la enseñanza o tema doctrinal del servicio.

## Cambios Técnicos Realizados
- **Base de Datos (Supabase):** Se añadió la columna `evening_consecration_leader_id` a la tabla `schedule`.
- **Tipado (TypeScript):** Se actualizó la interfaz `DailySchedule` en `src/lib/types.ts` para incluir `consecrationLeaderId` en el slot de la tarde (`evening`).
- **Gestión de Datos (Store):** Se actualizaron las funciones de carga (`loadDayScheduleFromCloud`) y guardado (`saveScheduleDayToCloud`) en `src/lib/store.ts` para persistir este nuevo campo.
- **Interfaz Administrativa (UI):** En la pestaña de **Horarios**, al seleccionar el tipo de servicio "Niños", "Jóvenes" o "Alabanza", ahora aparecerán los tres selectores correspondientes (Dirige, Consagración y Doctrina).

## Instrucción de Seguimiento
Para que los cambios sean visibles y funcionales en la nube, es necesario ejecutar el script SQL de migración en el panel de Supabase:
`scripts/add_evening_consecration.sql`
