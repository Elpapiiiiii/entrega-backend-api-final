import { Router } from "express";
import Product from "../models/Product.model.js";

const router = Router();

// 🔥 GET productos profesional
router.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    let filter = {};

    // 🔹 Filtrar por categoría o disponibilidad
    if (query) {
      const [key, value] = query.split(":");
      if (key === "status") filter[key] = value === "true"; // booleano
      else filter[key] = value;
    }

    let options = {
      page,
      limit,
      lean: true
    };

    // 🔹 Ordenar por precio
    if (sort) {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    // 🔹 Paginate
    const result = await Product.paginate(filter, options);

    // 🔹 Links prev/next completos
    const baseUrl = "/api/products";
    const prevLink = result.hasPrevPage
      ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
      : null;
    const nextLink = result.hasNextPage
      ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
      : null;

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// 🔥 POST crear producto
router.post("/", async (req, res) => {
  try {
    const { title, price, stock, category } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios (title, price)"
      });
    }

    const newProduct = await Product.create({
      title,
      price,
      stock,
      category
    });

    res.status(201).json({
      status: "success",
      payload: newProduct
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// 🔥 GET producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await Product.findById(pid);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    res.json({
      status: "success",
      payload: product
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// 🔥 DELETE producto por ID
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const result = await Product.findByIdAndDelete(pid);

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

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

// 🔥 PUT actualizar producto por ID
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      pid,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    res.json({
      status: "success",
      payload: updatedProduct
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// ✅ EXPORTAR router AL FINAL
export default router;