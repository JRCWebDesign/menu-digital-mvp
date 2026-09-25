Quiero desarrollar un producto web que funcione como un **menú digital interactivo para restaurantes, cafeterías, hamburgueserías, pizzerías y otros locales gastronómicos**.

La idea NO es crear simplemente un carrito de compras conectado a WhatsApp. Quiero desarrollar una experiencia moderna que se sienta como una pequeña aplicación web del propio local, pero que funcione directamente desde un link y sin necesidad de descargar una aplicación ni crear una cuenta.

### Concepto principal

Cada local tendrá su propio espacio y su propio menú.

Por ejemplo:

* `dominio.com/brasa`
* `dominio.com/pizzeria-roma`
* `dominio.com/cafe-centro`

Cuando una persona entra al link de un local, debe ver únicamente la información, menú y configuración correspondiente a ese local.

El usuario final NO debe tener que registrarse, iniciar sesión ni crear una cuenta.

La experiencia principal debe ser:

**Entrar → explorar el menú → elegir productos → personalizar el pedido → revisar el pedido → enviarlo por WhatsApp.**

### Pedidos

El objetivo principal es facilitar al máximo la realización de pedidos.

El usuario debe poder:

* Explorar categorías.
* Ver productos con imágenes, nombre, descripción y precio.
* Agregar productos al pedido.
* Modificar cantidades.
* Eliminar productos.
* Personalizar productos cuando corresponda.
* Agregar observaciones.
* Ver el total actualizado.
* Elegir entre las opciones de entrega/retiro que el local tenga habilitadas.
* Completar los datos necesarios para el pedido.
* Recibir una confirmación antes de enviarlo.
* Enviar el pedido directamente por WhatsApp.

El mensaje enviado por WhatsApp debe estar perfectamente estructurado y contener toda la información necesaria para que el restaurante pueda procesarlo.

### Horarios y disponibilidad

Cada local debe poder definir cuándo acepta pedidos.

El menú debe seguir siendo visible aunque el local esté cerrado.

Cuando el local está abierto:

**🟢 Estamos tomando pedidos**

El usuario puede realizar y enviar su pedido.

Cuando está cerrado:

**🔴 En este momento no estamos tomando pedidos**

El menú sigue siendo navegable, pero el usuario no puede enviar un pedido.

También debe mostrarse cuándo volverá a estar disponible para recibir pedidos.

La lógica de horarios debe pensarse desde el principio como una configuración propia de cada local, no como algo fijo en el código.

En el futuro cada local podrá configurar:

* Horarios por día.
* Días cerrados.
* Horarios especiales.
* Pausar temporalmente los pedidos.
* Tiempo estimado de preparación.
* Diferentes modalidades de entrega/retiro.

### Experiencia de usuario

La experiencia debe ser **mobile-first**, ya que la mayoría de los usuarios accederán desde teléfonos mediante un link, QR, Instagram, Google, etc.

Debe sentirse rápida, moderna, intuitiva y visual.

No quiero una interfaz genérica de e-commerce.

Debe sentirse como una aplicación propia del restaurante.

El usuario debería poder entender cómo pedir sin necesitar instrucciones.

### Funcionalidades que pueden diferenciar el producto

Además del menú y el pedido, quiero explorar funcionalidades que hagan que el producto sea más útil y novedoso que un simple menú PDF + botón de WhatsApp.

Algunas ideas a considerar:

* Productos más pedidos.
* Promociones destacadas.
* Recomendaciones dentro del menú.
* Combos.
* Productos personalizables.
* Información visual sobre ingredientes.
* Reviews/opiniones de clientes.
* Integración visual con Instagram.
* Información del local.
* Ubicación y cómo llegar.
* Estado actual del local.
* Tiempo estimado de preparación.
* Posibilidad de programar pedidos.
* Mensajes dinámicos según el estado del local.
* Experiencias que reduzcan la cantidad de pasos necesarios para realizar un pedido.

Estas funcionalidades deben evaluarse desde el punto de vista de **qué realmente facilita la experiencia del cliente**, evitando agregar funciones solamente por agregar.

### Arquitectura conceptual

El producto debe pensarse desde el principio como un sistema **multi-local**.

Cada local tendrá sus propios:

* Datos.
* Logo.
* Colores.
* Información.
* Productos.
* Categorías.
* Precios.
* Promociones.
* Horarios.
* Configuración de pedidos.
* Número de WhatsApp.

Pero todos utilizarán la misma plataforma y estructura general.

La personalización visual de cada local debe ser posible sin tener que desarrollar una web completamente diferente desde cero.

### Panel administrativo futuro

Aunque inicialmente estamos desarrollando solamente la experiencia pública, la arquitectura debe dejar preparado el concepto de un futuro panel administrativo donde cada local pueda gestionar:

* Productos.
* Categorías.
* Precios.
* Imágenes.
* Horarios.
* Promociones.
* Disponibilidad de productos.
* Modalidades de entrega.
* WhatsApp.
* Información del local.
* Configuración general.

No es necesario implementar este panel todavía, pero las decisiones actuales no deberían dificultar su incorporación posteriormente.

### Importante

No quiero que el producto se convierta en una plataforma compleja de delivery.

La idea es mantenerlo simple:

**El restaurante sigue utilizando WhatsApp para recibir y gestionar los pedidos.**

La plataforma se encarga de mejorar todo lo que ocurre ANTES de llegar a WhatsApp:

**descubrir → elegir → personalizar → revisar → confirmar → enviar.**

El objetivo principal es que pedir sea rápido, claro y agradable tanto para el cliente como para el restaurante.

Antes de comenzar a implementar funcionalidades, quiero que analices este concepto y propongas una estructura inicial del producto, arquitectura de pantallas y funcionalidades principales, diferenciando claramente entre:

1. Funcionalidades necesarias para el MVP.
2. Funcionalidades que pueden agregarse posteriormente.
3. Ideas experimentales que podrían hacer que el producto se destaque.
