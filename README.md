# Backend API - Entrega

Servidor desarrollado con **Node.js y Express** para gestionar productos y carritos.
Incluye **API REST**, **motor de plantillas Handlebars** y **actualización en tiempo real con WebSockets (Socket.io)**.

# Funcionalidades

* API REST para productos y carritos
* Persistencia de datos mediante archivos JSON
* Motor de plantillas **Handlebars**
* Actualización de productos en **tiempo real con WebSockets**
* Formularios para agregar y eliminar productos desde la interfaz web

---

# Vistas disponibles

### Home

Lista de productos renderizada con Handlebars.

```
http://localhost:8080/
```

### Productos en tiempo real

Vista que permite agregar y eliminar productos y ver la lista actualizarse automáticamente usando **WebSockets**.

```
http://localhost:8080/realtimeproducts
```

---

# Endpoints API

### Productos

```
GET    /api/products
GET    /api/products/:pid
POST   /api/products
PUT    /api/products/:pid
DELETE /api/products/:pid
```

### Carritos

```
POST /api/carts
GET  /api/carts/:cid
POST /api/carts/:cid/product/:pid
```

---

# Persistencia de datos

Los datos se almacenan en archivos JSON dentro de la carpeta:

```
data/products.json
data/carts.json
```

---

# Tecnologías utilizadas

* Node.js
* Express
* Handlebars
* Socket.io
* JavaScript
