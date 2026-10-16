# Menú Digital MVP

Base funcional en HTML + CSS + JavaScript vanilla.

## Qué incluye

- Multi-local mediante slug: `/lKb-smash`
- Configuración por local
- Menú y categorías
- Estado abierto/cerrado según horario
- Bloqueo de pedidos fuera de horario
- Productos y precios
- Opciones/extras de productos
- Carrito
- Cantidades
- Delivery / retiro
- Datos del cliente
- Observaciones
- Generación de pedido estructurado para WhatsApp
- Preparado conceptualmente para un futuro panel administrativo/backend

## Ejecutar

Como usa ES Modules, lo ideal es servirlo con un servidor local.

Por ejemplo con VS Code + Live Server o:

```bash
npx serve .
```

## Próximo paso recomendado

No agregar todavía login, base de datos ni panel administrativo.

Primero probar y definir bien la experiencia pública:

1. Selección de local.
2. Menú.
3. Producto configurable.
4. Carrito.
5. Datos del pedido.
6. Validación de horarios.
7. WhatsApp.

Después se puede reemplazar `data.js` por una API/backend sin cambiar la lógica general de la interfaz.

## Demo administrativa local

Rama: `demo/admin-local`, basada en `main`.

Ejecutar con Node.js: `node serve-demo.cjs`.
Abrir http://127.0.0.1:5188/admin.html (panel) o http://127.0.0.1:5188/ (menú).

- Usuario de demostración: `admin@algora.demo`
- Contraseña pública de demostración: `AlgoraDemo2026`
- El acceso es una simulación del navegador, no una barrera de seguridad. No usar con datos sensibles ni publicar como administración real.
- Los productos y la promoción se guardan en localStorage (`algora.menu-demo.v1`). Sobreviven al refrescar, solo en el mismo navegador y origen. La sesión usa sessionStorage.
- Incluye alta/edición/ocultación, precios, ofertas, imágenes PNG/JPG/WebP hasta 700 KB y una promoción con producto asociado. Se mantienen los extras existentes.
- Al ocultar el producto de una promoción, se desactiva esa promoción.
- Restaurar demo elimina únicamente el catálogo de esta demo y vuelve a los 9 productos originales.
- El envío del pedido muestra una vista previa local y no abre WhatsApp.
- No incluye Google OAuth, backend, roles seguros, almacenamiento compartido ni cambios en el sitio público.
- Para producción se deberán reemplazar acceso y almacenamiento, validar permisos en servidor y revisar precios vigentes al confirmar pedidos.
