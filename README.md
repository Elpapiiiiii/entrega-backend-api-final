🛒 Proyecto Backend Ecommerce
📌 Descripción

Este proyecto es una aplicación backend desarrollada con Node.js, Express y MongoDB. Permite gestionar productos y carritos de compra, incluyendo vistas renderizadas con Handlebars.

El sistema incluye funcionalidades completas de carrito y paginación de productos.

🚀 Tecnologías utilizadas
Node.js
Express
MongoDB
Mongoose
Handlebars
mongoose-paginate-v2
📦 Funcionalidades
🛍️ Productos
Listado de productos con paginación
Detalle de producto
🛒 Carrito
Crear carrito
Agregar productos al carrito
Eliminar productos del carrito
Vaciar carrito
Visualizar carrito con productos (populate)
🔗 Endpoints principales
Productos
GET /products
GET /products/:pid
Carritos
POST /api/carts
GET /api/carts/:cid
POST /api/carts/:cid/products/:pid
DELETE /api/carts/:cid/products/:pid
DELETE /api/carts/:cid
