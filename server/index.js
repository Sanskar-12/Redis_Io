import express from "express";
import { getProductById, getProducts } from "./api/products.js";
import Redis from "ioredis";
import { cachedData, rateLimiter } from "./middlewares/redis.js";

const app = express();

export const redis = new Redis({
  password: "U3poFJO56c9lFjtZlA2fiGEfH0qaIquL",
  host: "redis-10107.c99.us-east-1-4.ec2.redns.redis-cloud.com",
  port: 10107,
});

// Rate Limiting using Redis

app.get(
  "/",
  rateLimiter({ timer: 60, count: 10, key: "home" }),
  async (req, res) => {
    res.send(`Hello! `);
  }
);

app.get(
  "/products",
  rateLimiter({ timer: 60, count: 10, key: "products" }),
  cachedData("products"),
  async (req, res) => {
    let products = await getProducts();
    await redis.setex("products", 10, JSON.stringify(products));

    res.json(products);
  }
);

app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const key = `product:${id}`;
  let product = await redis.get(key);
  if (product) {
    return res.json(JSON.parse(product));
  }

  product = await getProductById(id);
  await redis.set(key, JSON.stringify(product));

  res.json(product);
});

app.get("/order/:id", async (req, res) => {
  const id = req.params.id;
  const key = `product:${id}`;

  // Request Order
  // decrease in quantity
  // Reflected in main database (Mongo)

  await redis.del(key);

  res.json({
    message: `Product ${id} ordered successfully`,
  });
});

app.listen(4000, () => {
  console.log("Server is Listening on port 4000");
});
