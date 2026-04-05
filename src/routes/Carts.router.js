import { Router } from "express";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

const router = Router();

// 🔹 POST crear carrito vacío
router.post("/", async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({
      status: "success",
      payload: newCart
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// 🔹 GET carrito por ID con productos completos (populate)
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    res.json({
      status: "success",
      payload: cart
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// 🔹 POST agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.json({ status: "success", payload: cart });

  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// 🔹 DELETE producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);

    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: "success", message: "Producto eliminado" });

  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// 🔹 PUT actualizar todos los productos del carrito
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // [{product: pid, quantity: x}, ...]

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    cart.products = products;
    await cart.save();

    res.json({ status: "success", payload: cart });

  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// 🔹 PUT actualizar cantidad de un producto específico
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (quantity < 0) return res.status(400).json({ status: "error", message: "Quantity inválida" });

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex === -1) return res.status(404).json({ status: "error", message: "Producto no encontrado en carrito" });

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.json({ status: "success", payload: cart });

  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// 🔹 DELETE vaciar carrito completo
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);

    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    res.json({ status: "success", message: "Carrito vaciado" });

  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;