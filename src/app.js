// app.js
import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { multiply } from "./helpers/handlebars.js"; // helper para carrito

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars con helper
app.engine("handlebars", engine({ helpers: { multiply } }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Pasamos io a los routers si lo necesitamos
app.set("io", io);

// Routers
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Socket.io básico
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// 🔥 Conexión a Mongo y levantar servidor
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => {
    console.log("Mongo conectado");

    httpServer.listen(8080, () => {
      console.log("Servidor corriendo en http://localhost:8080");
    });
  })
  .catch(err => console.error(err));