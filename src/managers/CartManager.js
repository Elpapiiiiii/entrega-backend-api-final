import fs from "fs/promises";
import path from "path";

export default class CartManager {
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

  async createCart() {
    const carts = await this.#readAll();

    const newId =
      carts.length === 0 ? 1 : Math.max(...carts.map((c) => Number(c.id))) + 1;

    const newCart = {
      id: newId,
      products: [],
    };

    carts.push(newCart);
    await this.#writeAll(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.#readAll();
    return carts.find((c) => String(c.id) === String(id)) || null;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.#readAll();
    const cartIndex = carts.findIndex((c) => String(c.id) === String(cartId));
    if (cartIndex === -1) return null;

    const cart = carts[cartIndex];

    const itemIndex = cart.products.findIndex(
      (item) => String(item.product) === String(productId)
    );

    if (itemIndex === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[itemIndex].quantity += 1;
    }

    carts[cartIndex] = cart;
    await this.#writeAll(carts);
    return cart;
  }
}
