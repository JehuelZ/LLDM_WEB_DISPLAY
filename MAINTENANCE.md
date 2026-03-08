# 🛠️ Registro de Mantenimiento y Limpieza - LLDM RODEO

Este archivo registra los cambios realizados para limpiar datos demo, corregir duplicados y asegurar la integridad de la base de datos.

## [2026-03-07] - Limpieza de Perfiles y Duplicados

### 👥 Perfiles de Usuario (Jairo Zelaya)
- **Problema**: Se detectaban dos perfiles para "Jairo Zelaya". Esto ocurría porque el sistema tenía un perfil inicial (hardcoded) y otro recuperado de la nube.
- **Acción**: 
    - Se ha modificado el `INITIAL_USER` en `src/lib/store.ts` para que sea un perfil genérico de "Administrador" hasta que el usuario real inicie sesión.
    - Se ha reforzado la lógica de `syncUserWithCloud` para asegurar que el Administrador Maestro siempre se vincule a su perfil único en Supabase basado en el correo `jairojehuel@gmail.com`.
- **Estado**: ✅ Corregido.

### ⛪ Perfil del Ministro
- **Problema**: Existían dos perfiles de "Ministro" con diferentes imágenes (el placeholder del sistema y la cuenta de prueba).
- **Acción**:
    - Se ha unificado la lógica: ahora el sistema busca automáticamente en la lista de miembros si existe alguien con el rol de "Ministro a Cargo".
    - Si se encuentra un ministro real en la base de datos, el sistema actualiza automáticamente el estado global `minister` para que la imagen y el nombre coincidan en todas las pantallas (Pizarra, Dashboard, Reportes).
    - Se ha eliminado la creación de la cuenta "Test Ministro" que generaba confusión.
- **Estado**: ✅ Corregido.

---

### 📋 Próximos pasos sugeridos:
1. **Limpieza Manual**: Acceder a la sección de "Gestión de Miembros" y eliminar cualquier perfil de prueba (como `ministro_test@lldmrodeo.org`) que ya no sea necesario.
2. **Foto Oficial**: Subir la foto oficial del Ministro desde el Panel de Administración para que se sincronice en toda la aplicación.
