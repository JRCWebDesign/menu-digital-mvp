# Menú Digital MVP

Base funcional en HTML + CSS + JavaScript vanilla.

## Qué incluye

- Selector de locales en `/` y menús por slug, por ejemplo `/lKb-smash/` o `/burger-house/`
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

Para que las rutas por slug funcionen localmente, ejecutá el servidor con fallback SPA:

```bash
npx --yes serve -s . -l 5500
```

Después abrí `http://localhost:5500/` o `http://localhost:5500/burger-house/`.
El modo `-s` sirve `index.html` para las rutas de locales. En Cloudflare Pages, la regla `_redirects` hace ese trabajo.

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
