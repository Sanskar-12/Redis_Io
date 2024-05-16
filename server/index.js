import express from "express";
import { getProductById, getProducts } from "./api/products.js";
import Redis from "ioredis";

const app = express();

const redis = new Redis({
  password: "U3poFJO56c9lFjtZlA2fiGEfH0qaIquL",
  host: "redis-10107.c99.us-east-1-4.ec2.redns.redis-cloud.com",
  port: 10107,
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/products", async (req, res) => {
  let products = await redis.get("products");
  if (products) {
    return res.json(JSON.parse(products));
  }

  products = await getProducts();
  await redis.setex("products", 10, JSON.stringify(products));

  res.json(products);
});

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
app.listen(4000, () => {
  console.log("Server is Listening on port 4000");
});
