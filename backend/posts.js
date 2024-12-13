const express = require("express");
const router = express.Router();
const pool = require("../database");


router.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los posts");
  }
});


router.post("/posts", async (req, res) => {
  const { titulo, url, descripcion } = req.body;

  if (!titulo || !url || !descripcion) {
    return res.status(400).send("Todos los campos son obligatorios");
  }

  try {
    await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0)",
      [titulo, url, descripcion]
    );
    res.status(201).send("Post agregado exitosamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar el post");
  }
});

module.exports = router;
