import express from "express";
import { getProducts } from "./api/products.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/products", async (req, res) => {
  const products = await getProducts();

  res.json(products);
});

app.listen(4000, () => {
  console.log("Server is Listening on port 4000");
});
