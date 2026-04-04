# Protocolo de Temas y Recordación Ministerial - LLDM Rodeo

Este documento detalla la lógica de programación ministerial implementada en la aplicación LLDM Rodeo, asegurando que el sistema sea fiel a la doctrina y al orden establecido.

## 1. Clasificación de Temas Semanales (Domingo a Sábado)
El sistema gestiona la programación en bloques semanales que inician los domingos. Existen **4 categorías oficiales** para clasificar el tema de la semana:

1.  **Presentación Apostólica** (`apostolic_presentation`): Es el momento de **máxima reverencia e importancia**. Ocurre cuando el Ungido de Dios se presenta y habla a la Iglesia Universal a través de transmisiones oficiales. El tema es dispuesto exclusivamente por él y este evento **prevalece sobre cualquier otra programación**.
2.  **Carta Apostólica** (`apostolic_letter`): Es el tema de **mayor peso cotidiano**, ya que proviene directamente de la Autoridad Apostólica para la edificación del cuerpo de Cristo a nivel mundial.
3.  **Sana Doctrina** (`orthodoxy`): Corresponde a los estudios de **Ortodoxia** enviados por la institución para ser impartidos de manera uniforme en todas las congregaciones del mundo.
4.  **Intercambio de Ministro** (`exchange`): Se aplica cuando se recibe a un colaborador del Ministerio (Intercambio). El ministro visitante trae un tema específico para impartir a la iglesia local.
5.  **Tema Libre / Ministerial** (`free`): Es el tema que el **Ministro Local o Encargado** decide impartir basándose en su discernimiento de la **necesidad espiritual actual** de la iglesia a su cargo.

## 2. La Recordación del Día 14 (Historia de la Iglesia)
El sistema posee una lógica inteligente para el **día 14 de cada mes**:

*   **Prioridad de Recordación**: Independientemente del tema semanal que esté corriendo (ej. Sana Doctrina o Intercambio), el sistema identificará automáticamente el día 14 como **"Recordación: Historia de la Iglesia"**.
*   **Visibilidad Automática**: En el tablero público (`/display`), los servicios de ese día (especialmente el de la tarde) mostrarán automáticamente la etiqueta de Historia, honrando la memoria de la Iglesia.
*   **Sin Interrupción**: La recordación es diaria; el tema de la semana no cambia, permitiendo que el sistema retome el flujo normal el día 15 sin intervención del administrador.

## 3. Identidad Visual y Simbología
Es fundamental respetar la identidad iconográfica de la Iglesia:
*   **Uso de la Cruz**: Queda estrictamente **prohibido** el uso de la cruz como icono sagrado o decorativo en la aplicación. Para la congregación, la cruz no es un símbolo de fe, sino un símbolo de muerte. 
*   **Iconografía Permitida**: Se deben utilizar iconos que representen la vida, el espíritu y la edificación, tales como llamas (`Flame`), libros de la palabra (`BookOpen`), iglesias (`Church`), estrellas (`Star`) o corazones (`Heart`).

## 4. Administración en la Nube
Para configurar estos temas, siga los siguientes pasos:

1.  Acceda al panel de **Administración Nube** (`/admin/cloud`).
2.  Diríjase a la sección **"Tema de la Semana"**.
3.  Seleccione el **Tipo de Tema** en el menú desplegable.
4.  Ingrese el **Título** y una breve **Descripción** (Resumen) que servirá para alimentar el tablero público.
5.  Defina el rango de fechas (el sistema sugerirá automáticamente de domingo a sábado).

## 4. Consideraciones Técnicas
*   Los nombres técnicos en la base de datos (Supabase) son `orthodoxy`, `apostolic_letter`, `exchange` y `free`.
*   Las etiquetas visuales están centralizadas en `src/lib/display_labels.ts` y se reflejan en todos los temas visuales (Glassmorphism, Luna, Nocturno, etc.) para mantener la uniformidad.

---
*Este protocolo fue estandarizado el 2 de abril de 2026 para garantizar el orden y la reverencia en la comunicación digital de la Iglesia.*
