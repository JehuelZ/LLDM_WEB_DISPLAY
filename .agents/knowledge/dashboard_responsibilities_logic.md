# Dashboard Responsibilities Logic (Lógica de Responsabilidades)

Este documento describe cómo el sistema de LLDM Rodeo recupera y muestra las responsabilidades individuales (privilegios) de cada miembro en su panel de control (Dashboard).

## Flujo de Datos Arquitectónico

1. **Inicialización (AppWrapper)**:
   - Al cargar la aplicación, el `AppWrapper` verifica la sesión de Supabase.
   - Si hay un usuario autenticado, llama a `syncUserWithCloud(authUserId)`.

2. **Sincronización de Perfil (store.ts -> syncUserWithCloud)**:
   - Recupera los datos del perfil desde la tabla `profiles`.
   - Llama a `setCurrentUser(profileData)` para establecer el estado global.

3. **Automatización de Carga (store.ts -> setCurrentUser)**:
   - El método `setCurrentUser` ha sido modificado para disparar automáticamente la lógica de carga de responsabilidades:
     ```typescript
     if (user?.id) {
         get().loadUserResponsibilities(user.id);
     }
     ```

4. **Motor de Mapeo (store.ts -> loadUserResponsibilities)**:
   - Consulta la tabla `schedule` para el mes actual (desde el primer al último día).
   - Itera sobre cada registro (día) y busca el `userId` en las siguientes columnas:
     - `five_am_leader_id` -> **Oración 5 AM**
     - `nine_am_consecration_leader_id` -> **Consagración 9 AM**
     - `nine_am_doctrine_leader_id` -> **Doctrina 9 AM**
     - `noon_leader_id` -> **Oración 12 PM**
     - `evening_doctrine_leader_id` -> **Doctrina Vespertina**
     - `evening_leader_ids` (Array) -> **Culto Vespertino**
   - Los resultados se guardan en el array `currentUser.responsibilities`.

## Esquema de la Tabla `schedule`

Para que una responsabilidad aparezca en el dashboard, el desarrollador o administrador debe asegurarse de que el ID del miembro esté correctamente asignado en una de las columnas de líderes de la tabla `schedule`.

| Columna | Etiqueta en Dashboard | Rol Sugerido |
|---------|-----------------------|--------------|
| `five_am_leader_id` | Oración 5 AM | Titulado |
| `nine_am_consecration_leader_id` | Consagración 9 AM | Dirigente |
| `nine_am_doctrine_leader_id` | Doctrina 9 AM | Expositor |
| `noon_leader_id` | Oración 12 PM | Titulado |
| `evening_doctrine_leader_id` | Culto Vespertino (Doctrina) | Expositor |
| `evening_leader_ids` | Culto Vespertino | Dirigente |

## Consideraciones Técnicas

- **Persistencia**: Las responsabilidades no se guardan en la tabla `profiles`. Se calculan dinámicamente cada vez que el usuario inicia sesión o refresca la página para asegurar que siempre vea los cambios más recientes del administrador.
- **Rendimiento**: Se hace una sola consulta por mes para minimizar el tráfico a la base de datos.
- **Vercel/Caching**: En caso de que los cambios no se vean reflejados inmediatamente, se recomienda cerrar sesión y volver a entrar para forzar el ciclo de `syncUserWithCloud`.

---
*Documentación generada el 10 de Abril, 2026 por Antigravity AI.*
