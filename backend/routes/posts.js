const express = require("express");
const router = express.Router();
const pool = require("../database");

router.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener los posts:", error);
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
    console.error("Error al agregar el post:", error);
    res.status(500).send("Error al agregar el post");
  }
});

router.put("/posts/like/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Post no encontrado");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al dar like al post:", error);
    res.status(500).send("Error al dar like al post");
  }
});

router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Post no encontrado");
    }

    res.json({ message: "Post eliminado", post: result.rows[0] });
  } catch (error) {
    console.error("Error al eliminar el post:", error);
    res.status(500).send("Error al eliminar el post");
  }
});

module.exports = router;
