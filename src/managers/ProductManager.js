import fs from "fs/promises";
import path from "path";

export default class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async #ensureFile() {
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.writeFile(this.filePath, "[]", "utf-8");
    }
  }

  async #readAll() {
    await this.#ensureFile();
    const data = await fs.readFile(this.filePath, "utf-8");
    return JSON.parse(data || "[]");
  }

  async #writeAll(items) {
    await this.#ensureFile();
    await fs.writeFile(this.filePath, JSON.stringify(items, null, 2), "utf-8");
  }

  #validateRequiredFields(product) {
    const required = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
      "thumbnails",
    ];

    for (const key of required) {
      if (product[key] === undefined) return `Falta el campo requerido: ${key}`;
    }

    if (typeof product.title !== "string") return "title debe ser string";
    if (typeof product.description !== "string") return "description debe ser string";
    if (typeof product.code !== "string") return "code debe ser string";
    if (typeof product.price !== "number") return "price debe ser number";
    if (typeof product.status !== "boolean") return "status debe ser boolean";
    if (typeof product.stock !== "number") return "stock debe ser number";
    if (typeof product.category !== "string") return "category debe ser string";
    if (!Array.isArray(product.thumbnails)) return "thumbnails debe ser array";

    return null;
  }

  async getProducts() {
    return await this.#readAll();
  }

  async getProductById(id) {
    const products = await this.#readAll();
    return products.find((p) => String(p.id) === String(id)) || null;
  }

  async addProduct(productData) {
    const error = this.#validateRequiredFields(productData);
    if (error) throw new Error(error);

    const products = await this.#readAll();

    const codeExists = products.some((p) => p.code === productData.code);
    if (codeExists) throw new Error("Ya existe un producto con ese code");

    const newId =
      products.length === 0
        ? 1
        : Math.max(...products.map((p) => Number(p.id))) + 1;

    const newProduct = {
      id: newId,
      ...productData,
    };

    products.push(newProduct);
    await this.#writeAll(products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.#readAll();
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return null;

    // No se permite tocar el id
    const { id: ignoredId, ...safeUpdates } = updates;

    const updated = {
      ...products[index],
      ...safeUpdates,
      id: products[index].id,
    };

    products[index] = updated;
    await this.#writeAll(products);
    return updated;
  }

  async deleteProduct(id) {
    const products = await this.#readAll();
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return false;

    products.splice(index, 1);
    await this.#writeAll(products);
    return true;
  }
}
