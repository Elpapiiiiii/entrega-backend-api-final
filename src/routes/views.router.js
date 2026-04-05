import { Router } from "express";
import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";

const router = Router();

// Lista de productos con paginación
router.get("/products", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await Product.paginate({}, { page, limit, lean: true });

  res.render("products", {
    products: result.docs,
    page: result.page,
    totalPages: result.totalPages,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
    nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
  });
});

// Detalle de un producto
router.get("/products/:pid", async (req, res) => {
  const product = await Product.findById(req.params.pid).lean();
  if (!product) return res.status(404).send("Producto no encontrado");
  res.render("product", { product });
});

// Carrito por ID
router.get("/carts/:cid", async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
  if (!cart) return res.status(404).send("Carrito no encontrado");
  res.render("cart", { cart });
});

export default router;