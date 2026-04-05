import { Router } from "express";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

const router = Router();

// 🔹 POST crear carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });

    res.status(201).json({
      status: "success",
      payload: newCart
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// 🔹 GET carrito
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product");

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

// 🔥 🔥 ESTE ES EL IMPORTANTE 🔥 🔥
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    console.log("CID:", cid);
    console.log("PID:", pid);

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    const index = cart.products.findIndex(
      p => p.product.toString() === pid
    );

    if (index !== -1) {
      cart.products[index].quantity += quantity;
    } else {
      cart.products.push({
        product: pid,
        quantity
      });
    }

    await cart.save();

    res.json({
      status: "success",
      payload: cart
    });

  } catch (error) {
    console.error("ERROR ADD PRODUCT:", error);
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// 🔹 DELETE producto
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);

    cart.products = cart.products.filter(
      p => p.product.toString() !== pid
    );

    await cart.save();

    res.json({
      status: "success",
      message: "Producto eliminado"
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// 🔹 DELETE carrito completo
router.delete("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);

    cart.products = [];

    await cart.save();

    res.json({
      status: "success",
      message: "Carrito vaciado"
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

export default router;