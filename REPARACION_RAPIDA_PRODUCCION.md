# 🚨 REPARACIÓN Y ACTUALIZACIÓN DE PRODUCCIÓN

Este documento registra la solución a los problemas de refresco de página y errores de ejecución en el sitio en vivo ([lldmrodeo.org](https://lldmrodeo.org)).

## ❌ Problemas Detectados y Corregidos Localmente
1.  **Application Error (Hook Mismatch):** Corregido en `AppWrapper.tsx`. Era causado por una violación a las reglas de React Hooks que impedía la carga del sitio.
2.  **Soporte SVG:** Habilitado para Ministros, Miembros y Fondos.
3.  **Fuentes de Google:** Sincronizadas entre el Administrador y la Proyección.
4.  **Fondos Personalizados:** Funcionales en todos los temas visuales.

## 🛠️ PASOS PARA ACTUALIZAR EL SITIO EN VIVO

Para que estos cambios funcionen en la web, **tienes que desplegarlos** siguiendo estos comandos exactos en tu terminal:

### 1. Preparar y Sincronizar Código
```bash
# Entrar a la carpeta del proyecto
cd /Users/hardglobal/Documents/LLDM_RODEO_APP

# Guardar todos los cambios realizados (SVG, Fuentes, Fix de Error)
git add .
git commit -m "Fix: Solución de Application Error y soporte completo SVG/Fuentes"

# Subir a la nube
git push origin main
```

### 2. Verificar el Despliegue en Vercel
- Entra a tu panel de Vercel y asegúrate de que el último "Deployment" haya terminado sin errores.
- Si el error persiste, usa el botón **"Redeploy"** con la opción **"Base Directory: . / Ignore Build Cache"** activada.

### 3. Limpieza de Memoria (VITAL)
Una vez desplegado, el navegador guardará la versión vieja con error en cache. **DEBES hacer esto:**
- En Mac: **`Cmd + Shift + R`** (en la página de admin y display).
- En Windows: **`Ctrl + F5`**.

## 📌 Nota de Mantenimiento
Si el sistema vuelve a decir "Application error", lo más probable es que se haya introducido un Hook (`useEffect`, `useState`) dentro de una condición `if` o un bucle `map`. Siempre mantén los Hooks al principio de los componentes.

---
*Última actualización: 17 de Marzo, 2026 - Fix de Excepción de Cliente aplicado.*
